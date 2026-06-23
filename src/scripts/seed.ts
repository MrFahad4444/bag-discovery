import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getFirestore,
    writeBatch,
} from 'firebase/firestore';

import { fakeBags } from '../data/fakeBags';

dotenv.config({ path: '.env.local' });

const app = initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

async function seedDatabase() {
    try {
        const batch = writeBatch(db);
        const collectionRef = collection(db, 'bags');

        fakeBags.forEach((bag) => {
            const ref = doc(collectionRef); // auto-id
            batch.set(ref, bag);
        });

        await batch.commit();

        console.log(`✅ Seeded ${fakeBags.length} bags in 1 batch`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();