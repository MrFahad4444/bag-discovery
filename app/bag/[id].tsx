import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth, useBag, useCreateReservation } from '../../src/hooks';


export default function BagDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const { data: bag, isLoading, error } = useBag(id || '');
    const { mutate: createReservation, isPending } = useCreateReservation();
    const router = useRouter();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error || !bag) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-6">
                <Text className="text-red-500 text-center text-lg font-semibold">
                    Bag not found
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-6 bg-blue-500 px-8 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleReserve = () => {
        if (!user?.uid) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }

        if (bag.quantityRemaining === 0) {
            Alert.alert('Error', 'This bag is no longer available');
            return;
        }

        createReservation(
            { bagId: bag.id, userId: user.uid },
            {
                onSuccess: () => {
                    router.push('/confirmation');
                },
                onError: (error: Error) => {
                    Alert.alert('Error', 'Failed to reserve bag: ' + error.message);
                },
            }
        );
    };

    const pickupStartTime = new Date(bag.pickupStart.seconds * 1000).toLocaleTimeString();
    const pickupEndTime = new Date(bag.pickupEnd.seconds * 1000).toLocaleTimeString();
    const savingsAmount = bag.originalPriceSAR - bag.priceSAR;
    const discountPercent = Math.round((savingsAmount / bag.originalPriceSAR) * 100);

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Image */}
            <Image
                source={{ uri: bag.imageUrl }}
                className="w-full h-80 bg-gray-200"
            />

            {/* Content */}
            <View className="px-6 py-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-sm text-gray-500 font-medium mb-1">
                        {bag.restaurantName}
                    </Text>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        {bag.name.en}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {bag.category.charAt(0).toUpperCase() + bag.category.slice(1)}
                        </Text>
                    </View>
                </View>

                {/* Price Section */}
                <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <View className="flex-row items-baseline gap-2 mb-2">
                        <Text className="text-4xl font-bold text-green-600">
                            {bag.priceSAR}
                        </Text>
                        <Text className="text-lg text-gray-600">SAR</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Text className="line-through text-gray-400 text-lg">
                            {bag.originalPriceSAR} SAR
                        </Text>
                        <Text className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            Save {discountPercent}%
                        </Text>
                    </View>
                </View>

                {/* Details Grid */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Details</Text>

                    <View className="border-t border-gray-200">
                        <View className="flex-row justify-between py-4 border-b border-gray-200">
                            <Text className="text-gray-600">Quantity Available</Text>
                            <Text className={`font-bold ${bag.quantityRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {bag.quantityRemaining} bags
                            </Text>
                        </View>

                        <View className="flex-row justify-between py-4 border-b border-gray-200">
                            <Text className="text-gray-600">Pickup Window</Text>
                            <View className="text-right">
                                <Text className="font-semibold text-gray-900 text-sm">
                                    {pickupStartTime} - {pickupEndTime}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between py-4">
                            <Text className="text-gray-600">Category</Text>
                            <Text className="font-semibold text-gray-900">
                                {bag.category.charAt(0).toUpperCase() + bag.category.slice(1)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Info Box */}
                <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <Text className="text-sm text-blue-900 font-medium">
                        ℹ️ Hurry up! Limited stock available. Reserve now to secure your bag.
                    </Text>
                </View>

                {/* Reserve Button */}
                <TouchableOpacity
                    onPress={handleReserve}
                    disabled={isPending || bag.quantityRemaining === 0}
                    className={`py-4 rounded-lg mb-3 ${bag.quantityRemaining === 0
                            ? 'bg-gray-300'
                            : isPending
                                ? 'bg-blue-400'
                                : 'bg-blue-500'
                        }`}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isPending ? 'Reserving...' : bag.quantityRemaining === 0 ? 'Out of Stock' : 'Reserve Now'}
                    </Text>
                </TouchableOpacity>

                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="py-3 rounded-lg bg-gray-200"
                >
                    <Text className="text-gray-900 text-center font-semibold">
                        Go Back
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}