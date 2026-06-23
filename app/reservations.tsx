import { Status } from '@/src/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { EmptyListState, ReservationCard } from '../src/components';
import { useAuth, useUpdateReservationStatus, useUserReservationsListener } from '../src/hooks';

export default function ReservationsScreen() {
    const { user } = useAuth();
    const router = useRouter();

    // Track which reservation and status is updating
    const [updatingState, setUpdatingState] = useState<{
        reservationId: string | null;
        status: 'confirmed' | 'cancelled' | 'pending' | null;
    }>({ reservationId: null, status: null });

    // Get reservations from real-time listener
    const { reservations, loading, error } = useUserReservationsListener(
        user?.uid || ''
    );

    // Update reservation status mutation
    const { mutate: updateStatus } = useUpdateReservationStatus();

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

    const stateView = EmptyListState({
        loading,
        error,
        data: reservations,

        emptyMessage: 'No reservations yet',
        errorMessage: 'Error loading reservations',

        buttonText: 'Browse Bags',
        onButtonPress: () => router.push('/'),
    });


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
                            isUpdating={updatingState.reservationId === item.id}
                            updatingStatus={updatingState.status}
                        />
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
            />
        </View>
    );
}