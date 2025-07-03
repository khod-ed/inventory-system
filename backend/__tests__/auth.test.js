const request = require('supertest');
const app = require('../server');

// Mock the users data module
jest.mock('../data/users', () => ({
  findUserByEmail: jest.fn(),
  addUser: jest.fn()
}));

const { findUserByEmail, addUser } = require('../data/users');

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should register a new user and return user object', async () => {
    const mockUser = {
      id: 'test-id-123',
      firstName: 'Test',
      lastName: 'User',
      name: 'Test User',
      email: 'testuser@example.com',
      role: 'user',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    // Mock that no user exists with this email
    findUserByEmail.mockResolvedValue(null);
    
    // Mock successful user creation
    addUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'Password123' // meets validation: 8+ chars, upper, lower, number
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data.user');
    expect(res.body.data.user).toHaveProperty('email', 'testuser@example.com');
    expect(res.body.data.user).toHaveProperty('firstName', 'Test');
    expect(res.body.data.user).toHaveProperty('lastName', 'User');
    
    // Verify the mocks were called correctly
    expect(findUserByEmail).toHaveBeenCalledWith('testuser@example.com');
    expect(addUser).toHaveBeenCalled();
  });

  it('should return error if user already exists', async () => {
    const existingUser = {
      id: 'existing-id',
      email: 'existing@example.com',
      firstName: 'Existing',
      lastName: 'User'
    };

    // Mock that user already exists
    findUserByEmail.mockResolvedValue(existingUser);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email already exists');
    
    // Verify addUser was not called
    expect(addUser).not.toHaveBeenCalled();
  });
}); 