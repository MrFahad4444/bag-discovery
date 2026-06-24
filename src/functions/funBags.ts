import { QueryConstraint, where } from 'firebase/firestore';
import { getDocument, getDocuments, getPaginatedDocuments } from '../services/firestore';
import { Bag, Category } from '../types';

const BAGS_PER_PAGE = 5;

/**
 * Fetches all bags from Firestore with optional query constraints.
 *
 * @param constraints - Optional Firestore query filters (e.g. category, limits, ordering)
 *
 * @returns Array of Bag objects
 */
export async function fetchAllBags(
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
export async function fetchPaginatedBags(
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
export async function getBagById(bagId: string): Promise<Bag | null> {
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
export async function fetchBagsByCategory(
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