const { db } = require('../firebase-admin');
const CATEGORIES_COLLECTION = 'categories';

// Mock categories data
let categories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    color: '#3B82F6',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Office Furniture',
    description: 'Office chairs, desks, and furniture',
    color: '#10B981',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Garden & Outdoor',
    description: 'Garden tools and outdoor equipment',
    color: '#F59E0B',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    name: 'Kitchen & Dining',
    description: 'Kitchen appliances and dining items',
    color: '#EF4444',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 5,
    name: 'Clothing & Apparel',
    description: 'Clothing, shoes, and accessories',
    color: '#8B5CF6',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

const addCategory = async (categoryData) => {
  const newCategory = {
    ...categoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection(CATEGORIES_COLLECTION).add(newCategory);
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
};

const findCategoryById = async (id) => {
  const doc = await db.collection(CATEGORIES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const updateCategory = async (id, updates) => {
  updates.updatedAt = new Date().toISOString();
  await db.collection(CATEGORIES_COLLECTION).doc(id).update(updates);
  return findCategoryById(id);
};

const deleteCategory = async (id) => {
  const category = await findCategoryById(id);
  if (!category) return null;
  await db.collection(CATEGORIES_COLLECTION).doc(id).delete();
  return category;
};

const getAllCategories = async () => {
  const snapshot = await db.collection(CATEGORIES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  addCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
}; 