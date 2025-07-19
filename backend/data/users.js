const bcrypt = require('bcryptjs');

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

const addUser = async (userData) => {
  const newUser = {
    id: users.length + 1,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

const findUserByEmail = async (email) => {
  return users.find(user => user.email === email) || null;
};

const findUserById = async (id) => {
  return users.find(user => user.id == id) || null;
};

const updateUser = async (id, updates) => {
  const userIndex = users.findIndex(user => user.id == id);
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return users[userIndex];
};

const deleteUser = async (id) => {
  const userIndex = users.findIndex(user => user.id == id);
  if (userIndex === -1) return null;
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  return deletedUser;
};

const getAllUsers = async () => {
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

module.exports = {
  addUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers
}; 