import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { formatCurrency } from '../utils/formatters'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import toast from 'react-hot-toast'

const ProductsPage = () => {
  const { 
    products, 
    categories, 
    suppliers,
    getCategoryById,
    getSupplierById,
    addProduct,
    updateProduct,
    deleteProduct
  } = useInventory()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSupplier, setFilterSupplier] = useState('')

  // Filter products
  const filteredProducts = products.filter(product => {
    if (filterCategory && product.categoryId !== parseInt(filterCategory)) return false
    if (filterSupplier && product.supplierId !== parseInt(filterSupplier)) return false
    return true
  })

  const columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category.name', label: 'Category' },
    { key: 'supplier.name', label: 'Supplier' },
    { key: 'price', label: 'Price', type: 'currency' },
    { key: 'cost', label: 'Cost', type: 'currency' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ]

  const formatTableData = (data) => {
    return data.map(product => ({
      ...product,
      'category.name': getCategoryById(product.categoryId)?.name || 'N/A',
      'supplier.name': getSupplierById(product.supplierId)?.name || 'N/A'
    }))
  }

  const handleAddProduct = (formData) => {
    try {
      const newProduct = {
        name: formData.name,
        sku: formData.sku,
        categoryId: parseInt(formData.categoryId),
        supplierId: parseInt(formData.supplierId),
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        description: formData.description
      }
      addProduct(newProduct)
      toast.success('Product added successfully!')
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to add product')
    }
  }

  const handleEditProduct = (formData) => {
    try {
      const updatedProduct = {
        name: formData.name,
        sku: formData.sku,
        categoryId: parseInt(formData.categoryId),
        supplierId: parseInt(formData.supplierId),
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        description: formData.description
      }
      updateProduct(selectedProduct.id, updatedProduct)
      toast.success('Product updated successfully!')
      setShowEditModal(false)
      setSelectedProduct(null)
    } catch (error) {
      toast.error('Failed to update product')
    }
  }

  const handleDeleteProduct = () => {
    try {
      deleteProduct(selectedProduct.id)
      toast.success('Product deleted successfully!')
      setShowDeleteDialog(false)
      setSelectedProduct(null)
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  const openDeleteDialog = (product) => {
    setSelectedProduct(product)
    setShowDeleteDialog(true)
  }

  const ProductForm = ({ onSubmit, initialData = {}, submitText = 'Add Product' }) => (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      onSubmit(Object.fromEntries(formData))
    }} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Product Name"
          name="name"
          required
          defaultValue={initialData.name}
          placeholder="Enter product name"
        />
        
        <Input
          label="SKU"
          name="sku"
          required
          defaultValue={initialData.sku}
          placeholder="Enter SKU"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          name="categoryId"
          required
          defaultValue={initialData.categoryId || ''}
          options={[
            { value: '', label: 'Select Category' },
            ...categories.map(cat => ({ value: cat.id, label: cat.name }))
          ]}
        />
        
        <Select
          label="Supplier"
          name="supplierId"
          required
          defaultValue={initialData.supplierId || ''}
          options={[
            { value: '', label: 'Select Supplier' },
            ...suppliers.map(sup => ({ value: sup.id, label: sup.name }))
          ]}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={initialData.price}
          placeholder="Enter price"
        />
        
        <Input
          label="Cost"
          name="cost"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={initialData.cost}
          placeholder="Enter cost"
        />
      </div>
      
      <Input
        label="Description"
        name="description"
        defaultValue={initialData.description}
        placeholder="Enter product description"
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setShowAddModal(false)
            setShowEditModal(false)
            setSelectedProduct(null)
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {submitText}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog and information
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={PlusIcon}
        >
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFilterCategory('')
                setFilterSupplier('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <DataTable
          data={formatTableData(filteredProducts)}
          columns={columns}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
        />
      ) : (
        <EmptyState
          title="No products found"
          description="Get started by adding your first product to the catalog."
          action={
            <Button
              onClick={() => setShowAddModal(true)}
              icon={PlusIcon}
            >
              Add Product
            </Button>
          }
        />
      )}

      {/* Add Product Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm onSubmit={handleAddProduct} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        size="lg"
      >
        {selectedProduct && (
          <ProductForm 
            onSubmit={handleEditProduct} 
            initialData={selectedProduct}
            submitText="Update Product"
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone and will also remove any associated inventory items.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default ProductsPage 