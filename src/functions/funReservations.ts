import { QueryConstraint, where } from 'firebase/firestore';
import {
    addDocument,
    getDocument,
    getDocuments,
    getPaginatedDocuments,
    listenToCollection,
    updateDocument
} from '../services/firestore';
import { Bag, Reservation, Status } from '../types';
import { handleTryCatch } from '../utils';


const RESERVATIONS_PER_PAGE = 5;

// Get paginated user reservations
export async function fetchUserReservationsPaginated(
    userId: string,
    pageNumber: number = 0
): Promise<{ reservations: Reservation[]; pageNumber: number; hasMore: boolean }> {
    const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
    ];

    const paginatedDocs = await getPaginatedDocuments(
        'reservations',
        constraints,
        pageNumber,
        RESERVATIONS_PER_PAGE,
        `Error fetching reservations for user ${userId}:`
    );

    const hasMore = paginatedDocs.length === RESERVATIONS_PER_PAGE;

    return {
        reservations: paginatedDocs.map((item: any) => ({
            id: item.id,
            bagId: item.bagId,
            userId: item.userId,
            status: item.status,
            createdAt: item.createdAt,
        })),
        pageNumber: pageNumber + 1,
        hasMore,
    };
}


// Create reservation
export async function createReservation(
    bagId: string,
    userId: string
): Promise<Reservation> {
    const reservationData: Omit<Reservation, 'id' | 'createdAt'> = {
        bagId,
        userId,
        status: 'pending',
    };

    const id = await addDocument(
        'reservations',
        reservationData,
        'Error creating reservation:'
    );

    return {
        id,
        ...reservationData,
        createdAt: new Date() as any,
    };
}

// Get user reservations
export async function fetchUserReservations(
    userId: string
): Promise<Reservation[]> {
    const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        // orderBy('createdAt', 'desc'),
    ];

    const reservations = await getDocuments(
        'reservations',
        constraints,
        `Error fetching reservations for user ${userId}:`
    );

    return reservations.map((item: any) => ({
        id: item.id,
        bagId: item.bagId,
        userId: item.userId,
        status: item.status,
        createdAt: item.createdAt,
    })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
}


export async function updateReservationStatus(
    reservationId: string,
    status: Status,
    bagId: string
): Promise<void> {
    return handleTryCatch(
        async () => {
            // Get current bag directly by document ID (not querying by 'id' field)
            const bag = await getDocument('bags', bagId);

            if (!bag) {
                throw new Error('Bag not found');
            }

            const currentQuantity = bag.quantityRemaining;
            const originalQuantity = bag.originalPriceSAR;

            // Update reservation status
            const updateData: Partial<Reservation> = { status };
            await updateDocument<Reservation>(
                'reservations',
                reservationId,
                updateData,
                "sadasd"
            );

            // If confirming, reduce bag quantity
            if (status === 'confirmed') {
                const newQuantity = Math.max(0, currentQuantity - 1);
                await updateDocument<Bag>('bags', bagId, {
                    quantityRemaining: newQuantity,
                } as Partial<Bag>, "sadasd");
            }

            // If going back to pending (refund), increase quantity
            if (status === 'pending') {
                const newQuantity = Math.min(originalQuantity, currentQuantity + 1);
                await updateDocument<Bag>('bags', bagId, {
                    quantityRemaining: newQuantity,
                } as Partial<Bag>, "asdasdas");
            }
        },
        'Error updating reservation status'
    );
}

// Listen to user reservations
export function listenToUserReservations(
    userId: string,
    callback: (reservations: Reservation[]) => void,
    onError?: (error: Error) => void
): () => void {
    const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        // orderBy('createdAt', 'desc'),
    ];

    return listenToCollection(
        'reservations',
        (docs: any[]) => {
            const reservations: Reservation[] = docs.map((item) => ({
                id: item.id,
                bagId: item.bagId,
                userId: item.userId,
                status: item.status,
                createdAt: item.createdAt,
            })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

            callback(reservations);
        },
        constraints,
        onError
    );
}
