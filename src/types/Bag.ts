import { Timestamp } from 'firebase/firestore';
import { Category, Languages } from './Common';

export type Bag = {
    id: string;
    restaurantId: string;
    restaurantName: string;
    name: Languages; // Languages from Common Types
    category: Category; // Category from Common Types
    priceSAR: number;
    originalPriceSAR: number;
    quantityRemaining: number;
    pickupStart: Timestamp;
    pickupEnd: Timestamp;
    imageUrl: string;
    createdAt: Timestamp;
};