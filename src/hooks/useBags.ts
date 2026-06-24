import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QueryConstraint, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { fetchAllBags, fetchPaginatedBags, getBagById, listenToBag } from '../functions/funBags';
import { Bag, Category } from '../types';

/**
 * Fetches all bags with optional category filtering.
 *
 * @param category - Optional bag category filter
 *
 * React Query:
 * - queryKey identifies and caches the query
 * - queryFn handles the data fetching logic
 * - staleTime defines how long cached data stays fresh
 */
function useBags(category?: Category) {
    const constraints: QueryConstraint[] = category ? [where('category', '==', category)] : [];

    return useQuery<Bag[], Error>({
        queryKey: ['bags', category || 'all'],
        queryFn: () => fetchAllBags(constraints),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Fetches paginated bags for infinite scrolling.
 *
 * @param category - Optional bag category filter
 *
 * React Query Infinite Query:
 * - queryKey identifies and caches pages
 * - queryFn fetches each page
 * - getNextPageParam controls pagination flow
 * - initialPageParam sets the starting page
 */
function useBagsInfinite(category?: Category) {
    const constraints: QueryConstraint[] = category ? [where('category', '==', category)] : [];

    return useInfiniteQuery({
        queryKey: ['bags-infinite', category || 'all'],
        queryFn: async ({ pageParam = 0 }) => {
            return fetchPaginatedBags(constraints, pageParam as number);
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.pageNumber : undefined;
        },
        initialPageParam: 0,
    });
}


/**
 * Fetches a single bag using its document ID.
 *
 * @param bagId - Firestore document ID of the bag
 *
 * React Query:
 * - queryKey uniquely caches the bag
 * - queryFn handles fetching the document
 * - staleTime controls cache freshness duration
 */
function useBag(bagId: string) {
    return useQuery<Bag | null, Error>({
        queryKey: ['bags', bagId],
        queryFn: () => getBagById(bagId),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * React hook that listens to a single bag document in real-time.
 *
 * Automatically subscribes to Firestore updates for the given bagId
 * and keeps local state in sync with database changes.
 *
 * @param bagId - Unique ID of the bag to listen to
 * @returns Object containing:
 *  - bag: current bag data or null
 *  - isLoading: loading state while listener initializes
 *  - error: any Firestore listener error
 */
function useBagListener(bagId: string) {
    const [bag, setBag] = useState<Bag | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!bagId) {
            setBag(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const unsubscribe = listenToBag(
            bagId,
            (updatedBag) => {
                setBag(updatedBag);
                setError(null);
                setIsLoading(false);
            },
            (err) => {
                setError(err);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [bagId]);

    return { bag, isLoading, error };
}

export { useBag, useBagListener, useBags, useBagsInfinite };

