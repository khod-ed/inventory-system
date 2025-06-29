// Mock products data
let products = [
  {
    id: 1,
    name: 'Laptop Pro',
    sku: 'LAP-001',
    description: 'High-performance laptop for professionals',
    categoryId: 1,
    supplierId: 1,
    price: 1299.99,
    cost: 899.99,
    minStock: 5,
    maxStock: 50,
    unit: 'piece',
    status: 'active',
    image: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    sku: 'MOU-001',
    description: 'Ergonomic wireless mouse with precision tracking',
    categoryId: 1,
    supplierId: 2,
    price: 49.99,
    cost: 25.00,
    minStock: 10,
    maxStock: 100,
    unit: 'piece',
    status: 'active',
    image: null,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Office Chair',
    sku: 'CHA-001',
    description: 'Comfortable office chair with adjustable features',
    categoryId: 2,
    supplierId: 3,
    price: 299.99,
    cost: 180.00,
    minStock: 3,
    maxStock: 20,
    unit: 'piece',
    status: 'active',
    image: null,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 4,
    name: 'Garden Hose',
    sku: 'GAR-001',
    description: 'Heavy-duty garden hose for outdoor use',
    categoryId: 3,
    supplierId: 4,
    price: 39.99,
    cost: 22.00,
    minStock: 8,
    maxStock: 75,
    unit: 'piece',
    status: 'active',
    image: null,
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 5,
    name: 'LED Monitor',
    sku: 'MON-001',
    description: '24-inch LED monitor with HD resolution',
    categoryId: 1,
    supplierId: 1,
    price: 199.99,
    cost: 120.00,
    minStock: 5,
    maxStock: 30,
    unit: 'piece',
    status: 'active',
    image: null,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
]

const addProduct = (productData) => {
  const newProduct = {
    id: Date.now(),
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  products.push(newProduct)
  return newProduct
}

const findProductById = (id) => {
  return products.find(product => product.id === parseInt(id))
}

const findProductBySku = (sku) => {
  return products.find(product => product.sku === sku)
}

const updateProduct = (id, updates) => {
  const index = products.findIndex(product => product.id === parseInt(id))
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
    return products[index]
  }
  return null
}

const deleteProduct = (id) => {
  const index = products.findIndex(product => product.id === parseInt(id))
  if (index !== -1) {
    const deletedProduct = products[index]
    products = products.filter(product => product.id !== parseInt(id))
    return deletedProduct
  }
  return null
}

const getAllProducts = () => {
  return products
}

const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.categoryId === parseInt(categoryId))
}

const getProductsBySupplier = (supplierId) => {
  return products.filter(product => product.supplierId === parseInt(supplierId))
}

const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  )
}

module.exports = {
  products,
  addProduct,
  findProductById,
  findProductBySku,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySupplier,
  searchProducts
} 