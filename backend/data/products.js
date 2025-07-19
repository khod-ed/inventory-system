// Mock products data
let products = [
  {
    id: 1,
    name: 'Laptop Computer',
    sku: 'LAP001',
    description: 'High-performance laptop for business use',
    price: 999.99,
    quantity: 25,
    categoryId: 1,
    supplierId: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    sku: 'MOU001',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 29.99,
    quantity: 150,
    categoryId: 1,
    supplierId: 2,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Office Chair',
    sku: 'CHR001',
    description: 'Comfortable office chair with lumbar support',
    price: 199.99,
    quantity: 50,
    categoryId: 2,
    supplierId: 3,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

const addProduct = async (productData) => {
  const newProduct = {
    id: products.length + 1,
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(newProduct);
  return newProduct;
};

const findProductById = async (id) => {
  return products.find(product => product.id == id) || null;
};

const findProductBySku = async (sku) => {
  return products.find(product => product.sku === sku) || null;
};

const updateProduct = async (id, updates) => {
  const productIndex = products.findIndex(product => product.id == id);
  if (productIndex === -1) return null;
  
  products[productIndex] = {
    ...products[productIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return products[productIndex];
};

const deleteProduct = async (id) => {
  const productIndex = products.findIndex(product => product.id == id);
  if (productIndex === -1) return null;
  
  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  return deletedProduct;
};

const getAllProducts = async () => {
  return products;
};

const getProductsByCategory = async (categoryId) => {
  return products.filter(product => product.categoryId == categoryId);
};

const getProductsBySupplier = async (supplierId) => {
  return products.filter(product => product.supplierId == supplierId);
};

const searchProducts = async (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
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