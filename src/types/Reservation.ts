import { Timestamp } from 'firebase/firestore';
import { Status } from './Common';

export type Reservation = {
    id: string;
    bagId: string;
    userId: string;
    status: Status; // Status from Common Types
    createdAt: Timestamp;
};