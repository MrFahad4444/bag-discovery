import { QueryConstraint, Unsubscribe, where } from 'firebase/firestore';
import { getDocument, getDocuments, listenToCollection } from '../services/firestore';
import { Bag, Category } from '../types';

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
// Listen to bags in real-time
export function listenToBags(
    callback: (bags: Bag[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (error: Error) => void
): Unsubscribe {
    return listenToCollection(
        'bags',
        (docs: any[]) => {
            const bags: Bag[] = docs.map((item) => ({
                id: item.id,
                ...item,
            }));

            callback(bags);
        },
        constraints,
        onError
    );
}