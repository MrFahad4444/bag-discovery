import { Reservation } from '@/src/types';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../hooks';

interface ReservationCardProps {
    reservation: Reservation;
    isHistory?: boolean;
    onStatusChange?: (status: 'confirmed' | 'cancelled' | 'pending') => void;
    isUpdating?: boolean;
    updatingStatus?: 'confirmed' | 'cancelled' | 'pending' | null;
}

export default function ReservationCard({
    reservation,
    isHistory = false,
    onStatusChange,
    isUpdating = false,
    updatingStatus = null,
}: ReservationCardProps) {

    const { t } = useTranslation();


    const isConfirmed = reservation.status === 'confirmed';
    const isCancelled = reservation.status === 'cancelled';

    return (
        <View className="bg-white rounded-lg shadow-sm overflow-hidden">

            {/* Title */}
            <View className="px-5">
                <Text className="text-center text-sm text-gray-500 mb-4 font-semibold mt-6">
                    {t('reservations')} #{reservation.id.substring(0, 8)}
                </Text>

                {/* Details */}
                <View>
                    <View className="flex-row justify-between items-center border-b border-gray-200 pb-4 py-4">
                        <Text className="text-gray-600">{t('bagId')}</Text>
                        <Text className="font-semibold text-gray-900 text-xs">
                            {reservation.bagId.substring(0, 8)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center border-b border-gray-200 pb-4 py-4">
                        <Text className="text-gray-600">{t('status')}</Text>
                        <Text
                            className={`font-semibold ${reservation.status === 'confirmed'
                                ? 'text-green-600'
                                : reservation.status === 'pending'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}
                        >
                            {t(reservation.status)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center pb-4 py-4">
                        <Text className="text-gray-600">{t('reservedAt')}</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {new Date(reservation.createdAt.seconds * 1000).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons (only in history view) */}
            {isHistory && (
                <>
                    {/* Pending State - Show Confirm/Cancel buttons */}
                    {!isConfirmed && !isCancelled && (
                        <View className="flex-row mt-4">

                            {/* Confirm Button */}
                            <TouchableOpacity
                                onPress={() => onStatusChange?.('confirmed')}
                                disabled={isUpdating}
                                className={`flex-1 py-4 flex-row justify-center items-center gap-2 ${isUpdating && updatingStatus === 'confirmed'
                                    ? 'bg-green-100'
                                    : 'bg-green-200'
                                    }`}
                            >
                                {isUpdating && updatingStatus === 'confirmed' ? (
                                    <ActivityIndicator size="small" color="#16a34a" />
                                ) : (
                                    <MaterialIcons name="check-circle" size={18} color="#16a34a" />
                                )}

                                <Text
                                    className={`text-center font-bold text-md ${isUpdating && updatingStatus === 'confirmed'
                                        ? 'text-green-400'
                                        : 'text-green-600'
                                        }`}
                                >
                                    {t('confirm')}
                                </Text>
                            </TouchableOpacity>

                            {/* Cancel Button */}
                            <TouchableOpacity
                                onPress={() => onStatusChange?.('cancelled')}
                                disabled={isUpdating}
                                className={`flex-1 py-4 flex-row justify-center items-center gap-2 ${isUpdating && updatingStatus === 'cancelled'
                                    ? 'bg-red-100'
                                    : 'bg-red-200'
                                    }`}
                            >
                                {isUpdating && updatingStatus === 'cancelled' ? (
                                    <ActivityIndicator size="small" color="#dc2626" />
                                ) : (
                                    <MaterialIcons name="cancel" size={18} color="#dc2626" />
                                )}

                                <Text
                                    className={`text-center font-bold text-md ${isUpdating && updatingStatus === 'cancelled'
                                        ? 'text-red-400'
                                        : 'text-red-600'
                                        }`}
                                >
                                    {t('cancel')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Confirmed State - Show Refund button */}
                    {isConfirmed && (
                        <TouchableOpacity
                            onPress={() => onStatusChange?.('pending')}
                            disabled={isUpdating}
                            className={`py-4 flex-row justify-center items-center gap-2 ${isUpdating ? 'bg-green-400' : 'bg-green-500'
                                }`}
                        >
                            {isUpdating ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <MaterialIcons name="refresh" size={18} color="white" />
                            )}

                            <Text className="text-white text-center font-bold text-md">
                                {isUpdating ? t('processing') : t('refund')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
}