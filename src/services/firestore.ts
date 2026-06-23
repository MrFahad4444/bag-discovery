import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    type QueryConstraint,
    type Unsubscribe
} from 'firebase/firestore';
import { handleTryCatch } from '../utils';
import { db } from './firebase';


// Gets one document by ID from a collection.
export async function getDocument(
    collectionName: string,
    docId: string
): Promise<any | null> {
    return handleTryCatch<any | null>(async () => {
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
        };
    }, `Error getting document from ${collectionName}:`);
}

// Gets all documents from a collection, with optional query constraints.
export async function getDocuments(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    errorPrefix: string
): Promise<any[]> {
    return handleTryCatch<any[]>(async () => {
        const baseCollection = collection(db, collectionName);

        const collectionQuery =
            constraints.length > 0
                ? query(baseCollection, ...constraints)
                : query(baseCollection);

        const snapshot = await getDocs(collectionQuery);

        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
        }));
    }, errorPrefix);
}

export async function getPaginatedDocuments(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    pageNumber: number = 0,
    pageSize: number = 10,
    errorPrefix: string
): Promise<any[]> {
    return handleTryCatch<any[]>(async () => {
        const baseCollection = collection(db, collectionName);

        const collectionQuery =
            constraints.length > 0
                ? query(baseCollection, ...constraints)
                : query(baseCollection);

        const snapshot = await getDocs(collectionQuery);

        const allDocs = snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
        }));

        // Pagination logic
        const startIndex = pageNumber * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedDocs = allDocs.slice(startIndex, endIndex);

        return paginatedDocs;
    }, errorPrefix);
}

// Adds a new document and returns its generated ID.
export async function addDocument<T extends object>(
    collectionName: string,
    data: T,
    errorPrefix: string
): Promise<string> {
    return handleTryCatch<string>(async () => {
        const docRef = doc(collection(db, collectionName));

        const dataToAdd = {
            id: docRef.id,
            ...data,
            createdAt: serverTimestamp(),
        };

        await setDoc(docRef, dataToAdd);

        return docRef.id;
    }, errorPrefix);
}

// Updates one document and adds an updatedAt timestamp.
export async function updateDocument<T extends object>(
    collectionName: string,
    docId: string,
    data: Partial<T>,
    errorPrefix: string,
): Promise<void> {
    return handleTryCatch<void>(async () => {
        const docRef = doc(db, collectionName, docId);

        const updateData = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        await updateDoc(docRef, updateData);
    }, errorPrefix);
}

// Deletes one document by ID from a collection.
export async function deleteDocument(
    collectionName: string,
    docId: string
): Promise<void> {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error deleting document from ${collectionName}:`, errorMessage);
        throw error;
    }
}

// Listens to one document and sends changes to the callback.
export function listenToDocument(
    collectionName: string,
    docId: string,
    callback: (data: any | null) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    const docRef = doc(db, collectionName, docId);

    return onSnapshot(
        docRef,
        (snapshot) => {
            callback(
                snapshot.exists()
                    ? {
                        id: snapshot.id,
                        ...snapshot.data(),
                    }
                    : null
            );
        },
        (error) => {
            console.error(
                `Error listening to ${collectionName} document:`,
                error.message
            );

            onError?.(error);
        }
    );
}

// Listens to a collection query and sends changes to the callback.
export function listenToCollection(
    collectionName: string,
    callback: (docs: any[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (error: Error) => void
): Unsubscribe {
    const baseCollection = collection(db, collectionName);

    const collectionQuery =
        constraints.length > 0
            ? query(baseCollection, ...constraints)
            : query(baseCollection);

    return onSnapshot(
        collectionQuery,
        (snapshot) => {
            const documents = snapshot.docs.map((docSnapshot) => ({
                id: docSnapshot.id,
                ...docSnapshot.data(),
            }));

            callback(documents);
        },
        (error) => {
            console.error(
                `Error listening to ${collectionName} collection:`,
                error.message
            );

            onError?.(error);
        }
    );
}
// Updates multiple fields on one document without adding timestamps.
export async function batchUpdateDocument<T extends object>(
    collectionName: string,
    docId: string,
    updates: Partial<T>
): Promise<void> {
    return handleTryCatch<void>(async () => {
        const docRef = doc(db, collectionName, docId);

        await updateDoc(docRef, updates as any);
    }, `Error batch updating document in ${collectionName}:`);
}