import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createReservation, fetchUserReservations, listenToUserReservations, updateReservationStatus } from '../functions/funReservations';
import { Reservation, Status } from '../types';

/**
 * Creates a new reservation mutation.
 *
 * React Query Mutation:
 * - mutationFn handles reservation creation
 * - manages loading and error mutation states
 */
function useCreateReservation() {
    return useMutation({
        mutationFn: ({ bagId, userId }: { bagId: string; userId: string }) =>
            createReservation(bagId, userId),
    });
}

/**
 * Fetches all reservations belonging to a user.
 *
 * @param userId - Current authenticated user ID
 *
 * React Query:
 * - queryKey caches reservations per user
 * - queryFn handles reservation fetching
 * - staleTime controls cache freshness
 */
function useUserReservations(userId: string) {
    return useQuery({
        queryKey: ['reservations', userId],
        queryFn: () => fetchUserReservations(userId),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Updates reservation status and refreshes
 * related reservation queries automatically.
 *
 * React Query Mutation:
 * - mutationFn handles reservation updates
 * - onSuccess refreshes cached queries
 */
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

/**
 * Real-time reservation listener hook.
 *
 * @param userId - Current authenticated user ID
 *
 * Uses Firestore snapshot listeners to keep
 * reservation data synced in real time.
 */
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

