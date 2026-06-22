
/**
 * Centralized error handling for async operations
 * Wraps operations in try/catch, logs errors, and rethrows
 * @param operation - Async function to execute
 * @param errorPrefix - Prefix message for error logging
 * @returns Result of the operation or throws error
 */


async function handleTryCatch<T>(
    operation: () => Promise<T>,
    errorPrefix: string
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        // Extract error message safely
        const message = error instanceof Error ? error.message : 'Unknown error';

        // Log with prefix for debugging
        console.error(`${errorPrefix}:`, message);

        // Rethrow the original error (preserve stack trace)
        throw error;
    }
}

export { handleTryCatch };

