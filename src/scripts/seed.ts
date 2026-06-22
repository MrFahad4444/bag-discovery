

import { addDocument } from '../services/firestore';

const fakeBags = [
    {
        restaurantId: 'rest-1',
        restaurantName: 'Al Baik',
        name: { en: 'Crispy Chicken Box', ar: 'صندوق الدجاج المقرمش' },
        category: 'restaurant' as const,
        priceSAR: 15,
        originalPriceSAR: 45,
        quantityRemaining: 3,
        pickupStart: new Date(),
        pickupEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    },
    {
        restaurantId: 'rest-2',
        restaurantName: 'Sugar Breads',
        name: { en: 'Fresh Pastries', ar: 'المعجنات الطازجة' },
        category: 'bakery' as const,
        priceSAR: 10,
        originalPriceSAR: 30,
        quantityRemaining: 5,
        pickupStart: new Date(),
        pickupEnd: new Date(Date.now() + 3 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    },
    {
        restaurantId: 'rest-3',
        restaurantName: 'Fresh Mart',
        name: { en: 'Organic Vegetables', ar: 'الخضروات العضوية' },
        category: 'grocery' as const,
        priceSAR: 20,
        originalPriceSAR: 50,
        quantityRemaining: 8,
        pickupStart: new Date(),
        pickupEnd: new Date(Date.now() + 4 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1488459716781-6818f6d3c3d0?w=400',
    },
];

async function seedDatabase() {
    try {
        for (const bagData of fakeBags) {
            const id = await addDocument('bags', bagData, 'Error adding bag:');
            console.log(`✅ Added bag: ${id}`);
        }
        console.log('\n✅ Seeding  complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();