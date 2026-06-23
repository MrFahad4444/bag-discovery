import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { createReservation, fetchUserReservations, fetchUserReservationsPaginated } from '../functions/funReservations';

// Create a reservation
function useCreateReservation() {
    return useMutation({
        mutationFn: ({ bagId, userId }: { bagId: string; userId: string }) =>
            createReservation(bagId, userId),
    });
}

// Fetch user's reservations (simple)
function useUserReservations(userId: string) {
    return useQuery({
        queryKey: ['reservations', userId],
        queryFn: () => fetchUserReservations(userId),
        staleTime: 1000 * 60 * 5,
    });
}

// Fetch user's reservations with infinite scroll
function useUserReservationsInfinite(userId: string) {
    return useInfiniteQuery({
        queryKey: ['reservations-infinite', userId],
        queryFn: async ({ pageParam = 0 }) => {
            return fetchUserReservationsPaginated(userId, pageParam as number);
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.pageNumber : undefined;
        },
        initialPageParam: 0,
    });
}

export { useCreateReservation, useUserReservations, useUserReservationsInfinite };
