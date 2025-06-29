import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { PlusIcon } from '@heroicons/react/24/outline'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Badge from '../components/Badge'
import toast from 'react-hot-toast'

const CategoriesPage = () => {
  const { 
    categories, 
    products,
    addCategory,
    updateCategory,
    deleteCategory
  } = useInventory()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Calculate product counts for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    productCount: products.filter(product => product.categoryId === category.id).length
  }))

  const columns = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'productCount', label: 'Products', type: 'number' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ]

  const handleAddCategory = (formData) => {
    try {
      const newCategory = {
        name: formData.name,
        description: formData.description
      }
      addCategory(newCategory)
      toast.success('Category added successfully!')
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to add category')
    }
  }

  const handleEditCategory = (formData) => {
    try {
      const updatedCategory = {
        name: formData.name,
        description: formData.description
      }
      updateCategory(selectedCategory.id, updatedCategory)
      toast.success('Category updated successfully!')
      setShowEditModal(false)
      setSelectedCategory(null)
    } catch (error) {
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = () => {
    try {
      // Check if category has products
      const productCount = products.filter(product => product.categoryId === selectedCategory.id).length
      if (productCount > 0) {
        toast.error(`Cannot delete category with ${productCount} products. Please reassign or delete the products first.`)
        return
      }
      
      deleteCategory(selectedCategory.id)
      toast.success('Category deleted successfully!')
      setShowDeleteDialog(false)
      setSelectedCategory(null)
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const openEditModal = (category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const openDeleteDialog = (category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  const CategoryForm = ({ onSubmit, initialData = {}, submitText = 'Add Category' }) => (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      onSubmit(Object.fromEntries(formData))
    }} className="space-y-4">
      <Input
        label="Category Name"
        name="name"
        required
        defaultValue={initialData.name}
        placeholder="Enter category name"
      />
      
      <Input
        label="Description"
        name="description"
        defaultValue={initialData.description}
        placeholder="Enter category description"
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setShowAddModal(false)
            setShowEditModal(false)
            setSelectedCategory(null)
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product categories and classifications
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={PlusIcon}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      {categoriesWithCounts.length > 0 ? (
        <DataTable
          data={categoriesWithCounts}
          columns={columns}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
        />
      ) : (
        <EmptyState
          title="No categories found"
          description="Get started by adding your first product category."
          action={
            <Button
              onClick={() => setShowAddModal(true)}
              icon={PlusIcon}
            >
              Add Category
            </Button>
          }
        />
      )}

      {/* Add Category Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
        size="md"
      >
        <CategoryForm onSubmit={handleAddCategory} />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Category"
        size="md"
      >
        {selectedCategory && (
          <CategoryForm 
            onSubmit={handleEditCategory} 
            initialData={selectedCategory}
            submitText="Update Category"
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default CategoriesPage 