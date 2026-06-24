import { QueryConstraint, where } from 'firebase/firestore';
import { getDocument, getDocuments, getPaginatedDocuments, listenToDocument, updateDocument } from '../services/firestore';
import { Bag, Category } from '../types';

const BAGS_PER_PAGE = 5;

/**
 * Fetches all bags from Firestore with optional query constraints.
 *
 * @param constraints - Optional Firestore query filters (e.g. category, limits, ordering)
 *
 * @returns Array of Bag objects
 */
async function fetchAllBags(
    constraints: QueryConstraint[] = []
): Promise<Bag[]> {
    const bags = await getDocuments(
        'bags',
        constraints,
        'Error fetching bags:'
    );

    return bags.map((item: Bag) => ({
        ...item,
    }));
}

/**
 * Fetches paginated bags for infinite scrolling.
 *
 * @param constraints - Optional Firestore query filters
 * @param pageNumber - Current page index for pagination
 * @var BAGS_PER_PAGE - using this for bags per page
 * @returns Paginated bags with next page metadata
 */
async function fetchPaginatedBags(
    constraints: QueryConstraint[] = [],
    pageNumber: number = 0
): Promise<{ bags: Bag[]; pageNumber: number; hasMore: boolean }> {
    const paginatedDocs = await getPaginatedDocuments(
        'bags',
        constraints,
        pageNumber,
        BAGS_PER_PAGE,
        'Error fetching paginated bags:'
    );

    // If we got less than page size, there are no more pages
    const hasMore = paginatedDocs.length === BAGS_PER_PAGE;

    return {
        bags: paginatedDocs,
        pageNumber: pageNumber + 1,
        hasMore,
    };
}



/**
 * Fetches a single bag by its Firestore document ID.
 *
 * @param bagId - Firestore document ID of the bag
 *
 * @returns Bag object if found, otherwise null
 */
async function getBagById(bagId: string): Promise<Bag | null> {
    const data = await getDocument('bags', bagId);

    if (!data) return null;

    return {
        id: data.id,
        ...data,
    } as Bag;
}

/**
 * Fetches all bags filtered by category.
 *
 * @param category - Bag category filter (bakery | restaurant | grocery)
 *
 * @returns Array of bags matching the category
 */
async function fetchBagsByCategory(
    category: Category
): Promise<Bag[]> {
    const constraints = [
        where('category', '==', category),
    ];

    const bags = await fetchAllBags(constraints);

    return bags.map((item: any) => ({
        id: item.id,
        ...item,
    }));
}


/**
 * Listen to a specific bag in real-time (for detail screen).
 *
 * @param bagId - Firestore document ID of the bag
 * @param callback - Called whenever the bag updates
 * @param onError - Optional error handler
 *
 * @returns Unsubscribe function
 */
function listenToBag(
    bagId: string,
    callback: (bag: Bag | null) => void,
    onError?: (error: Error) => void
): () => void {
    return listenToDocument(
        'bags',
        bagId,
        callback,
        onError
    );
}

/**
 * Updates the remaining quantity of a specific bag in Firestore.
 *
 * @param bagId - Unique identifier of the bag document
 * @param quantity - New quantity value to set for `quantityRemaining`
 * @returns Promise that resolves when the update is completed
 */
function updateBagQuantity(bagId: string, quantity: number): Promise<void> {
    return updateDocument(
        'bags',
        bagId,
        { quantityRemaining: quantity },
        'Failed to update bag quantity'
    );
}

export { fetchAllBags, fetchBagsByCategory, fetchPaginatedBags, getBagById, listenToBag, updateBagQuantity };

