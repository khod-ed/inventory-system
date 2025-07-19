// Mock suppliers data
let suppliers = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    contactPerson: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Office Supplies Inc',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@officesupplies.com',
    phone: '+1-555-0456',
    address: '456 Business Ave, New York, NY 10001',
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Furniture World',
    contactPerson: 'Mike Davis',
    email: 'mike@furnitureworld.com',
    phone: '+1-555-0789',
    address: '789 Furniture Blvd, Chicago, IL 60601',
    status: 'active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

const addSupplier = async (supplierData) => {
  const newSupplier = {
    id: suppliers.length + 1,
    ...supplierData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  suppliers.push(newSupplier);
  return newSupplier;
};

const findSupplierById = async (id) => {
  return suppliers.find(supplier => supplier.id == id) || null;
};

const updateSupplier = async (id, updates) => {
  const supplierIndex = suppliers.findIndex(supplier => supplier.id == id);
  if (supplierIndex === -1) return null;
  
  suppliers[supplierIndex] = {
    ...suppliers[supplierIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return suppliers[supplierIndex];
};

const deleteSupplier = async (id) => {
  const supplierIndex = suppliers.findIndex(supplier => supplier.id == id);
  if (supplierIndex === -1) return null;
  
  const deletedSupplier = suppliers[supplierIndex];
  suppliers.splice(supplierIndex, 1);
  return deletedSupplier;
};

const getAllSuppliers = async () => {
  return suppliers;
};

const searchSuppliers = async (query) => {
  const lowercaseQuery = query.toLowerCase();
  return suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(lowercaseQuery) ||
    supplier.contactPerson.toLowerCase().includes(lowercaseQuery) ||
    supplier.email.toLowerCase().includes(lowercaseQuery)
  );
};

module.exports = {
  addSupplier,
  findSupplierById,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
  searchSuppliers
}; 