import { Status } from '@/src/types';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { EmptyListState, ReservationCard } from '../../src/components';
import { useAuth, useTranslation, useUpdateReservationStatus, useUserReservationsListener } from '../../src/hooks';


/**
 * ReservationsScreen
 *
 * Displays user reservations using realtime listener (Firestore).
 * Handles:
 * - loading / error / empty states via EmptyListState
 * - reservation status updates (confirm / cancel / pending)
 * - optimistic UI state tracking for updates
 * - FlatList rendering for performance
 */
export default function ReservationsScreen() {
    // Current authenticated user
    const { user } = useAuth();

    // Translation helper (i18n)
    const { t } = useTranslation();

    /**
     * Tracks which reservation is currently being updated.
     * Prevents multiple simultaneous status updates UI confusion.
     */
    const [updatingState, setUpdatingState] = useState<{
        reservationId: string | null;
        status: 'confirmed' | 'cancelled' | 'pending' | null;
    }>({ reservationId: null, status: null });

    /**
     * Realtime reservation listener
     * Keeps UI synced with Firestore changes automatically.
     */
    const { reservations, loading, error } = useUserReservationsListener(
        user?.uid || ''
    );

    /**
     * Mutation for updating reservation status in Firestore
     * Handles confirm / cancel / pending transitions.
     */
    const { mutate: updateStatus } = useUpdateReservationStatus();

    /**
     * Handles reservation status change
     * Updates UI state + triggers Firestore mutation
     */
    const handleStatusChange = (
        reservationId: string,
        bagId: string,
        status: 'confirmed' | 'cancelled' | 'pending'
    ) => {
        setUpdatingState({ reservationId, status });
        updateStatus(
            { reservationId, status: status as Status, bagId },
            {
                onSuccess: () => {
                    setUpdatingState({ reservationId: null, status: null });
                },
                onError: () => {
                    setUpdatingState({ reservationId: null, status: null });
                },
            }
        );
    };

    /**
     * Centralized UI handler for loading, error, and empty states.
     *
     * Keeps screen components clean by removing repeated UI logic
     * for common data states like loading, error, and empty list.
     *
     * Returns a React element (or null when data exists).
     */
    const stateView = EmptyListState({
        loading,
        error,
        data: reservations,

        emptyMessage: t('noReservationsYet'),
        errorMessage: t('errorLoadingReservations'),

        buttonText: t('browseBags'),
        onButtonPress: () => { },
    });


    // If loading/error/empty state exists, render that instead of list
    if (stateView) {
        return stateView;
    }

    return (
        <View className="flex-1 bg-gray-50">

            <FlatList
                data={reservations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="mb-4">
                        <ReservationCard
                            reservation={item}
                            isHistory={true}
                            onStatusChange={(status) =>
                                handleStatusChange(item.id, item.bagId, status)
                            }
                            // isUpdating={updatingState.reservationId === item.id}
                            updatingStatus={updatingState.status}
                        />
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
            />
        </View>
    );
}