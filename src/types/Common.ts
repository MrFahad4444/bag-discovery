/**
 * Supported food bag categories available in the application.
 *
 * Used for:
 * - filtering
 * - categorization
 * - search/grouping
 * - UI badges/tags
 */
type Category =
    | 'bakery'
    | 'restaurant'
    | 'grocery';

/**
 * Reservation lifecycle states.
 *
 * pending   -> Reservation created but not yet confirmed
 * confirmed -> Reservation accepted/active
 * cancelled -> Reservation was cancelled by user or system
 */
type Status =
    | 'pending'
    | 'confirmed'
    | 'cancelled';

export type { Category, Status };
