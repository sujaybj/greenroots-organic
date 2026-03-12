

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.log('❌ Error:', err.message); process.exit(1); });

const productSchema = new mongoose.Schema({
  name: String, description: String, shortDescription: String,
  price: Number, discountPrice: Number, category: String,
  images: [{ url: String, publicId: String }],
  stock: Number, unit: String,
  ingredients: [String],
  certifications: [String],
  isFeatured: Boolean, isActive: Boolean,
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [],
  tags: [String],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const products = [
  {
    name: 'Organic Basmati Rice',
    description: 'Premium long-grain basmati rice grown without pesticides in the foothills of the Himalayas. Rich aroma, fluffy texture, perfect for biryanis and daily meals. Certified organic by India Organic.',
    shortDescription: 'Premium Himalayan basmati rice, pesticide-free and FSSAI certified.',
    price: 299, discountPrice: 210,
    category: 'Grains',
    images: [{ url: 'https://www.greendna.in/cdn/shop/products/basmati6_945x.jpg?v=1742283085https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', publicId: 'rice1' }],
    stock: 100, unit: 'kg',
    ingredients: ['100% Organic Basmati Rice'],
    certifications: ['India Organic', 'FSSAI'],
    isFeatured: true, isActive: true,
    rating: 4.5, numReviews: 23,
    tags: ['rice', 'grains', 'staple', 'basmati']
  },
  {
    name: 'Fresh Organic Spinach',
    description: 'Farm-fresh organic spinach harvested daily from our partner farms. Rich in iron, vitamins A and C. No pesticides, no chemicals — pure green nutrition for your family.',
    shortDescription: 'Daily-harvested organic spinach, iron-rich and pesticide-free.',
    price: 49, discountPrice: 39,
    category: 'Vegetables',
    images: [{ url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600', publicId: 'spinach1' }],
    stock: 50, unit: 'kg',
    ingredients: ['Fresh Organic Spinach'],
    certifications: ['India Organic', 'FSSAI'],
    isFeatured: true, isActive: true,
    rating: 4.7, numReviews: 18,
    tags: ['spinach', 'leafy greens', 'vegetables', 'iron']
  },
  {
    name: 'Organic A2 Cow Ghee',
    description: 'Pure A2 ghee made from milk of desi Gir cows using traditional Bilona method. Hand-churned, slow-cooked for 8 hours to preserve nutrients. Golden, aromatic, and incredibly healthy.',
    shortDescription: 'Traditional Bilona-method A2 ghee from Gir cows.',
    price: 799, discountPrice: 699,
    category: 'Dairy',
    images: [{ url: 'https://www.greendna.in/cdn/shop/products/ghee6_1024x1024@2x.jpg?v=1561563602', publicId: 'ghee1' }],
    stock: 30, unit: 'litre',
    ingredients: ['A2 Gir Cow Milk'],
    certifications: ['India Organic', 'Non-GMO', 'FSSAI'],
    isFeatured: true, isActive: true,
    rating: 4.9, numReviews: 45,
    tags: ['ghee', 'dairy', 'a2', 'desi cow', 'bilona']
  },
  {
    name: 'Organic Alphonso Mangoes',
    description: 'The king of mangoes — certified organic Alphonso mangoes from Ratnagiri. Naturally ripened on the tree, never with chemicals. Sweet, aromatic, and absolutely divine.',
    shortDescription: 'GI-tagged Ratnagiri Alphonso mangoes, naturally ripened.',
    price: 599, discountPrice: 399,
    category: 'Fruits',
    images: [{ url: 'https://static.wixstatic.com/media/11062b_012d6c9a50fe43e7be6de53eefc62657~mv2.jpg/v1/fill/w_640,h_392,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_012d6c9a50fe43e7be6de53eefc62657~mv2.jpg', publicId: 'mango1' }],
    stock: 20, unit: 'dozen',
    ingredients: ['Organic Alphonso Mangoes'],
    certifications: ['India Organic', 'Non-GMO'],
    isFeatured: true, isActive: true,
    rating: 4.8, numReviews: 67,
    tags: ['mango', 'alphonso', 'fruits', 'ratnagiri', 'seasonal']
  },
  {
    name: 'Cold-Pressed Coconut Oil',
    description: 'Virgin coconut oil extracted using cold-press method to retain all nutrients. No heat, no chemicals, no refining. Perfect for cooking, hair care, and skin care.',
    shortDescription: 'Virgin cold-pressed coconut oil, unrefined and chemical-free.',
    price: 450, discountPrice: 399,
    category: 'Oils',
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', publicId: 'coconutoil1' }],
    stock: 45, unit: 'litre',
    ingredients: ['Organic Coconuts'],
    certifications: ['India Organic', 'FSSAI', 'Vegan'],
    isFeatured: true, isActive: true,
    rating: 4.6, numReviews: 34,
    tags: ['coconut oil', 'cold pressed', 'oils', 'virgin']
  },
  {
    name: 'Organic Turmeric Powder',
    description: 'High-curcumin organic turmeric from Erode, Tamil Nadu. Single-origin, stone-ground, no preservatives or fillers added. 5% curcumin content — much higher than commercial brands.',
    shortDescription: 'High-curcumin (5%) single-origin turmeric from Erode.',
    price: 199, discountPrice: 169,
    category: 'Spices',
    images: [{ url: 'https://www.greendna.in/cdn/shop/files/turmeric-1-1030x687_900x.jpg?v=1714732257', publicId: 'turmeric1' }],
    stock: 80, unit: 'kg',
    ingredients: ['Organic Turmeric (Curcuma longa)'],
    certifications: ['India Organic', 'FSSAI', 'Non-GMO'],
    isFeatured: true, isActive: true,
    rating: 4.7, numReviews: 29,
    tags: ['turmeric', 'spices', 'haldi', 'curcumin', 'erode']
  },
  {
    name: 'Organic Toor Dal',
    description: 'Farm-fresh split pigeon peas from certified organic farms of Maharashtra. High protein, no polishing, no artificial shine. The most nutritious form of toor dal available.',
    shortDescription: 'Unpolished organic toor dal, high protein and naturally grown.',
    price: 189, discountPrice: 159,
    category: 'Pulses',
    images: [{ url: 'https://www.tatanutrikorner.com/cdn/shop/files/TATA-Sampann-Organic-Toor-Dal-_Arhar-Dal_-500g-_FOP_0a990eb7-8904-4a85-9241-f06cddaa0d79-removebg-preview.png?v=1748858294&width=990', publicId: 'toordal1' }],
    stock: 70, unit: 'kg',
    ingredients: ['Organic Split Pigeon Peas'],
    certifications: ['India Organic', 'FSSAI'],
    isFeatured: false, isActive: true,
    rating: 4.4, numReviews: 15,
    tags: ['dal', 'toor dal', 'pulses', 'protein', 'unpolished']
  },
  {
    name: 'Organic Green Tea',
    description: 'Single-flush Darjeeling green tea from certified organic tea gardens. Hand-picked, minimal processing to preserve antioxidants. Light, fresh, and naturally caffeine-moderate.',
    shortDescription: 'Single-flush Darjeeling green tea, hand-picked and antioxidant-rich.',
    price: 299, discountPrice: 199,
    category: 'Beverages',
    images: [{ url: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600', publicId: 'greentea1' }],
    stock: 60, unit: 'g',
    ingredients: ['Organic Green Tea Leaves (Camellia sinensis)'],
    certifications: ['India Organic', 'FSSAI', 'Non-GMO'],
    isFeatured: true, isActive: true,
    rating: 4.5, numReviews: 22,
    tags: ['green tea', 'tea', 'beverages', 'darjeeling', 'antioxidant']
  },
  {
    name: 'Organic Moringa Powder',
    description: 'Pure moringa leaf powder from our partner farms. Called the "miracle tree" — packed with 90+ nutrients, 47 antioxidants. Great in smoothies, dals, and chapati dough.',
    shortDescription: 'Pure moringa leaf powder with 90+ nutrients.',
    price: 299, discountPrice: 249,
    category: 'Other',
    images: [{ url: 'https://saptamveda.com/cdn/shop/files/Moringa-Powder-Tin2_1_40e97dad-2049-4b06-b1f2-69348aa886a5.jpg?v=1771578802&width=990https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=600', publicId: 'moringa1' }],
    stock: 40, unit: 'g',
    ingredients: ['Organic Moringa Leaves (Moringa oleifera)'],
    certifications: ['India Organic', 'FSSAI', 'Vegan', 'Non-GMO'],
    isFeatured: false, isActive: true,
    rating: 4.6, numReviews: 19,
    tags: ['moringa', 'superfood', 'powder', 'nutrition']
  },
  {
    name: 'Organic Neem Face Wash',
    description: 'Handcrafted neem and turmeric face wash with certified organic ingredients. No SLS, no parabens, no synthetic fragrances. Gentle for daily use, effective against acne.',
    shortDescription: 'SLS-free neem & turmeric face wash with organic ingredients.',
    price: 249, discountPrice: 199,
    category: 'Skincare',
    images: [{ url: 'https://www.bbassets.com/media/uploads/p/l/40034199_6-organic-harvest-neem-face-wash.jpg', publicId: 'facewash1' }],
    stock: 35, unit: 'ml',
    ingredients: ['Neem Extract', 'Turmeric', 'Aloe Vera', 'Rose Water', 'Glycerin'],
    certifications: ['India Organic', 'Vegan', 'FSSAI'],
    isFeatured: false, isActive: true,
    rating: 4.3, numReviews: 12,
    tags: ['skincare', 'face wash', 'neem', 'turmeric', 'organic beauty']
  },
];

const seedDB = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert all products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully added ${inserted.length} products!`);
    console.log('\n📦 Products added:');
    inserted.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} — ₹${p.discountPrice || p.price}/${p.unit} [${p.category}]`);
    });

    console.log('\n🌿 Your shop is ready! Visit http://localhost:3000/products');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();