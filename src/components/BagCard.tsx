import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../hooks'; // Check path accuracy
import { Bag } from '../types';

/**
 * Displays a bag card used in listings and home screens.
 *
 * This component:
 * - Renders bag image, name, category, and pricing info
 * - Formats pickup time from Firestore timestamps
 * - Supports localization (English / Arabic)
 * - Navigates to bag details screen on press
 *
 * @param item - Bag data object containing all display information
 */
export default function BagCard({ item }: { item: Bag }) {
    const { t, language } = useTranslation(); // Dichted isRTL flag layout rules completely

    const pickupStartTime = new Date(item.pickupStart.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pickupEndTime = new Date(item.pickupEnd.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Fall back to English if Arabic name entry does not exist on database model 
    const localizedBagName = language === 'ar' && item.name.ar ? item.name.ar : item.name.en;

    // Map categories dynamically to JSON localization files
    const categoryKey = item.category.toLowerCase() as 'bakery' | 'restaurant' | 'grocery';
    const localizedCategory = t(categoryKey);

    return (
        <Link href={`/bag/${item.id}`} asChild>
            <TouchableOpacity className="bg-white mx-3 my-2 rounded-lg overflow-hidden shadow-sm">
                <View className="w-full flex-col">

                    {/* Image Header wrapper remains fixed layout */}
                    <View style={{ width: '100%', height: 200, backgroundColor: '#e5e7eb' }}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}

                        />
                    </View>

                    {/* Text aligns dynamically based on parent container text writing rules */}
                    <View className="p-4">
                        <Text style={{ textAlign: 'auto' }} className="text-sm text-gray-500 mb-1">
                            {item.restaurantName}
                        </Text>

                        <Text style={{ textAlign: 'auto' }} className="text-lg font-bold text-gray-900 mb-2">
                            {localizedBagName}
                        </Text>

                        {/* Layout alignment naturally reacts to root direction container framework blocks */}
                        <View className="flex-row items-center gap-2 mb-3">
                            <Text className="text-xl font-bold text-green-600">
                                {item.priceSAR} {t('sar')}
                            </Text>
                            <Text className="line-through text-gray-400 text-sm">
                                {item.originalPriceSAR} {t('sar')}
                            </Text>
                        </View>

                        {/* Row structures flip natively inside parent container definitions */}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-xs text-gray-500">
                                {t('qty')}: {item.quantityRemaining}
                            </Text>

                            <View className="bg-blue-100 px-3 py-1 rounded-full">
                                <Text className="text-blue-800 text-md font-semibold">
                                    {localizedCategory}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Schedule Block aligns itself sequentially by reacting to root context flex rules */}
                    <View className="flex-row py-4 p-4 bg-blue-100 items-center justify-center gap-x-2">
                        <MaterialIcons name="schedule" size={18} color="#1e3a8a" />
                        <Text className="font-semibold text-blue-900 text-md">
                            {pickupStartTime} - {pickupEndTime}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        </Link>
    );
}
