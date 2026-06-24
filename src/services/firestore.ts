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
import { withErrorHandling } from '../utils';
import { db } from './firebase';


/**
 * Gets a single document by ID from Firestore collection.
 *
 * @param collectionName - Firestore collection name
 * @param docId - Document ID
 * @returns Document data or null if not found
 */
async function getDocument(
    collectionName: string,
    docId: string
): Promise<any | null> {
    return withErrorHandling<any | null>(async () => {
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
        };
    }, `Error getting document from ${collectionName}:`);
}

/**
 * Fetches all documents from a collection with optional query constraints.
 *
 * @param collectionName - Firestore collection name
 * @param constraints - Firestore query constraints (where, orderBy, etc.)
 * @param errorPrefix - Error log prefix for debugging
 * @returns Array of documents
 */
async function getDocuments(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    errorPrefix: string
): Promise<any[]> {
    return withErrorHandling<any[]>(async () => {
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

/**
 * Fetches paginated documents from a collection using simple slicing.
 *
 * @param collectionName - Firestore collection name
 * @param constraints - Query constraints for filtering
 * @param pageNumber - Current page index
 * @param pageSize - Number of items per page
 * @param errorPrefix - Error log prefix for debugging
 * @returns Array of paginated documents
 */
async function getPaginatedDocuments(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    pageNumber: number = 0,
    pageSize: number = 10,
    errorPrefix: string
): Promise<any[]> {
    return withErrorHandling<any[]>(async () => {
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

/**
 * Adds a new document to Firestore and returns generated document ID.
 *
 * @param collectionName - Firestore collection name
 * @param data - Document payload to store
 * @param errorPrefix - Error log prefix for debugging
 * @returns Newly created document ID
 */
async function addDocument<T extends object>(
    collectionName: string,
    data: T,
    errorPrefix: string
): Promise<string> {
    return withErrorHandling<string>(async () => {
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

/**
 * Updates a document and adds server timestamp (updatedAt).
 *
 * @param collectionName - Firestore collection name
 * @param docId - Document ID
 * @param data - Partial fields to update
 * @param errorPrefix - Error log prefix for debugging
 * @returns void
 */
async function updateDocument<T extends object>(
    collectionName: string,
    docId: string,
    data: Partial<T>,
    errorPrefix: string,
): Promise<void> {
    return withErrorHandling<void>(async () => {
        const docRef = doc(db, collectionName, docId);

        const updateData = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        await updateDoc(docRef, updateData);
    }, errorPrefix);
}

/**
 * Deletes a document from Firestore by ID.
 *
 * @param collectionName - Firestore collection name
 * @param docId - Document ID
 * @returns void
 */
async function deleteDocument(
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

/**
 * Listens to a single Firestore document in real-time.
 *
 * @param collectionName - Firestore collection name
 * @param docId - Document ID
 * @param callback - Emits document updates
 * @param onError - Optional error handler
 * @returns Unsubscribe function
 */
function listenToDocument(
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

/**
 * Listens to a Firestore collection in real-time with optional filters.
 *
 * @param collectionName - Firestore collection name
 * @param callback - Emits array of documents on change
 * @param constraints - Query filters (optional)
 * @param onError - Optional error handler
 * @returns Unsubscribe function
 */
function listenToCollection(
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

/**
 * Updates specific fields of a document without timestamps.
 *
 * @param collectionName - Firestore collection name
 * @param docId - Document ID
 * @param updates - Partial update payload
 * @returns void
 */
async function batchUpdateDocument<T extends object>(
    collectionName: string,
    docId: string,
    updates: Partial<T>
): Promise<void> {
    return withErrorHandling<void>(async () => {
        const docRef = doc(db, collectionName, docId);

        await updateDoc(docRef, updates as any);
    }, `Error batch updating document in ${collectionName}:`);
}

export { addDocument, batchUpdateDocument, deleteDocument, getDocument, getDocuments, getPaginatedDocuments, listenToCollection, listenToDocument, updateDocument };

