import { QueryConstraint, where } from 'firebase/firestore';
import { getDocument, getDocuments, getPaginatedDocuments } from '../services/firestore';
import { Bag, Category } from '../types';

const BAGS_PER_PAGE = 5;

// Get all bags with optional filters
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

// Get paginated bags (for infinite scroll)

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



// Get a single bag by ID
export async function getBagById(bagId: string): Promise<Bag | null> {
    const data = await getDocument('bags', bagId);

    if (!data) return null;

    return {
        id: data.id,
        ...data,
    } as Bag;
}

// Get bags by category
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