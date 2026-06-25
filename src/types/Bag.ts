import { Timestamp } from 'firebase/firestore';
import { Category } from './common';
import { Languages } from './language';

/**
 * Represents a food bag listed by a restaurant.
 */
type Bag = {
    id: string;
    restaurantId: string;
    restaurantName: string;
    name: Languages;
    category: Category;
    priceSAR: number;
    originalPriceSAR: number;
    quantityRemaining: number;
    pickupStart: Timestamp;
    pickupEnd: Timestamp;
    imageUrl: string;
    latitude: number;
    longitude: number;
    createdAt: Timestamp;
};

/**
 * Creates a new bag object by merging existing
 * values with partial updates.
 *
 * Useful for immutable state updates while keeping
 * object modification predictable and readable.
 *
 * @param bag - Original bag object
 * @param updates - Partial fields to override
 *
 * @returns Updated bag object
 */
function bagCopyWith(
    bag: Bag,
    updates: Partial<Bag>
): Bag {
    return {
        ...bag,
        ...updates,
    };
}

export { Bag, bagCopyWith };

