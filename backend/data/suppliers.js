const { db } = require('../firebase-admin');
const SUPPLIERS_COLLECTION = 'suppliers';

const addSupplier = async (supplierData) => {
  const newSupplier = {
    ...supplierData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection(SUPPLIERS_COLLECTION).add(newSupplier);
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
};

const findSupplierById = async (id) => {
  const doc = await db.collection(SUPPLIERS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const updateSupplier = async (id, updates) => {
  updates.updatedAt = new Date().toISOString();
  await db.collection(SUPPLIERS_COLLECTION).doc(id).update(updates);
  return findSupplierById(id);
};

const deleteSupplier = async (id) => {
  const supplier = await findSupplierById(id);
  if (!supplier) return null;
  await db.collection(SUPPLIERS_COLLECTION).doc(id).delete();
  return supplier;
};

const getAllSuppliers = async () => {
  const snapshot = await db.collection(SUPPLIERS_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const searchSuppliers = async (query) => {
  const snapshot = await db.collection(SUPPLIERS_COLLECTION).get();
  const lowercaseQuery = query.toLowerCase();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(supplier =>
      supplier.name.toLowerCase().includes(lowercaseQuery) ||
      supplier.contactPerson.toLowerCase().includes(lowercaseQuery) ||
      supplier.email.toLowerCase().includes(lowercaseQuery)
    );
};

module.exports = {
  addSupplier,
  findSupplierById,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
  searchSuppliers
}; 