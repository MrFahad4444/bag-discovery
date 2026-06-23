import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createReservation, fetchUserReservations, listenToUserReservations, updateReservationStatus } from '../functions/funReservations';
import { Reservation, Status } from '../types';

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

function useUpdateReservationStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            reservationId: string;
            status: Status;
            bagId: string;  // Add this
        }) => {
            return updateReservationStatus(
                params.reservationId,
                params.status,
                params.bagId  // Pass it
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            queryClient.invalidateQueries({ queryKey: ['reservations-infinite'] });
        },
    });
}

function useUserReservationsListener(userId: string) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = listenToUserReservations(
            userId,
            (data) => {
                setReservations(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    return { reservations, loading, error };

}

export { useCreateReservation, useUpdateReservationStatus, useUserReservations, useUserReservationsListener };

