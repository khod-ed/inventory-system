const { db } = require('../firebase-admin');
const bcrypt = require('bcryptjs');
const USERS_COLLECTION = 'users';

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
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const userRef = await db.collection(USERS_COLLECTION).add(newUser);
  const userSnap = await userRef.get();
  return { id: userRef.id, ...userSnap.data() };
};

const findUserByEmail = async (email) => {
  const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const findUserById = async (id) => {
  const doc = await db.collection(USERS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const updateUser = async (id, updates) => {
  updates.updatedAt = new Date().toISOString();
  await db.collection(USERS_COLLECTION).doc(id).update(updates);
  return findUserById(id);
};

const deleteUser = async (id) => {
  const user = await findUserById(id);
  if (!user) return null;
  await db.collection(USERS_COLLECTION).doc(id).delete();
  return user;
};

const getAllUsers = async () => {
  const snapshot = await db.collection(USERS_COLLECTION).get();
  return snapshot.docs.map(doc => {
    const { password, ...userWithoutPassword } = doc.data();
    return { id: doc.id, ...userWithoutPassword };
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