import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QueryConstraint, where } from 'firebase/firestore';
import { fetchAllBags, fetchPaginatedBags, getBagById } from '../functions/funBags';
import { Bag, Category } from '../types';

function useBags(category?: Category) {
    const constraints: QueryConstraint[] = category ? [where('category', '==', category)] : [];

    return useQuery<Bag[], Error>({
        queryKey: ['bags', category || 'all'],
        queryFn: () => fetchAllBags(constraints),
        staleTime: 1000 * 60 * 5,
    });
}

// New hook for infinite scroll
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

function useBag(bagId: string) {
    return useQuery<Bag | null, Error>({
        queryKey: ['bags', bagId],
        queryFn: () => getBagById(bagId),
        staleTime: 1000 * 60 * 5,
    });
}

export { useBag, useBags, useBagsInfinite };

