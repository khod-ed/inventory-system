import { createContext, useContext, useState, useEffect } from 'react'
import { inventoryService } from '../services/inventoryService'
import { useAuth } from './AuthContext'

const InventoryContext = createContext()

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}

export const InventoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)

  // Load initial data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
    loadInitialData()
    }
  }, [isAuthenticated])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, suppliersRes, productsRes, inventoryRes] = await Promise.all([
        inventoryService.getCategories(),
        inventoryService.getSuppliers(),
        inventoryService.getProducts(),
        inventoryService.getInventory()
      ])

      setCategories(categoriesRes.data || [])
      setSuppliers(suppliersRes.data || [])
      setProducts(productsRes.data || [])
      setInventory(inventoryRes.data || [])
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Product operations
  const addProduct = async (product) => {
    try {
      const response = await inventoryService.createProduct(product)
      const newProduct = response.data
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (error) {
      throw error
    }
  }

  const updateProduct = async (id, updates) => {
    try {
      const response = await inventoryService.updateProduct(id, updates)
      const updatedProduct = response.data
      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ))
      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  const deleteProduct = async (id) => {
    try {
      await inventoryService.deleteProduct(id)
      setProducts(prev => prev.filter(product => product.id !== id))
      setInventory(prev => prev.filter(item => item.productId !== id))
    } catch (error) {
      throw error
    }
  }

  // Category operations
  const addCategory = async (category) => {
    try {
      const response = await inventoryService.createCategory(category)
      const newCategory = response.data
      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (error) {
      throw error
    }
  }

  const updateCategory = async (id, updates) => {
    try {
      const response = await inventoryService.updateCategory(id, updates)
      const updatedCategory = response.data
      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ))
      return updatedCategory
    } catch (error) {
      throw error
    }
  }

  const deleteCategory = async (id) => {
    try {
      await inventoryService.deleteCategory(id)
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (error) {
      throw error
    }
  }

  // Supplier operations
  const addSupplier = async (supplier) => {
    try {
      const response = await inventoryService.createSupplier(supplier)
      const newSupplier = response.data
      setSuppliers(prev => [...prev, newSupplier])
      return newSupplier
    } catch (error) {
      throw error
    }
  }

  const updateSupplier = async (id, updates) => {
    try {
      const response = await inventoryService.updateSupplier(id, updates)
      const updatedSupplier = response.data
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === id ? updatedSupplier : supplier
      ))
      return updatedSupplier
    } catch (error) {
      throw error
    }
  }

  const deleteSupplier = async (id) => {
    try {
      await inventoryService.deleteSupplier(id)
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id))
    } catch (error) {
      throw error
    }
  }

  // Inventory operations
  const updateInventory = async (id, quantity, reason) => {
    try {
      const response = await inventoryService.updateInventoryStock(id, quantity, reason)
      const updatedItem = response.data
      setInventory(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ))
      return updatedItem
    } catch (error) {
      throw error
    }
  }

  const addInventoryItem = async (item) => {
    try {
      const response = await inventoryService.createInventoryItem(item)
      const newItem = response.data
      setInventory(prev => [...prev, newItem])
      return newItem
    } catch (error) {
      throw error
    }
  }

  const deleteInventoryItem = async (id) => {
    try {
      await inventoryService.deleteInventoryItem(id)
      setInventory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      throw error
    }
  }

  const getProductById = (id) => {
    return products.find(product => product.id === id)
  }

  const getCategoryById = (id) => {
    return categories.find(category => category.id === id)
  }

  const getSupplierById = (id) => {
    return suppliers.find(supplier => supplier.id === id)
  }

  const getInventoryByProductId = (productId) => {
    return inventory.find(item => item.productId === productId)
  }

  const getLowStockProducts = () => {
    return inventory.filter(item => {
      const product = getProductById(item.productId)
      return product && item.quantity <= product.minStock
    }).map(item => ({
      ...item,
      product: getProductById(item.productId)
    }))
  }

  const getInventoryValue = () => {
    return inventory.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.cost || 0) * item.quantity
    }, 0)
  }

  const refreshData = () => {
    loadInitialData()
  }

  const value = {
    products,
    categories,
    suppliers,
    inventory,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    updateInventory,
    addInventoryItem,
    deleteInventoryItem,
    getProductById,
    getCategoryById,
    getSupplierById,
    getInventoryByProductId,
    getLowStockProducts,
    getInventoryValue,
    refreshData
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
} 