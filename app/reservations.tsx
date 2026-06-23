import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ReservationCard } from '../src/components';
import { useAuth, useUserReservationsInfinite } from '../src/hooks';

export default function ReservationsScreen() {
    const { user } = useAuth();
    const router = useRouter();

    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useUserReservationsInfinite(user?.uid || '');

    const reservations = data?.pages.flatMap(page => page.reservations) ?? [];

    const handleEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-red-500">Error loading reservations</Text>
            </View>
        );
    }

    if (!reservations || reservations.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-500 text-lg">No reservations yet</Text>
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Browse Bags</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={reservations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ReservationCard reservation={item} />}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <ActivityIndicator size="small" color="#3B82F6" />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}