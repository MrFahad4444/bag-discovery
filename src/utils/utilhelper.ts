/**
 * Centralized async error handler used to reduce repetitive try/catch blocks
 * across services, API calls, and async business logic.
 *
 * @template T - Expected return type of the async operation
 *
 * @param operation - Async function to execute
 * @param errorPrefix - Prefix message for contextual error logging
 * @param onError - Optional callback triggered when an error occurs
 *
 * @returns Result returned from the async operation
 *
 * @throws Rethrows the original error after logging
 */
async function withErrorHandling<T>(
    operation: () => Promise<T>,
    errorPrefix: string,
    onError?: (error: unknown) => void
): Promise<T> {
    try {
        // Execute and return the async operation result
        return await operation();
    } catch (error) {

        //Build error message
        const message =
            error instanceof Error ? error.message : 'Unknown error';

        //Log error
        console.error(`${errorPrefix}:`, message);

        // Allow feature-level custom error handling when needed
        onError?.(error);

        // Preserve original error and stack trace
        throw error;
    }
}

export { withErrorHandling };

