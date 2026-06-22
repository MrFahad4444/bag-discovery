export type Category = 'bakery' | 'restaurant' | 'grocery'; //Separate Category Type, So it can be use multiple time
export type Language = 'en' | 'ar'; // Separate Language Type
export type Status = 'pending' | 'confirmed' | 'cancelled'; //Separate Status Type can be used multiple times.

export type Languages = {
    en: string;
    ar: string;
};