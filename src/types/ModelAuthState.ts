import { User } from 'firebase/auth';

export type ModelAuthState = {
    user: User | null;
    loading: boolean;
    error: Error | null;
};