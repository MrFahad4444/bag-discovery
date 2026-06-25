import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getFirestore,
    writeBatch,
} from 'firebase/firestore';

import { fakeBags } from '../data/fakeBags';

/**
 * Load environment variables from `.env.local`.
 *
 * This project includes a `.env.example` file containing
 * all required Firebase environment variable keys.
 *
 * Setup Instructions:
 * 1. Rename the file to `.env.local`
 * 2. Add your Firebase project credentials
 *
 * Why dotenv is needed here:
 * This seed script runs independently through Node.js
 * outside the Expo runtime environment.
 *
 * Expo automatically injects `EXPO_PUBLIC_*` variables
 * inside the mobile application, but standalone scripts
 * like this do not have access to Expo's environment system.
 *
 * Because of that, dotenv is used to manually load
 * environment variables before Firebase initialization.
 */
dotenv.config({ path: '.env.local' });

/**
 * Initialize Firebase application instance for
 * local database seeding operations.
 */
const app = initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

/**
 * Firestore database instance used by the seed script.
 */
const db = getFirestore(app);

/**
 * Riyadh center coordinates.
 */
const RIYADH_LAT = 24.7136;
const RIYADH_LNG = 46.6753;

/**
 * Generates random nearby coordinates around Riyadh.
 *
 * Useful for:
 * - clustering demos
 * - nearby product simulation
 * - realistic map rendering
 */
function generateNearbyCoordinate(
    baseLat: number,
    baseLng: number
) {
    /**
     * Coordinate spread.
     *
     * Increase for wider map distribution.
     */
    const offset = 0.12;

    return {
        latitude:
            baseLat +
            (Math.random() - 0.5) * offset,

        longitude:
            baseLng +
            (Math.random() - 0.5) * offset,
    };
}

/**
 * Seeds the Firestore database with fake bag data.
 *
 * Uses Firestore batch writes for:
 * - better performance
 * - fewer network requests
 * - atomic bulk insertion
 *
 * Data Source:
 * `fakeBags` array located inside the data folder.
 */
async function seedDatabase(): Promise<void> {
    try {
        const batch = writeBatch(db);

        const collectionRef = collection(db, 'bags');

        /**
         * Create and queue Firestore write operations
         * for each fake bag document.
         */
        fakeBags.forEach((bag) => {
            const docRef = doc(collectionRef);

            batch.set(docRef, {
                id: docRef.id,
                ...bag,
                ...generateNearbyCoordinate(
                    RIYADH_LAT,
                    RIYADH_LNG
                ),
            });
        });

        /**
         * Commit all queued writes in a single batch operation.
         */
        await batch.commit();

        console.log(
            `✅ Successfully seeded ${fakeBags.length} bags`
        );

        process.exit(0);
    } catch (error) {
        console.error('❌ Database seeding failed:', error);

        process.exit(1);
    }
}

/**
 * Execute database seeding script.
 */
seedDatabase();