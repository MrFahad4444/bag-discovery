import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

/**
 * Handles Firebase authentication state and
 * automatically creates anonymous sessions
 * for users who are not logged in.
 *
 * Returns:
 * - user → Current Firebase user
 * - loading → Authentication initialization state
 */
export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // First, try to sign in anonymously if no user exists
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User already logged in
                setUser(currentUser);
                setLoading(false);
            } else {
                // No user, sign in anonymously
                try {
                    const result = await signInAnonymously(auth);
                    setUser(result.user);
                } catch (error) {
                    console.error('Anonymous auth failed:', error);
                }
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}

export { useAuth };

