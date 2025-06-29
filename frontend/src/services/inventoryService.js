import api from './api'

export const inventoryService = {
  // Products
  async getProducts(params = {}) {
    const response = await api.get('/products', { params })
    return response
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`)
    return response
  },

  async createProduct(product) {
    const response = await api.post('/products', product)
    return response
  },

  async updateProduct(id, product) {
    const response = await api.put(`/products/${id}`, product)
    return response
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`)
    return response
  },

  // Categories
  async getCategories() {
    const response = await api.get('/categories')
    return response
  },

  async getCategory(id) {
    const response = await api.get(`/categories/${id}`)
    return response
  },

  async createCategory(category) {
    const response = await api.post('/categories', category)
    return response
  },

  async updateCategory(id, category) {
    const response = await api.put(`/categories/${id}`, category)
    return response
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`)
    return response
  },

  // Suppliers
  async getSuppliers(params = {}) {
    const response = await api.get('/suppliers', { params })
    return response
  },

  async getSupplier(id) {
    const response = await api.get(`/suppliers/${id}`)
    return response
  },

  async createSupplier(supplier) {
    const response = await api.post('/suppliers', supplier)
    return response
  },

  async updateSupplier(id, supplier) {
    const response = await api.put(`/suppliers/${id}`, supplier)
    return response
  },

  async deleteSupplier(id) {
    const response = await api.delete(`/suppliers/${id}`)
    return response
  },

  // Inventory
  async getInventory(params = {}) {
    const response = await api.get('/inventory', { params })
    return response
  },

  async getInventoryItem(id) {
    const response = await api.get(`/inventory/${id}`)
    return response
  },

  async createInventoryItem(inventoryData) {
    const response = await api.post('/inventory', inventoryData)
    return response
  },

  async updateInventoryStock(id, quantity, reason) {
    const response = await api.put(`/inventory/${id}/stock`, { quantity, reason })
    return response
  },

  async deleteInventoryItem(id) {
    const response = await api.delete(`/inventory/${id}`)
    return response
  },

  async getLowStockItems() {
    const response = await api.get('/inventory/low-stock')
    return response
  },

  async getInventoryValue() {
    const response = await api.get('/inventory/value')
    return response
  },

  async getInventoryTransactions(id) {
    const response = await api.get(`/inventory/${id}/transactions`)
    return response
  },

  // Reports
  async getDashboardReport() {
    const response = await api.get('/reports/dashboard')
    return response
  },

  async getInventorySummary() {
    const response = await api.get('/reports/inventory-summary')
    return response
  },

  async getLowStockReport() {
    const response = await api.get('/reports/low-stock')
    return response
  },

  async getTransactionsReport(params = {}) {
    const response = await api.get('/reports/transactions', { params })
    return response
  }
} 