const express = require('express')
const { body } = require('express-validator')
const { auth, adminAuth } = require('../middleware/auth')
const validate = require('../middleware/validation')
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response')
const {
  addInventoryItem,
  findInventoryById,
  findInventoryByProductId,
  updateInventoryQuantity,
  deleteInventoryItem,
  getAllInventory,
  getLowStockItems,
  getInventoryTransactions,
  getInventoryValue
} = require('../data/inventory')
const { findProductById } = require('../data/products')

const router = express.Router()

// Validation rules
const inventoryValidation = [
  body('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('location').notEmpty().withMessage('Location is required')
]

const stockUpdateValidation = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('reason').notEmpty().withMessage('Reason for stock update is required')
]

// @route   GET /api/inventory
// @desc    Get all inventory items with product details
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, lowStock } = req.query

    let inventory = getAllInventory()

    // Filter low stock items if requested
    if (lowStock === 'true') {
      inventory = getLowStockItems()
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedInventory = inventory.slice(startIndex, endIndex)

    // Add product details
    const enrichedInventory = paginatedInventory.map(item => {
      const product = findProductById(item.productId)
      return {
        ...item,
        product: product ? {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          cost: product.cost,
          minStock: product.minStock,
          maxStock: product.maxStock
        } : null
      }
    })

    paginatedResponse(res, enrichedInventory, page, limit, inventory.length)
  } catch (error) {
    console.error('Get inventory error:', error)
    errorResponse(res, 'Failed to get inventory', 500)
  }
})

// @route   GET /api/inventory/low-stock
// @desc    Get low stock items
// @access  Private
router.get('/low-stock', auth, async (req, res) => {
  try {
    const lowStockItems = getLowStockItems()
    
    // Add product details
    const enrichedItems = lowStockItems.map(item => {
      const product = findProductById(item.productId)
      return {
        ...item,
        product: product ? {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          cost: product.cost,
          minStock: product.minStock,
          maxStock: product.maxStock
        } : null
      }
    })

    successResponse(res, enrichedItems)
  } catch (error) {
    console.error('Get low stock error:', error)
    errorResponse(res, 'Failed to get low stock items', 500)
  }
})

// @route   GET /api/inventory/value
// @desc    Get total inventory value
// @access  Private
router.get('/value', auth, async (req, res) => {
  try {
    const totalValue = getInventoryValue()
    successResponse(res, { totalValue })
  } catch (error) {
    console.error('Get inventory value error:', error)
    errorResponse(res, 'Failed to get inventory value', 500)
  }
})

// @route   GET /api/inventory/:id
// @desc    Get inventory item by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const inventoryItem = findInventoryById(req.params.id)
    if (!inventoryItem) {
      return errorResponse(res, 'Inventory item not found', 404)
    }

    // Add product details
    const product = findProductById(inventoryItem.productId)
    const enrichedItem = {
      ...inventoryItem,
      product: product ? {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        cost: product.cost,
        minStock: product.minStock,
        maxStock: product.maxStock
      } : null
    }

    successResponse(res, enrichedItem)
  } catch (error) {
    console.error('Get inventory item error:', error)
    errorResponse(res, 'Failed to get inventory item', 500)
  }
})

// @route   POST /api/inventory
// @desc    Create new inventory item
// @access  Private (Admin)
router.post('/', adminAuth, inventoryValidation, validate, async (req, res) => {
  try {
    const { productId } = req.body

    // Check if product exists
    const product = findProductById(productId)
    if (!product) {
      return errorResponse(res, 'Product not found', 400)
    }

    // Check if inventory item already exists for this product
    const existingItem = findInventoryByProductId(productId)
    if (existingItem) {
      return errorResponse(res, 'Inventory item already exists for this product', 400)
    }

    const newInventoryItem = addInventoryItem(req.body)
    successResponse(res, newInventoryItem, 'Inventory item created successfully', 201)
  } catch (error) {
    console.error('Create inventory item error:', error)
    errorResponse(res, 'Failed to create inventory item', 500)
  }
})

// @route   PUT /api/inventory/:id/stock
// @desc    Update inventory stock level
// @access  Private (Admin)
router.put('/:id/stock', adminAuth, stockUpdateValidation, validate, async (req, res) => {
  try {
    const { quantity, reason } = req.body
    const inventoryItem = findInventoryById(req.params.id)
    
    if (!inventoryItem) {
      return errorResponse(res, 'Inventory item not found', 404)
    }

    const updatedItem = updateInventoryQuantity(req.params.id, quantity, reason, req.user.id)
    successResponse(res, updatedItem, 'Stock updated successfully')
  } catch (error) {
    console.error('Update stock error:', error)
    errorResponse(res, 'Failed to update stock', 500)
  }
})

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const inventoryItem = findInventoryById(req.params.id)
    if (!inventoryItem) {
      return errorResponse(res, 'Inventory item not found', 404)
    }

    deleteInventoryItem(req.params.id)
    successResponse(res, null, 'Inventory item deleted successfully')
  } catch (error) {
    console.error('Delete inventory item error:', error)
    errorResponse(res, 'Failed to delete inventory item', 500)
  }
})

// @route   GET /api/inventory/:id/transactions
// @desc    Get transactions for specific inventory item
// @access  Private
router.get('/:id/transactions', auth, async (req, res) => {
  try {
    const inventoryItem = findInventoryById(req.params.id)
    if (!inventoryItem) {
      return errorResponse(res, 'Inventory item not found', 404)
    }

    const transactions = getInventoryTransactions(req.params.id)
    successResponse(res, transactions)
  } catch (error) {
    console.error('Get transactions error:', error)
    errorResponse(res, 'Failed to get transactions', 500)
  }
})

module.exports = router 