import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { PlusIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Badge from '../components/Badge'
import toast from 'react-hot-toast'

const SuppliersPage = () => {
  const { 
    suppliers, 
    products,
    addSupplier,
    updateSupplier,
    deleteSupplier
  } = useInventory()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  // Calculate product counts for each supplier
  const suppliersWithCounts = suppliers.map(supplier => ({
    ...supplier,
    productCount: products.filter(product => product.supplierId === supplier.id).length
  }))

  const columns = [
    { key: 'name', label: 'Supplier Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'productCount', label: 'Products', type: 'number' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ]

  const handleAddSupplier = (formData) => {
    try {
      const newSupplier = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }
      addSupplier(newSupplier)
      toast.success('Supplier added successfully!')
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to add supplier')
    }
  }

  const handleEditSupplier = (formData) => {
    try {
      const updatedSupplier = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }
      updateSupplier(selectedSupplier.id, updatedSupplier)
      toast.success('Supplier updated successfully!')
      setShowEditModal(false)
      setSelectedSupplier(null)
    } catch (error) {
      toast.error('Failed to update supplier')
    }
  }

  const handleDeleteSupplier = () => {
    try {
      // Check if supplier has products
      const productCount = products.filter(product => product.supplierId === selectedSupplier.id).length
      if (productCount > 0) {
        toast.error(`Cannot delete supplier with ${productCount} products. Please reassign or delete the products first.`)
        return
      }
      
      deleteSupplier(selectedSupplier.id)
      toast.success('Supplier deleted successfully!')
      setShowDeleteDialog(false)
      setSelectedSupplier(null)
    } catch (error) {
      toast.error('Failed to delete supplier')
    }
  }

  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier)
    setShowEditModal(true)
  }

  const openDeleteDialog = (supplier) => {
    setSelectedSupplier(supplier)
    setShowDeleteDialog(true)
  }

  const SupplierForm = ({ onSubmit, initialData = {}, submitText = 'Add Supplier' }) => (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      onSubmit(Object.fromEntries(formData))
    }} className="space-y-4">
      <Input
        label="Supplier Name"
        name="name"
        required
        defaultValue={initialData.name}
        placeholder="Enter supplier name"
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={initialData.email}
        placeholder="Enter email address"
      />
      
      <Input
        label="Phone"
        name="phone"
        defaultValue={initialData.phone}
        placeholder="Enter phone number"
      />
      
      <Input
        label="Address"
        name="address"
        defaultValue={initialData.address}
        placeholder="Enter address"
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setShowAddModal(false)
            setShowEditModal(false)
            setSelectedSupplier(null)
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your suppliers and vendor information
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={PlusIcon}
        >
          Add Supplier
        </Button>
      </div>

      {/* Suppliers Table */}
      {suppliersWithCounts.length > 0 ? (
        <DataTable
          data={suppliersWithCounts}
          columns={columns}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
        />
      ) : (
        <EmptyState
          title="No suppliers found"
          description="Get started by adding your first supplier."
          action={
            <Button
              onClick={() => setShowAddModal(true)}
              icon={PlusIcon}
            >
              Add Supplier
            </Button>
          }
        />
      )}

      {/* Add Supplier Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Supplier"
        size="md"
      >
        <SupplierForm onSubmit={handleAddSupplier} />
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Supplier"
        size="md"
      >
        {selectedSupplier && (
          <SupplierForm 
            onSubmit={handleEditSupplier} 
            initialData={selectedSupplier}
            submitText="Update Supplier"
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteSupplier}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${selectedSupplier?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default SuppliersPage 