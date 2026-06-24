import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    getReactNativePersistence,
    initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase project configuration loaded from `.env.local`.
 *
 * This project includes a `.env.example` file containing all
 * required Firebase environment variable keys.
 *
 * Setup Instructions:
 * 1. Add your credientials in `.env.example`
 * 2. Rename the file to `.env.local`
 * 3. Add your Firebase project credentials
 *
 * Expo automatically loads `EXPO_PUBLIC_*` environment variables
 * during development and build processes.
 */
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize the main Firebase application instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance configured with
 * React Native AsyncStorage persistence.
 *
 * This keeps users authenticated even after the app
 * is closed or restarted.
 */
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Firestore database instance used across the application.
 */
const db = getFirestore(app);

export { app, auth, db };
