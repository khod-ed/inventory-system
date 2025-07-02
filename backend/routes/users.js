const express = require('express')
const { body } = require('express-validator')
const { adminAuth } = require('../middleware/auth')
const validate = require('../middleware/validation')
const { successResponse, errorResponse } = require('../utils/response')
const {
  getAllUsers,
  findUserById,
  updateUser,
  deleteUser
} = require('../data/users')

const router = express.Router()

// Validation rules
const userUpdateValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin')
]

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await getAllUsers()
    successResponse(res, users)
  } catch (error) {
    console.error('Get users error:', error)
    errorResponse(res, 'Failed to get users', 500)
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private (Admin)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await findUserById(req.params.id)
    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    successResponse(res, userWithoutPassword)
  } catch (error) {
    console.error('Get user error:', error)
    errorResponse(res, 'Failed to get user', 500)
  }
})

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Private (Admin)
router.put('/:id', adminAuth, userUpdateValidation, validate, async (req, res) => {
  try {
    const user = await findUserById(req.params.id)
    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    const updatedUser = await updateUser(req.params.id, req.body)
    if (!updatedUser) {
      return errorResponse(res, 'Failed to update user', 500)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser
    successResponse(res, userWithoutPassword, 'User updated successfully')
  } catch (error) {
    console.error('Update user error:', error)
    errorResponse(res, 'Failed to update user', 500)
  }
})

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await findUserById(req.params.id)
    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return errorResponse(res, 'Cannot delete your own account', 400)
    }

    await deleteUser(req.params.id)
    successResponse(res, null, 'User deleted successfully')
  } catch (error) {
    console.error('Delete user error:', error)
    errorResponse(res, 'Failed to delete user', 500)
  }
})

module.exports = router 