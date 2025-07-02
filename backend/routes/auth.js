const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body } = require('express-validator')
const { auth } = require('../middleware/auth')
const validate = require('../middleware/validation')
const { successResponse, errorResponse } = require('../utils/response')
const { 
  addUser, 
  findUserByEmail, 
  findUserById 
} = require('../data/users')

const router = express.Router()

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

const signupValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
]

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    successResponse(res, {
      user: userWithoutPassword,
      token
    }, 'Login successful')
  } catch (error) {
    console.error('Login error:', error)
    errorResponse(res, 'Login failed', 500)
  }
})

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', signupValidation, validate, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return errorResponse(res, 'Email already exists', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await addUser({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: 'user'
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    successResponse(res, {
      user: userWithoutPassword
    }, 'Account created successfully')
  } catch (error) {
    console.error('Signup error:', error)
    errorResponse(res, 'Signup failed', 500)
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    successResponse(res, {
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Get user error:', error)
    errorResponse(res, 'Failed to get user', 500)
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return success (client removes token)
    successResponse(res, null, 'Logout successful')
  } catch (error) {
    console.error('Logout error:', error)
    errorResponse(res, 'Logout failed', 500)
  }
})

module.exports = router 