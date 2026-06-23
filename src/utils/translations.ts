import { Language } from '@/src/types';

const translations: Record<Language, Record<string, string>> = {
    en: {
        reservation: 'Reservation',
        bagId: 'Bag ID',
        status: 'Status',
        reservedAt: 'Reserved At',
        confirm: 'Confirm',
        cancel: 'Cancel',
        refund: 'Refund',
        processing: 'Processing...',
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
    },
    ar: {
        reservation: 'الحجز',
        bagId: 'معرف الكيس',
        status: 'الحالة',
        reservedAt: 'تاريخ الحجز',
        confirm: 'تأكيد',
        cancel: 'إلغاء',
        refund: 'استرجاع',
        processing: 'جاري المعالجة...',
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        cancelled: 'ملغى',
    },
};

function t(key: string, language: Language): string {
    return translations[language][key] || key;
}

export { t, translations };

