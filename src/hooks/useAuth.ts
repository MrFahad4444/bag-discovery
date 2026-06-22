import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { ModelAuthState } from '../types';

function useAuth() {
    // State to track user, loading, and errors
    const [authState, setAuthState] = useState<ModelAuthState>({
        user: null,
        loading: true,
        error: null,
    });

    // Run on component when it's mounted
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    setAuthState({
                        user, loading: false, error: null
                    });
                } else {
                    const result = await signInAnonymously(auth);
                    setAuthState({
                        user: result.user,
                        loading: false,
                        error: null,
                    });
                }
            } catch (error) {
                setAuthState({
                    user: null,
                    loading: false,
                    error: error as Error,
                });
            }

        });
        return unsubscribe
    }, [])

    return authState;

}

export default useAuth;