import { useMutation, useQuery } from '@tanstack/react-query';
import { createReservation, fetchUserReservations } from '../functions/funReservations';

function useCreateReservation() {
    return useMutation({
        mutationFn: ({ bagId, userId }: { bagId: string; userId: string }) => createReservation(bagId, userId),
    });
}

function useUserReservations(userId: string) {
    return useQuery({
        queryKey: ['reservations', userId],
        queryFn: () => fetchUserReservations(userId),
        staleTime: 1000 * 60 * 5,
    });
}

export { useCreateReservation, useUserReservations };

