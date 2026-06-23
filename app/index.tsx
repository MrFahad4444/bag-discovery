
import { BagCard } from '@/src/components';
import { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth, useBags } from '../src/hooks';
import { Category } from '../src/types';

export default function ListScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const { data: bags = [], isLoading, error } = useBags(selectedCategory);

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
        <Text className="text-red-500 text-center text-lg">Error loading bags</Text>
      </View>
    );
  }

  if (!bags || bags.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500 text-lg">No bags available, Please run Script:seed.ts</Text>
      </View>
    );
  }

  const categories: (Category | undefined)[] = [undefined, 'bakery', 'restaurant', 'grocery'];
  const categoryLabels = { undefined: 'All', bakery: 'Bakery', restaurant: 'Restaurant', grocery: 'Grocery' };

  return (
    <View className="bg-gray-50">

      {/* Category Filter */}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row gap-2">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat || 'all'}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2 h-8 rounded-full ${selectedCategory === cat
                ? 'bg-blue-500'
                : 'bg-gray-200'
                }`}
            >
              <Text className={selectedCategory === cat ? 'text-white font-semibold' : 'text-gray-700'}>
                {categoryLabels[cat as keyof typeof categoryLabels]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bags List */}
      <FlatList
        data={bags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BagCard item={item} />}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}