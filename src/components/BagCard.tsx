import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function BagCard({ item }: any) {

    const pickupStartTime = new Date(item.pickupStart.seconds * 1000).toLocaleTimeString();
    const pickupEndTime = new Date(item.pickupEnd.seconds * 1000).toLocaleTimeString();

    return (
        <Link href={`/bag/${item.id}`} asChild>
            <TouchableOpacity className="bg-white mx-3 my-2 rounded-lg overflow-hidden shadow-sm">

                {/* Image */}
                <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-40 bg-gray-200"
                />

                {/* Content */}

                <View className="p-4">

                    <Text className="text-sm text-gray-500 mb-1">
                        {item.restaurantName}
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">
                        {item.name.en}
                    </Text>

                    {/* Price */}
                    <View className="flex-row items-center gap-2 mb-3">
                        <Text className="text-xl font-bold text-green-600">
                            {item.priceSAR} SAR
                        </Text>
                        <Text className="line-through text-gray-400 text-sm">
                            {item.originalPriceSAR} SAR
                        </Text>
                    </View>


                    {/* Footer */}
                    <View className="flex-row justify-between items-center">

                        <Text className="text-xs text-gray-500">
                            Qty: {item.quantityRemaining}
                        </Text>

                        <View className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-blue-800 text-md font-semibold capitalize">
                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </Text>
                        </View>

                    </View>


                </View>
                <View className="flex-row py-4 p-4 bg-blue-100 items-center justify-center gap-x-10">
                    <MaterialIcons name="schedule" size={18} color="#1e3a8a" />
                    <Text className="font-semibold text-blue-900 text-md">
                        {pickupStartTime} - {pickupEndTime}
                    </Text>

                </View>
            </TouchableOpacity>
        </Link>
    );
}