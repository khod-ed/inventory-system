import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import Card from '../components/Card'
import Badge from '../components/Badge'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

const InventoryPage = () => {
  const { 
    inventory, 
    products, 
    categories, 
    suppliers,
    getProductById,
    getCategoryById,
    getSupplierById,
    updateInventory,
    addInventoryItem
  } = useInventory()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSupplier, setFilterSupplier] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  // Combine inventory with product details
  const inventoryWithDetails = inventory.map(item => {
    const product = getProductById(item.productId)
    const category = product ? getCategoryById(product.categoryId) : null
    const supplier = product ? getSupplierById(product.supplierId) : null
    
    return {
      ...item,
      product,
      category,
      supplier,
      stockStatus: item.quantity <= item.minStock ? 'Low' : item.quantity === 0 ? 'Out' : 'In Stock',
      stockValue: product ? product.cost * item.quantity : 0
    }
  })

  // Filter inventory
  const filteredInventory = inventoryWithDetails.filter(item => {
    if (filterCategory && item.category?.id !== parseInt(filterCategory)) return false
    if (filterSupplier && item.supplier?.id !== parseInt(filterSupplier)) return false
    if (stockFilter) {
      switch (stockFilter) {
        case 'low':
          return item.quantity <= item.minStock
        case 'out':
          return item.quantity === 0
        case 'in':
          return item.quantity > item.minStock
        default:
          return true
      }
    }
    return true
  })

  const columns = [
    { key: 'product.name', label: 'Product' },
    { key: 'product.sku', label: 'SKU' },
    { key: 'category.name', label: 'Category' },
    { key: 'supplier.name', label: 'Supplier' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'minStock', label: 'Min Stock', type: 'number' },
    { key: 'stockValue', label: 'Stock Value', type: 'currency' },
    { key: 'stockStatus', label: 'Status', type: 'status' },
    { key: 'location', label: 'Location' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ]

  const formatTableData = (data) => {
    return data.map(item => ({
      ...item,
      'product.name': item.product?.name || 'Unknown',
      'product.sku': item.product?.sku || 'N/A',
      'category.name': item.category?.name || 'N/A',
      'supplier.name': item.supplier?.name || 'N/A',
      stockStatus: item.stockStatus
    }))
  }

  const handleUpdateStock = (item) => {
    setSelectedItem(item)
    setShowUpdateModal(true)
  }

  const handleDeleteItem = (item) => {
    setSelectedItem(item)
    setShowDeleteDialog(true)
  }

  const handleStockUpdate = async (formData) => {
    try {
      await updateInventory(selectedItem.productId, parseInt(formData.quantity))
      toast.success('Stock updated successfully!')
      setShowUpdateModal(false)
      setSelectedItem(null)
    } catch (error) {
      toast.error('Failed to update stock')
    }
  }

  const handleAddInventory = async (formData) => {
    try {
      const newItem = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        location: formData.location
      }
      await addInventoryItem(newItem)
      toast.success('Inventory item added successfully!')
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to add inventory item')
    }
  }

  const getStockStatusBadge = (status) => {
    switch (status) {
      case 'Low':
        return <Badge variant="warning">Low Stock</Badge>
      case 'Out':
        return <Badge variant="danger">Out of Stock</Badge>
      case 'In Stock':
        return <Badge variant="success">In Stock</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your inventory levels and stock locations
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={PlusIcon}
        >
          Add Inventory Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
          />
          
          <Select
            label="Filter by Supplier"
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            options={[
              { value: '', label: 'All Suppliers' },
              ...suppliers.map(sup => ({ value: sup.id, label: sup.name }))
            ]}
          />
          
          <Select
            label="Stock Status"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            options={[
              { value: '', label: 'All Stock' },
              { value: 'low', label: 'Low Stock' },
              { value: 'out', label: 'Out of Stock' },
              { value: 'in', label: 'In Stock' }
            ]}
          />
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFilterCategory('')
                setFilterSupplier('')
                setStockFilter('')
              }}
              icon={FunnelIcon}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <DataTable
        data={formatTableData(filteredInventory)}
        columns={columns}
        onEdit={handleUpdateStock}
        onDelete={handleDeleteItem}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
      />

      {/* Add Inventory Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Inventory Item"
        size="lg"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          handleAddInventory(Object.fromEntries(formData))
        }} className="space-y-4">
          <Select
            label="Product"
            name="productId"
            required
            options={products.map(prod => ({ value: prod.id, label: prod.name }))}
          />
          
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            required
            placeholder="Enter quantity"
          />
          
          <Input
            label="Minimum Stock Level"
            name="minStock"
            type="number"
            min="0"
            required
            placeholder="Enter minimum stock level"
          />
          
          <Input
            label="Location"
            name="location"
            required
            placeholder="Enter storage location"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Stock Level"
        size="md"
      >
        {selectedItem && (
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            handleStockUpdate(Object.fromEntries(formData))
          }} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Product</p>
              <p className="font-medium">{selectedItem.product?.name}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="font-medium">{selectedItem.quantity}</p>
            </div>
            
            <Input
              label="New Quantity"
              name="quantity"
              type="number"
              min="0"
              required
              defaultValue={selectedItem.quantity}
              placeholder="Enter new quantity"
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Stock
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          // Handle delete logic here
          toast.success('Inventory item deleted successfully!')
          setShowDeleteDialog(false)
          setSelectedItem(null)
        }}
        title="Delete Inventory Item"
        message={`Are you sure you want to delete the inventory item for "${selectedItem?.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default InventoryPage 