

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
    id: categories.length + 1,
    ...categoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  categories.push(newCategory);
  return newCategory;
};

const findCategoryById = async (id) => {
  return categories.find(category => category.id == id) || null;
};

const updateCategory = async (id, updates) => {
  const categoryIndex = categories.findIndex(category => category.id == id);
  if (categoryIndex === -1) return null;
  
  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return categories[categoryIndex];
};

const deleteCategory = async (id) => {
  const categoryIndex = categories.findIndex(category => category.id == id);
  if (categoryIndex === -1) return null;
  
  const deletedCategory = categories[categoryIndex];
  categories.splice(categoryIndex, 1);
  return deletedCategory;
};

const getAllCategories = async () => {
  return categories;
};

module.exports = {
  addCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
}; 