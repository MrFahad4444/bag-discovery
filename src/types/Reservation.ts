import { Timestamp } from 'firebase/firestore';
import { Status } from './Common';

type Reservation = {
    id: string;
    bagId: string;
    userId: string;
    status: Status; // Status from Common Types
    createdAt: Timestamp;
};

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

