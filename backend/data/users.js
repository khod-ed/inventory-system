const bcrypt = require('bcryptjs')

// Mock users data (in a real app, this would be in a database)
let users = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@inventory.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 3,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z'
  }
]

const addUser = (userData) => {
  const newUser = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  users.push(newUser)
  return newUser
}

const findUserByEmail = (email) => {
  return users.find(user => user.email === email)
}

const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id))
}

const updateUser = (id, updates) => {
  const index = users.findIndex(user => user.id === parseInt(id))
  if (index !== -1) {
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
    return users[index]
  }
  return null
}

const deleteUser = (id) => {
  const index = users.findIndex(user => user.id === parseInt(id))
  if (index !== -1) {
    const deletedUser = users[index]
    users = users.filter(user => user.id !== parseInt(id))
    return deletedUser
  }
  return null
}

const getAllUsers = () => {
  return users.map(user => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

module.exports = {
  users,
  addUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers
} 