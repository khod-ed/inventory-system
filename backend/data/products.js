const { db } = require('../firebase-admin');
const PRODUCTS_COLLECTION = 'products';

const addProduct = async (productData) => {
  const newProduct = {
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection(PRODUCTS_COLLECTION).add(newProduct);
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
};

const findProductById = async (id) => {
  const doc = await db.collection(PRODUCTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const findProductBySku = async (sku) => {
  const snapshot = await db.collection(PRODUCTS_COLLECTION).where('sku', '==', sku).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const updateProduct = async (id, updates) => {
  updates.updatedAt = new Date().toISOString();
  await db.collection(PRODUCTS_COLLECTION).doc(id).update(updates);
  return findProductById(id);
};

const deleteProduct = async (id) => {
  const product = await findProductById(id);
  if (!product) return null;
  await db.collection(PRODUCTS_COLLECTION).doc(id).delete();
  return product;
};

const getAllProducts = async () => {
  const snapshot = await db.collection(PRODUCTS_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getProductsByCategory = async (categoryId) => {
  const snapshot = await db.collection(PRODUCTS_COLLECTION).where('categoryId', '==', categoryId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getProductsBySupplier = async (supplierId) => {
  const snapshot = await db.collection(PRODUCTS_COLLECTION).where('supplierId', '==', supplierId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const searchProducts = async (query) => {
  const snapshot = await db.collection(PRODUCTS_COLLECTION).get();
  const lowercaseQuery = query.toLowerCase();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.sku.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
};

module.exports = {
  addProduct,
  findProductById,
  findProductBySku,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySupplier,
  searchProducts
}; 