import { Timestamp } from 'firebase/firestore';
import { Status } from './common';

/**
 * Represents a food bag reservation created by a user.
 */
type Reservation = {
    id: string;
    bagId: string;
    userId: string;
    status: Status;
    createdAt: Timestamp;
};

/**
 * Creates a new reservation object by merging existing
 * values with partial updates.
 *
 * Inspired by Flutter's copyWith pattern to keep updates
 * immutable and predictable.
 *
 * @param reservation - Original reservation object
 * @param updates - Partial fields to override
 *
 * @returns Updated reservation object
 */
function reservationCopyWith(
    reservation: Reservation,
    updates: Partial<Reservation>
): Reservation {
    return {
        ...reservation,
        ...updates,
    };
}

export { Reservation, reservationCopyWith };

