import { orderBy, QueryConstraint, where } from 'firebase/firestore';
import {
    addDocument,
    getDocuments,
    listenToCollection,
    listenToDocument,
    updateDocument,
} from '../services/firestore';
import { Reservation, Status } from '../types';

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
    }));
}

// Get bag reservations
export async function fetchBagReservations(
    bagId: string
): Promise<Reservation[]> {
    const constraints: QueryConstraint[] = [
        where('bagId', '==', bagId),
        orderBy('createdAt', 'desc'),
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
    }));
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
        orderBy('createdAt', 'desc'),
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
            }));

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