import { Text, View } from 'react-native';
import { Reservation } from '../types';

interface ReservationCardProps {
    reservation: Reservation;
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
    return (
        <View className="bg-white rounded-lg p-4 m-3 shadow-sm">
            <Text className="text-sm text-gray-500 mb-4 text-center font-semibold">
                Reservation #{reservation.id.substring(0, 8)}
            </Text>

            <View className="space-y-3">
                <View className="flex-row justify-between items-center border-b border-gray-200  py-3">
                    <Text className="text-gray-600">Bag ID</Text>
                    <Text className="font-semibold text-gray-900 text-xs">
                        {reservation.bagId.substring(0, 8)}
                    </Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-gray-200 py-3">
                    <Text className="text-gray-600">Status</Text>
                    <Text className={`font-semibold ${reservation.status === 'confirmed'
                        ? 'text-green-600'
                        : reservation.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </Text>
                </View>

                <View className="flex-row justify-between items-center py-3">
                    <Text className="text-gray-600">Reserved At</Text>
                    <Text className="font-semibold text-gray-900 text-sm">
                        {new Date(reservation.createdAt.seconds * 1000).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </View>
    );
}