// Mock suppliers data
let suppliers = [
  {
    id: 1,
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    website: 'https://techsolutions.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Office Supplies Co.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@officesupplies.com',
    phone: '+1-555-0456',
    address: '456 Office Ave, Business District, NY 10001',
    website: 'https://officesupplies.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Furniture World',
    contactPerson: 'Mike Davis',
    email: 'mike@furnitureworld.com',
    phone: '+1-555-0789',
    address: '789 Furniture Blvd, Design Center, TX 75001',
    website: 'https://furnitureworld.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    name: 'Garden Tools Ltd.',
    contactPerson: 'Lisa Wilson',
    email: 'lisa@gardentools.com',
    phone: '+1-555-0321',
    address: '321 Garden Lane, Green Acres, FL 33101',
    website: 'https://gardentools.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 5,
    name: 'Kitchen Essentials',
    contactPerson: 'David Brown',
    email: 'david@kitchenessentials.com',
    phone: '+1-555-0654',
    address: '654 Kitchen Road, Culinary District, CA 90210',
    website: 'https://kitchenessentials.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

const addSupplier = (supplierData) => {
  const newSupplier = {
    id: Date.now(),
    ...supplierData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  suppliers.push(newSupplier)
  return newSupplier
}

const findSupplierById = (id) => {
  return suppliers.find(supplier => supplier.id === parseInt(id))
}

const updateSupplier = (id, updates) => {
  const index = suppliers.findIndex(supplier => supplier.id === parseInt(id))
  if (index !== -1) {
    suppliers[index] = { ...suppliers[index], ...updates, updatedAt: new Date().toISOString() }
    return suppliers[index]
  }
  return null
}

const deleteSupplier = (id) => {
  const index = suppliers.findIndex(supplier => supplier.id === parseInt(id))
  if (index !== -1) {
    const deletedSupplier = suppliers[index]
    suppliers = suppliers.filter(supplier => supplier.id !== parseInt(id))
    return deletedSupplier
  }
  return null
}

const getAllSuppliers = () => {
  return suppliers
}

const searchSuppliers = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(lowercaseQuery) ||
    supplier.contactPerson.toLowerCase().includes(lowercaseQuery) ||
    supplier.email.toLowerCase().includes(lowercaseQuery)
  )
}

module.exports = {
  suppliers,
  addSupplier,
  findSupplierById,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
  searchSuppliers
} 