import { QueryConstraint, where } from 'firebase/firestore';
import {
    addDocument,
    getDocuments,
    getPaginatedDocuments,
    listenToCollection,
    listenToDocument,
    updateDocument,
} from '../services/firestore';
import { Reservation, Status } from '../types';


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

export async function fetchBagReservationsPaginated(
    bagId: string,
    pageNumber: number = 0
): Promise<{ reservations: Reservation[]; pageNumber: number; hasMore: boolean }> {
    const constraints: QueryConstraint[] = [
        where('bagId', '==', bagId),
    ];

    const paginatedDocs = await getPaginatedDocuments(
        'reservations',
        constraints,
        pageNumber,
        RESERVATIONS_PER_PAGE,
        `Error fetching reservations for bag ${bagId}:`
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

// Get bag reservations
export async function fetchBagReservations(
    bagId: string
): Promise<Reservation[]> {
    const constraints: QueryConstraint[] = [
        where('bagId', '==', bagId),
        // orderBy('createdAt', 'desc'),
    ];

    const reservations = await getDocuments(
        'reservations',
        constraints,
        `Error fetching reservations for bag ${bagId}:`
    );

    return reservations.map((item: any) => ({
        id: item.id,
        bagId: item.bagId,
        userId: item.userId,
        status: item.status,
        createdAt: item.createdAt,
    })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
}

// Update reservation status
export async function updateReservationStatus(
    reservationId: string,
    newStatus: Status
): Promise<void> {
    return updateDocument<Reservation>(
        'reservations',
        reservationId,
        { status: newStatus } as Partial<Reservation>,
        'Error'
    );
}

// Cancel reservation
export async function cancelReservation(
    reservationId: string
): Promise<void> {
    return updateReservationStatus(reservationId, 'cancelled');
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

// Listen to single reservation
export function listenToReservation(
    reservationId: string,
    callback: (reservation: Reservation | null) => void,
    onError?: (error: Error) => void
): () => void {
    return listenToDocument(
        'reservations',
        reservationId,
        (data: any | null) => {
            if (!data) return callback(null);

            callback({
                id: data.id,
                bagId: data.bagId,
                userId: data.userId,
                status: data.status,
                createdAt: data.createdAt,
            });
        },
        onError
    );
}