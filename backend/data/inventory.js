// Mock inventory data
let inventory = [
  {
    id: 1,
    productId: 1,
    quantity: 25,
    minStock: 10,
    maxStock: 100,
    location: 'Warehouse A',
    lastUpdated: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    productId: 2,
    quantity: 150,
    minStock: 50,
    maxStock: 300,
    location: 'Warehouse B',
    lastUpdated: '2024-01-02T00:00:00.000Z',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    productId: 3,
    quantity: 50,
    minStock: 20,
    maxStock: 100,
    location: 'Warehouse C',
    lastUpdated: '2024-01-03T00:00:00.000Z',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

// Mock transactions data
let transactions = [
  {
    id: 1,
    inventoryId: 1,
    type: 'in',
    quantity: 10,
    reason: 'Stock replenishment',
    userId: 1,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    inventoryId: 2,
    type: 'out',
    quantity: 5,
    reason: 'Sale',
    userId: 2,
    createdAt: '2024-01-02T00:00:00.000Z'
  }
];

const addInventoryItem = async (inventoryData) => {
  const newItem = {
    id: inventory.length + 1,
    ...inventoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  inventory.push(newItem);
  return newItem;
};

const findInventoryById = async (id) => {
  return inventory.find(item => item.id == id) || null;
};

const findInventoryByProductId = async (productId) => {
  return inventory.find(item => item.productId == productId) || null;
};

const updateInventoryQuantity = async (id, quantity, reason, userId) => {
  const itemIndex = inventory.findIndex(item => item.id == id);
  if (itemIndex === -1) return null;
  
  const oldQuantity = inventory[itemIndex].quantity;
  inventory[itemIndex] = {
    ...inventory[itemIndex],
    quantity,
    lastUpdated: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add transaction record
  const transaction = {
    id: transactions.length + 1,
    inventoryId: id,
    type: quantity > oldQuantity ? 'in' : 'out',
    quantity: Math.abs(quantity - oldQuantity),
    reason,
    userId,
    createdAt: new Date().toISOString()
  };
  transactions.push(transaction);
  return inventory[itemIndex];
};

const deleteInventoryItem = async (id) => {
  const itemIndex = inventory.findIndex(item => item.id == id);
  if (itemIndex === -1) return null;
  
  const deletedItem = inventory[itemIndex];
  inventory.splice(itemIndex, 1);
  return deletedItem;
};

const getAllInventory = async () => {
  return inventory;
};

const getLowStockItems = async () => {
  return inventory.filter(item => item.quantity <= item.minStock);
};

const getInventoryTransactions = async (inventoryId = null) => {
  if (inventoryId) {
    return transactions.filter(transaction => transaction.inventoryId == inventoryId);
  }
  return transactions;
};

const getInventoryValue = async () => {
  // For mock data, we'll use a simplified calculation
  // In a real app, this would fetch product costs from the products collection
  return inventory.reduce((total, item) => {
    // Using estimated cost based on product price (assuming 60% of selling price is cost)
    const estimatedCost = item.productId === 1 ? 600 : item.productId === 2 ? 18 : 120;
    return total + (item.quantity * estimatedCost);
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