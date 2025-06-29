const express = require("express");
const {body} = require("express-validator");
const {auth, adminAuth} = require("../middleware/auth");
const validate = require("../middleware/validation");
const {successResponse, errorResponse, paginatedResponse} = require("../utils/response");
const {
  addSupplier,
  findSupplierById,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
  searchSuppliers,
} = require("../data/suppliers");

const router = express.Router();

// Validation rules
const supplierValidation = [
  body("name").notEmpty().withMessage("Supplier name is required"),
  body("contactPerson").notEmpty().withMessage("Contact person is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
];

// @route   GET /api/suppliers
// @desc    Get all suppliers with pagination and search
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {page = 1, limit = 10, search, status} = req.query;

    let suppliers = getAllSuppliers();

    // Apply filters
    if (search) {
      suppliers = searchSuppliers(search);
    }

    if (status) {
      suppliers = suppliers.filter((s) => s.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSuppliers = suppliers.slice(startIndex, endIndex);

    paginatedResponse(res, paginatedSuppliers, page, limit, suppliers.length);
  } catch (error) {
    console.error("Get suppliers error:", error);
    errorResponse(res, "Failed to get suppliers", 500);
  }
});

// @route   GET /api/suppliers/:id
// @desc    Get supplier by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const supplier = findSupplierById(req.params.id);
    if (!supplier) {
      return errorResponse(res, "Supplier not found", 404);
    }

    successResponse(res, supplier);
  } catch (error) {
    console.error("Get supplier error:", error);
    errorResponse(res, "Failed to get supplier", 500);
  }
});

// @route   POST /api/suppliers
// @desc    Create new supplier
// @access  Private (Admin)
router.post("/", adminAuth, supplierValidation, validate, async (req, res) => {
  try {
    const newSupplier = addSupplier(req.body);
    successResponse(res, newSupplier, "Supplier created successfully", 201);
  } catch (error) {
    console.error("Create supplier error:", error);
    errorResponse(res, "Failed to create supplier", 500);
  }
});

// @route   PUT /api/suppliers/:id
// @desc    Update supplier
// @access  Private (Admin)
router.put("/:id", adminAuth, supplierValidation, validate, async (req, res) => {
  try {
    const supplier = findSupplierById(req.params.id);
    if (!supplier) {
      return errorResponse(res, "Supplier not found", 404);
    }

    const updatedSupplier = updateSupplier(req.params.id, req.body);
    successResponse(res, updatedSupplier, "Supplier updated successfully");
  } catch (error) {
    console.error("Update supplier error:", error);
    errorResponse(res, "Failed to update supplier", 500);
  }
});

// @route   DELETE /api/suppliers/:id
// @desc    Delete supplier
// @access  Private (Admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const supplier = findSupplierById(req.params.id);
    if (!supplier) {
      return errorResponse(res, "Supplier not found", 404);
    }

    deleteSupplier(req.params.id);
    successResponse(res, null, "Supplier deleted successfully");
  } catch (error) {
    console.error("Delete supplier error:", error);
    errorResponse(res, "Failed to delete supplier", 500);
  }
});

module.exports = router;
