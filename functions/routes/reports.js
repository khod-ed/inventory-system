const express = require('express')
const { auth } = require('../middleware/auth')
const { successResponse, errorResponse } = require('../utils/response')
const {
  getAllInventory,
  getLowStockItems,
  getInventoryValue,
  getInventoryTransactions
} = require('../data/inventory')
const { getAllProducts } = require('../data/products')
const { getAllCategories } = require('../data/categories')
const { getAllSuppliers } = require('../data/suppliers')

const router = express.Router()

// @route   GET /api/reports/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const products = getAllProducts()
    const inventory = getAllInventory()
    const categories = getAllCategories()
    const suppliers = getAllSuppliers()
    const lowStockItems = getLowStockItems()
    const totalValue = getInventoryValue()

    // Calculate analytics
    const totalProducts = products.length
    const totalInventoryItems = inventory.length
    const totalCategories = categories.length
    const totalSuppliers = suppliers.length
    const lowStockCount = lowStockItems.length

    // Category distribution
    const categoryDistribution = categories.map(category => {
      const categoryProducts = products.filter(p => p.categoryId === category.id)
      const categoryInventory = inventory.filter(i => {
        const product = products.find(p => p.id === i.productId)
        return product && product.categoryId === category.id
      })
      const categoryValue = categoryInventory.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId)
        return total + (item.quantity * ((product && product.cost) || 0))
      }, 0)

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        productCount: categoryProducts.length,
        inventoryValue: categoryValue
      }
    })

    // Supplier distribution
    const supplierDistribution = suppliers.map(supplier => {
      const supplierProducts = products.filter(p => p.supplierId === supplier.id)
      const supplierInventory = inventory.filter(i => {
        const product = products.find(p => p.id === i.productId)
        return product && product.supplierId === supplier.id
      })
      const supplierValue = supplierInventory.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId)
        return total + (item.quantity * ((product && product.cost) || 0))
      }, 0)

      return {
        id: supplier.id,
        name: supplier.name,
        productCount: supplierProducts.length,
        inventoryValue: supplierValue
      }
    })

    // Recent transactions (last 10)
    const allTransactions = getInventoryTransactions()
    const recentTransactions = allTransactions
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)

    successResponse(res, {
      summary: {
        totalProducts,
        totalInventoryItems,
        totalCategories,
        totalSuppliers,
        lowStockCount,
        totalValue
      },
      categoryDistribution,
      supplierDistribution,
      recentTransactions
    })
  } catch (error) {
    console.error('Dashboard report error:', error)
    errorResponse(res, 'Failed to generate dashboard report', 500)
  }
})

// @route   GET /api/reports/inventory-summary
// @desc    Get inventory summary report
// @access  Private
router.get('/inventory-summary', auth, async (req, res) => {
  try {
    const products = getAllProducts()
    const inventory = getAllInventory()

    const inventorySummary = inventory.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product) return null

      const stockStatus = item.quantity <= product.minStock ? 'low' : 
                         item.quantity >= product.maxStock ? 'high' : 'normal'

      return {
        id: item.id,
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        minStock: product.minStock,
        maxStock: product.maxStock,
        stockStatus,
        location: item.location,
        lastUpdated: item.lastUpdated,
        value: item.quantity * product.cost
      }
    }).filter(Boolean)

    const totalItems = inventorySummary.length
    const lowStockItems = inventorySummary.filter(item => item.stockStatus === 'low')
    const highStockItems = inventorySummary.filter(item => item.stockStatus === 'high')
    const normalStockItems = inventorySummary.filter(item => item.stockStatus === 'normal')

    successResponse(res, {
      summary: {
        totalItems,
        lowStockCount: lowStockItems.length,
        highStockCount: highStockItems.length,
        normalStockCount: normalStockItems.length
      },
      items: inventorySummary
    })
  } catch (error) {
    console.error('Inventory summary error:', error)
    errorResponse(res, 'Failed to generate inventory summary', 500)
  }
})

// @route   GET /api/reports/low-stock
// @desc    Get low stock report
// @access  Private
router.get('/low-stock', auth, async (req, res) => {
  try {
    const lowStockItems = getLowStockItems()
    const products = getAllProducts()

    const lowStockReport = lowStockItems.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product) return null

      const stockDeficit = product.minStock - item.quantity
      const reorderAmount = Math.max(stockDeficit, product.maxStock - item.quantity)

      return {
        id: item.id,
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        currentStock: item.quantity,
        minStock: product.minStock,
        maxStock: product.maxStock,
        stockDeficit,
        reorderAmount,
        location: item.location,
        lastUpdated: item.lastUpdated,
        urgency: stockDeficit > 5 ? 'high' : stockDeficit > 2 ? 'medium' : 'low'
      }
    }).filter(Boolean)

    successResponse(res, {
      totalLowStockItems: lowStockReport.length,
      highUrgency: lowStockReport.filter(item => item.urgency === 'high').length,
      mediumUrgency: lowStockReport.filter(item => item.urgency === 'medium').length,
      lowUrgency: lowStockReport.filter(item => item.urgency === 'low').length,
      items: lowStockReport
    })
  } catch (error) {
    console.error('Low stock report error:', error)
    errorResponse(res, 'Failed to generate low stock report', 500)
  }
})

// @route   GET /api/reports/transactions
// @desc    Get transaction history report
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query
    let transactions = getInventoryTransactions()

    // Filter by date range if provided
    if (startDate || endDate) {
      transactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt)
        const start = startDate ? new Date(startDate) : new Date(0)
        const end = endDate ? new Date(endDate) : new Date()
        return transactionDate >= start && transactionDate <= end
      })
    }

    // Filter by type if provided
    if (type && ['in', 'out'].includes(type)) {
      transactions = transactions.filter(transaction => transaction.type === type)
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Calculate summary
    const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0)
    const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0)
    const netChange = totalIn - totalOut

    successResponse(res, {
      summary: {
        totalTransactions: transactions.length,
        totalIn,
        totalOut,
        netChange
      },
      transactions
    })
  } catch (error) {
    console.error('Transactions report error:', error)
    errorResponse(res, 'Failed to generate transactions report', 500)
  }
})

module.exports = router 
