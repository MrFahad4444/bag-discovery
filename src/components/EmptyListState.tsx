import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

type EmptyStateOptions<T> = {
    loading: boolean;
    error: Error | null;
    data: T[] | undefined;

    emptyMessage?: string;
    errorMessage?: string;

    buttonText?: string;
    onButtonPress?: () => void;
};

/**
 * Generic UI state handler for list screens.
 *
 * Handles three common states in one reusable component:
 * - Loading state (spinner)
 * - Error state (error message)
 * - Empty state (no data fallback UI)
 *
 * Designed to simplify screen logic by removing repeated
 * conditional rendering from individual screens.
 *
 * @template T - Type of list data items
 */
export default function EmptyListState<T>({
    loading,
    error,
    data,
    emptyMessage = 'No data found',
    errorMessage = 'Something went wrong',
    buttonText,
    onButtonPress,
}: EmptyStateOptions<T>) {

    // Loading State
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    // Error State
    if (error != null) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-red-500">
                    {error?.message ?? errorMessage}
                </Text>
            </View>
        );
    }

    // Empty State
    if (!data || data.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 px-6">
                <Text className="text-gray-500 text-lg text-center">
                    {emptyMessage}
                </Text>

                {buttonText && onButtonPress && (
                    <TouchableOpacity
                        onPress={onButtonPress}
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                    >
                        <Text className="text-white font-semibold">
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return null;
}