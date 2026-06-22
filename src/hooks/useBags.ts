import { useQuery } from '@tanstack/react-query';
import { QueryConstraint, where } from 'firebase/firestore';
import { fetchAllBags, getBagById } from '../functions/funBags';
import { Bag, Category } from '../types';

function useBags(category?: Category) {
    const constraints: QueryConstraint[] = category ? [where('category', '==', category)] : [];

    return useQuery<Bag[], Error>({
        queryKey: ['bag', category || 'all'],
        queryFn: () => fetchAllBags(constraints),
        staleTime: 1000 * 60 * 5,
    });
}

function useBag(bagId: string) {
    return useQuery<Bag | null, Error>({
        queryKey: ['bag', bagId],
        queryFn: () => getBagById(bagId),
        staleTime: 1000 * 60 * 5,
    });
}

export { useBag, useBags };

