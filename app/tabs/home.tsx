import { BagCard, EmptyListState } from '@/src/components';
import { useTranslation } from '@/src/hooks';
import { useAuth } from '@/src/hooks/useAuth';
import { useBagsInfinite } from '@/src/hooks/useBags';
import { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../../src/types';

/**
 * Home screen (Bag listing page)
 *
 * Responsibilities:
 * - Displays list of available bags
 * - Supports category filtering
 * - Handles infinite scroll pagination
 * - Shows loading / empty / error states
 */
export default function Home() {
  const { loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const { t } = useTranslation();

  /**
   * Fetch paginated bags with optional category filter.
   */
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBagsInfinite(selectedCategory);

  /**
   * Merge all paginated results into a single list.
   */
  const bags = data?.pages.flatMap(page => page.bags) ?? [];

  /**
   * Trigger next page when user reaches end of list.
   */
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /**
   * Centralized UI handler for loading, error, and empty states.
   *
   * Keeps screen components clean by removing repeated UI logic
   * for common data states like loading, error, and empty list.
   *
   * Returns a React element (or null when data exists).
   */
  const stateView = EmptyListState({
    loading: loading || isLoading,
    error,
    data: bags,

    emptyMessage: t('noBagsFound'),
    errorMessage: t('errorLoadingBags'),

    buttonText: t('refresh'),
    onButtonPress: () => { },
  });


  if (stateView) {
    return stateView;
  }

  /**
   * Available filter categories
   */
  const categories: (Category | undefined)[] = [undefined, 'bakery', 'restaurant', 'grocery'];

  return (
    <View className="bg-gray-50 flex-1">
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // 🌟 Crucial: Forces the horizontal row elements to order correctly from right-to-left

        className="bg-white px-4 py-3 border-b border-gray-200"
      >
        <View className="flex-row gap-2">
          {categories.map((cat) => {
            // Map the dynamic or null category ID safely to your locale keys
            const categoryKey = cat ? (cat.toLowerCase() as 'bakery' | 'restaurant' | 'grocery') : 'all';
            const localizedLabel = t(categoryKey);

            return (
              <TouchableOpacity
                key={cat || 'all'}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 h-8 rounded-full ${selectedCategory === cat ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
              >
                <Text className={selectedCategory === cat ? 'text-white font-semibold' : 'text-gray-700'}>
                  {localizedLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bags List with Infinite Scroll */}
      <FlatList
        data={bags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BagCard item={item} />}
        contentContainerStyle={{ paddingVertical: 8 }}
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