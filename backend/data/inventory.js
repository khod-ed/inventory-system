const { db } = require('../firebase-admin');
const INVENTORY_COLLECTION = 'inventory';
const TRANSACTIONS_COLLECTION = 'transactions';

const addInventoryItem = async (inventoryData) => {
  const newItem = {
    ...inventoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection(INVENTORY_COLLECTION).add(newItem);
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
};

const findInventoryById = async (id) => {
  const doc = await db.collection(INVENTORY_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const findInventoryByProductId = async (productId) => {
  const snapshot = await db.collection(INVENTORY_COLLECTION).where('productId', '==', productId).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const updateInventoryQuantity = async (id, quantity, reason, userId) => {
  const item = await findInventoryById(id);
  if (!item) return null;
  const oldQuantity = item.quantity;
  await db.collection(INVENTORY_COLLECTION).doc(id).update({
    quantity,
    lastUpdated: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  // Add transaction record
  const transaction = {
    inventoryId: id,
    type: quantity > oldQuantity ? 'in' : 'out',
    quantity: Math.abs(quantity - oldQuantity),
    reason,
    userId,
    createdAt: new Date().toISOString()
  };
  await db.collection(TRANSACTIONS_COLLECTION).add(transaction);
  return findInventoryById(id);
};

const deleteInventoryItem = async (id) => {
  const item = await findInventoryById(id);
  if (!item) return null;
  await db.collection(INVENTORY_COLLECTION).doc(id).delete();
  return item;
};

const getAllInventory = async () => {
  const snapshot = await db.collection(INVENTORY_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getLowStockItems = async () => {
  const inventorySnapshot = await db.collection(INVENTORY_COLLECTION).get();
  const productSnapshot = await db.collection('products').get();
  const products = {};
  productSnapshot.docs.forEach(doc => { products[doc.id] = doc.data(); });
  return inventorySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(item => {
      const product = products[item.productId];
      return product && item.quantity <= product.minStock;
    });
};

const getInventoryTransactions = async (inventoryId = null) => {
  let snapshot;
  if (inventoryId) {
    snapshot = await db.collection(TRANSACTIONS_COLLECTION).where('inventoryId', '==', inventoryId).get();
  } else {
    snapshot = await db.collection(TRANSACTIONS_COLLECTION).get();
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getInventoryValue = async () => {
  const inventorySnapshot = await db.collection(INVENTORY_COLLECTION).get();
  const productSnapshot = await db.collection('products').get();
  const products = {};
  productSnapshot.docs.forEach(doc => { products[doc.id] = doc.data(); });
  return inventorySnapshot.docs.reduce((total, doc) => {
    const item = doc.data();
    const product = products[item.productId];
    if (product) {
      return total + (item.quantity * product.cost);
    }
    return total;
  }, 0);
};

module.exports = {
  addInventoryItem,
  findInventoryById,
  findInventoryByProductId,
  updateInventoryQuantity,
  deleteInventoryItem,
  getAllInventory,
  getLowStockItems,
  getInventoryTransactions,
  getInventoryValue
}; 