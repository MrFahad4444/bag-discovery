import { showLocalNotification } from '@/src/utils/utilNotification';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth, useBag, useCreateReservation, useTranslation } from '../../src/hooks';

export default function BagDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const { data: bag, isLoading, error } = useBag(id || '');
    const { mutate: createReservation, isPending } = useCreateReservation();
    const router = useRouter();
    const { t, language } = useTranslation();

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
                <Text className="text-red-500 text-lg font-semibold">
                    {t('bagNotFound')}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-6 bg-blue-500 px-8 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">{t('goBack')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleReserve = () => {
        if (!user?.uid) {
            Alert.alert(t('error'), t('userNotAuthenticated'));
            return;
        }

        if (bag.quantityRemaining === 0) {
            Alert.alert(t('error'), t('noLongerAvailable'));
            return;
        }

        createReservation(
            { bagId: bag.id, userId: user.uid },
            {
                onSuccess: () => {
                    showLocalNotification(
                        t('reservationConfirmed'),   // "Reservation Confirmed!" or "تم تأكيد الحجز!"
                        t('reservationSuccessMsg')   // "Your bag has been reserved..." or "تم حجز كيسك بنجاح."
                    );
                    router.push('/confirmation');
                },
                onError: (error: Error) => {
                    Alert.alert(t('error'), t('failedToReserve') + error.message);
                },
            }
        );
    };

    const pickupStartTime = new Date(bag.pickupStart.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pickupEndTime = new Date(bag.pickupEnd.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const savingsAmount = bag.originalPriceSAR - bag.priceSAR;
    const discountPercent = Math.round((savingsAmount / bag.originalPriceSAR) * 100);

    // Evaluate localization object safely based on context state
    const localizedBagName = language === 'ar' && bag.name.ar ? bag.name.ar : bag.name.en;

    // Direct object lookup safety conversion for category definitions
    const categoryKey = bag.category.toLowerCase() as 'bakery' | 'restaurant' | 'grocery';
    const localizedCategory = t(categoryKey);

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Image banner stays fixed wrapper design */}
            <Image
                source={{ uri: bag.imageUrl }}
                className="w-full h-80 bg-gray-200"
            />

            {/* Content section uses pure flow mechanics from parent context */}
            <View className="px-6 py-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-sm text-gray-500 font-medium mb-1">
                        {bag.restaurantName}
                    </Text>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        {localizedBagName}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md font-semibold">
                            {localizedCategory}
                        </Text>
                    </View>
                </View>

                {/* Price Box wrapper adjusts structural order layouts implicitly */}
                <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <View className="flex-row items-baseline gap-2 mb-2">
                        <Text className="text-4xl font-bold text-green-600">
                            {bag.priceSAR}
                        </Text>
                        <Text className="text-lg text-gray-600">{t('sar')}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Text className="line-through text-gray-400 text-lg">
                            {bag.originalPriceSAR} {t('sar')}
                        </Text>
                        <Text className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            {t('save')} {discountPercent}%
                        </Text>
                    </View>
                </View>

                {/* Details Grid table structure swaps inline directions cleanly */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">{t('details')}</Text>

                    <View className="border-t border-gray-200">
                        <View className="flex-row justify-between py-4 border-b border-gray-200">
                            <Text className="text-gray-600">{t('quantityAvailable')}</Text>
                            <Text className={`font-bold ${bag.quantityRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {bag.quantityRemaining} {t('bags')}
                            </Text>
                        </View>

                        <View className="flex-row justify-between py-4 border-b border-gray-200">
                            <Text className="text-gray-600">{t('pickupWindow')}</Text>
                            <View>
                                <Text className="font-semibold text-gray-900 text-sm">
                                    {pickupStartTime} - {pickupEndTime}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between py-4">
                            <Text className="text-gray-600">{t('category')}</Text>
                            <Text className="font-semibold text-gray-900">
                                {localizedCategory}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Warning Notification Banner Box */}
                {bag.quantityRemaining > 10 ? (
                    <View className="p-4 mb-8" />
                ) : (
                    <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <Text className="text-sm text-blue-900 font-medium">
                            ℹ️ {t('hurryUp')}
                        </Text>
                    </View>
                )}

                {/* Reserve Action Button */}
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
                        {isPending ? t('reserving') : bag.quantityRemaining === 0 ? t('outOfStock') : t('reserveNow')}
                    </Text>
                </TouchableOpacity>

                {/* Cancellation Navigation Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="py-3 rounded-lg bg-gray-200"
                >
                    <Text className="text-gray-900 text-center font-semibold">
                        {t('goBack')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
