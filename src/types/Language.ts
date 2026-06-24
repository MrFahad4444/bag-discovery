/**
 * Supported application languages.
 */
type Language = 'en' | 'ar';

/**
 * Multi-language text structure used for storing
 * localized content across the application.
 *
 * Commonly used for:
 * - bag names
 * - descriptions
 * - categories
 * - restaurant content
 */
type Languages = {
    en: string;
    ar: string;
};

export { Language, Languages };
