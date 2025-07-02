const express = require('express')
const { body } = require('express-validator')
const { auth, adminAuth } = require('../middleware/auth')
const validate = require('../middleware/validation')
const { successResponse, errorResponse } = require('../utils/response')
const {
  addCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../data/categories')

const router = express.Router()

// Validation rules
const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('color').isHexColor().withMessage('Valid color is required')
]

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await getAllCategories()
    successResponse(res, categories)
  } catch (error) {
    console.error('Get categories error:', error)
    errorResponse(res, 'Failed to get categories', 500)
  }
})

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const category = await findCategoryById(req.params.id)
    if (!category) {
      return errorResponse(res, 'Category not found', 404)
    }

    successResponse(res, category)
  } catch (error) {
    console.error('Get category error:', error)
    errorResponse(res, 'Failed to get category', 500)
  }
})

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin)
router.post('/', adminAuth, categoryValidation, validate, async (req, res) => {
  try {
    const newCategory = await addCategory(req.body)
    successResponse(res, newCategory, 'Category created successfully', 201)
  } catch (error) {
    console.error('Create category error:', error)
    errorResponse(res, 'Failed to create category', 500)
  }
})

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/:id', adminAuth, categoryValidation, validate, async (req, res) => {
  try {
    const category = await findCategoryById(req.params.id)
    if (!category) {
      return errorResponse(res, 'Category not found', 404)
    }

    const updatedCategory = await updateCategory(req.params.id, req.body)
    successResponse(res, updatedCategory, 'Category updated successfully')
  } catch (error) {
    console.error('Update category error:', error)
    errorResponse(res, 'Failed to update category', 500)
  }
})

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await findCategoryById(req.params.id)
    if (!category) {
      return errorResponse(res, 'Category not found', 404)
    }

    await deleteCategory(req.params.id)
    successResponse(res, null, 'Category deleted successfully')
  } catch (error) {
    console.error('Delete category error:', error)
    errorResponse(res, 'Failed to delete category', 500)
  }
})

module.exports = router 