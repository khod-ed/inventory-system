// Mock inventory data
let inventory = [
  {
    id: 1,
    productId: 1,
    quantity: 15,
    location: 'Warehouse A - Shelf 1',
    lastUpdated: '2024-01-15T10:30:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 2,
    productId: 2,
    quantity: 45,
    location: 'Warehouse A - Shelf 2',
    lastUpdated: '2024-01-14T14:20:00.000Z',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-14T14:20:00.000Z'
  },
  {
    id: 3,
    productId: 3,
    quantity: 8,
    location: 'Warehouse B - Section 1',
    lastUpdated: '2024-01-13T09:15:00.000Z',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-13T09:15:00.000Z'
  },
  {
    id: 4,
    productId: 4,
    quantity: 3,
    location: 'Warehouse C - Outdoor Section',
    lastUpdated: '2024-01-12T16:45:00.000Z',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-12T16:45:00.000Z'
  },
  {
    id: 5,
    productId: 5,
    quantity: 12,
    location: 'Warehouse A - Shelf 3',
    lastUpdated: '2024-01-11T11:30:00.000Z',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-11T11:30:00.000Z'
  }
]

// Mock inventory transactions
let transactions = [
  {
    id: 1,
    inventoryId: 1,
    type: 'in', // 'in' for stock in, 'out' for stock out
    quantity: 10,
    reason: 'Purchase order received',
    userId: 1,
    createdAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 2,
    inventoryId: 2,
    type: 'out',
    quantity: 5,
    reason: 'Sales order fulfilled',
    userId: 1,
    createdAt: '2024-01-14T14:20:00.000Z'
  },
  {
    id: 3,
    inventoryId: 3,
    type: 'in',
    quantity: 3,
    reason: 'Restock from supplier',
    userId: 1,
    createdAt: '2024-01-13T09:15:00.000Z'
  },
  {
    id: 4,
    inventoryId: 4,
    type: 'out',
    quantity: 2,
    reason: 'Customer order',
    userId: 1,
    createdAt: '2024-01-12T16:45:00.000Z'
  },
  {
    id: 5,
    inventoryId: 5,
    type: 'in',
    quantity: 8,
    reason: 'New shipment received',
    userId: 1,
    createdAt: '2024-01-11T11:30:00.000Z'
  }
]

const addInventoryItem = (inventoryData) => {
  const newItem = {
    id: Date.now(),
    ...inventoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  inventory.push(newItem)
  return newItem
}

const findInventoryById = (id) => {
  return inventory.find(item => item.id === parseInt(id))
}

const findInventoryByProductId = (productId) => {
  return inventory.find(item => item.productId === parseInt(productId))
}

const updateInventoryQuantity = (id, quantity, reason, userId) => {
  const index = inventory.findIndex(item => item.id === parseInt(id))
  if (index !== -1) {
    const oldQuantity = inventory[index].quantity
    inventory[index] = {
      ...inventory[index],
      quantity,
      lastUpdated: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add transaction record
    const transaction = {
      id: Date.now(),
      inventoryId: parseInt(id),
      type: quantity > oldQuantity ? 'in' : 'out',
      quantity: Math.abs(quantity - oldQuantity),
      reason,
      userId,
      createdAt: new Date().toISOString()
    }
    transactions.push(transaction)

    return inventory[index]
  }
  return null
}

const deleteInventoryItem = (id) => {
  const index = inventory.findIndex(item => item.id === parseInt(id))
  if (index !== -1) {
    const deletedItem = inventory[index]
    inventory = inventory.filter(item => item.id !== parseInt(id))
    return deletedItem
  }
  return null
}

const getAllInventory = () => {
  return inventory
}

const getLowStockItems = () => {
  return inventory.filter(item => {
    const product = require('./products').findProductById(item.productId)
    return product && item.quantity <= product.minStock
  })
}

const getInventoryTransactions = (inventoryId = null) => {
  if (inventoryId) {
    return transactions.filter(t => t.inventoryId === parseInt(inventoryId))
  }
  return transactions
}

const getInventoryValue = () => {
  return inventory.reduce((total, item) => {
    const product = require('./products').findProductById(item.productId)
    if (product) {
      return total + (item.quantity * product.cost)
    }
    return total
  }, 0)
}

module.exports = {
  inventory,
  transactions,
  addInventoryItem,
  findInventoryById,
  findInventoryByProductId,
  updateInventoryQuantity,
  deleteInventoryItem,
  getAllInventory,
  getLowStockItems,
  getInventoryTransactions,
  getInventoryValue
} 