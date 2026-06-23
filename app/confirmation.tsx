import { ReservationCard } from '@/src/components';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth, useUserReservations } from '../src/hooks';

export default function ConfirmationScreen() {
    const { user } = useAuth();
    const { data: reservations = [] } = useUserReservations(user?.uid || '');
    const router = useRouter();

    const latestReservation = reservations[0];

    const handleViewReservations = () => {
        router.back(); // Pop confirmation
        router.back(); // Pop detail screen
        router.push('/reservations'); // Go to reservations
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-6 py-12">
                {/* Success Icon */}
                <View className="w-20 h-20 bg-green-100 rounded-full justify-center items-center mb-6">
                    <Text className="text-4xl">✓</Text>
                </View>

                {/* Title */}
                <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
                    Reservation Confirmed!
                </Text>

                {/* Message */}
                <Text className="text-gray-600 text-center text-lg mb-8">
                    Your bag has been reserved successfully.
                </Text>

                {/* Reservation Details */}
                {latestReservation && (
                    <View className="w-full mb-5">
                        <ReservationCard reservation={latestReservation} />
                    </View>
                )}

                {/* Buttons */}
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                        router.back();
                    }}
                    className="w-full bg-blue-500 py-4 rounded-lg mb-3"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Back to Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleViewReservations}
                    className="w-full bg-gray-200 py-4 rounded-lg"
                >
                    <Text className="text-gray-900 text-center font-semibold text-lg">
                        View My Reservations
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}