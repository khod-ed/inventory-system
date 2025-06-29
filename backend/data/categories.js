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

const addCategory = (categoryData) => {
  const newCategory = {
    id: Date.now(),
    ...categoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  categories.push(newCategory)
  return newCategory
}

const findCategoryById = (id) => {
  return categories.find(category => category.id === parseInt(id))
}

const updateCategory = (id, updates) => {
  const index = categories.findIndex(category => category.id === parseInt(id))
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() }
    return categories[index]
  }
  return null
}

const deleteCategory = (id) => {
  const index = categories.findIndex(category => category.id === parseInt(id))
  if (index !== -1) {
    const deletedCategory = categories[index]
    categories = categories.filter(category => category.id !== parseInt(id))
    return deletedCategory
  }
  return null
}

const getAllCategories = () => {
  return categories
}

module.exports = {
  categories,
  addCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
} 