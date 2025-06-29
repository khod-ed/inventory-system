const express = require("express");
const {body} = require("express-validator");
const {auth, adminAuth} = require("../middleware/auth");
const validate = require("../middleware/validation");
const {successResponse, errorResponse, paginatedResponse} = require("../utils/response");
const {
  addProduct,
  findProductById,
  findProductBySku,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySupplier,
  searchProducts,
} = require("../data/products");
const {findCategoryById} = require("../data/categories");
const {findSupplierById} = require("../data/suppliers");

const router = express.Router();

// Validation rules
const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("price").isFloat({min: 0}).withMessage("Price must be a positive number"),
  body("cost").isFloat({min: 0}).withMessage("Cost must be a positive number"),
  body("minStock").isInt({min: 0}).withMessage("Minimum stock must be a positive integer"),
  body("maxStock").isInt({min: 0}).withMessage("Maximum stock must be a positive integer"),
  body("categoryId").isInt({min: 1}).withMessage("Valid category is required"),
  body("supplierId").isInt({min: 1}).withMessage("Valid supplier is required"),
];

// Validation rules for updates (all fields optional)
const productUpdateValidation = [
  body("name").optional().notEmpty().withMessage("Product name cannot be empty"),
  body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  body("price").optional().isFloat({min: 0}).withMessage("Price must be a positive number"),
  body("cost").optional().isFloat({min: 0}).withMessage("Cost must be a positive number"),
  body("minStock").optional().isInt({min: 0}).withMessage("Minimum stock must be a positive integer"),
  body("maxStock").optional().isInt({min: 0}).withMessage("Maximum stock must be a positive integer"),
  body("categoryId").optional().isInt({min: 1}).withMessage("Valid category is required"),
  body("supplierId").optional().isInt({min: 1}).withMessage("Valid supplier is required"),
];

// @route   GET /api/products
// @desc    Get all products with pagination and filtering
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      supplier,
      status,
    } = req.query;

    let products = getAllProducts();

    // Apply filters
    if (search) {
      products = searchProducts(search);
    }

    if (category) {
      products = getProductsByCategory(category);
    }

    if (supplier) {
      products = getProductsBySupplier(supplier);
    }

    if (status) {
      products = products.filter((p) => p.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Add category and supplier details
    const enrichedProducts = paginatedProducts.map((product) => {
      const category = findCategoryById(product.categoryId);
      const supplier = findSupplierById(product.supplierId);
      return {
        ...product,
        category: category ? {id: category.id, name: category.name, color: category.color} : null,
        supplier: supplier ? {id: supplier.id, name: supplier.name} : null,
      };
    });

    paginatedResponse(res, enrichedProducts, page, limit, products.length);
  } catch (error) {
    console.error("Get products error:", error);
    errorResponse(res, "Failed to get products", 500);
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const product = findProductById(req.params.id);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    // Add category and supplier details
    const category = findCategoryById(product.categoryId);
    const supplier = findSupplierById(product.supplierId);
    const enrichedProduct = {
      ...product,
      category: category ? {id: category.id, name: category.name, color: category.color} : null,
      supplier: supplier ? {id: supplier.id, name: supplier.name} : null,
    };

    successResponse(res, enrichedProduct);
  } catch (error) {
    console.error("Get product error:", error);
    errorResponse(res, "Failed to get product", 500);
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin)
router.post("/", adminAuth, productValidation, validate, async (req, res) => {
  try {
    const {sku} = req.body;

    // Check if SKU already exists
    const existingProduct = findProductBySku(sku);
    if (existingProduct) {
      return errorResponse(res, "SKU already exists", 400);
    }

    // Validate category and supplier exist
    const category = findCategoryById(req.body.categoryId);
    const supplier = findSupplierById(req.body.supplierId);

    if (!category) {
      return errorResponse(res, "Category not found", 400);
    }

    if (!supplier) {
      return errorResponse(res, "Supplier not found", 400);
    }

    const newProduct = addProduct(req.body);
    successResponse(res, newProduct, "Product created successfully", 201);
  } catch (error) {
    console.error("Create product error:", error);
    errorResponse(res, "Failed to create product", 500);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put("/:id", adminAuth, productUpdateValidation, validate, async (req, res) => {
  try {
    const product = findProductById(req.params.id);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    // Check if SKU is being changed and if it already exists
    if (req.body.sku && req.body.sku !== product.sku) {
      const existingProduct = findProductBySku(req.body.sku);
      if (existingProduct) {
        return errorResponse(res, "SKU already exists", 400);
      }
    }

    // Validate category and supplier exist if being updated
    if (req.body.categoryId) {
      const category = findCategoryById(req.body.categoryId);
      if (!category) {
        return errorResponse(res, "Category not found", 400);
      }
    }

    if (req.body.supplierId) {
      const supplier = findSupplierById(req.body.supplierId);
      if (!supplier) {
        return errorResponse(res, "Supplier not found", 400);
      }
    }

    const updatedProduct = updateProduct(req.params.id, req.body);
    successResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    console.error("Update product error:", error);
    errorResponse(res, "Failed to update product", 500);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = findProductById(req.params.id);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    deleteProduct(req.params.id);
    successResponse(res, null, "Product deleted successfully");
  } catch (error) {
    console.error("Delete product error:", error);
    errorResponse(res, "Failed to delete product", 500);
  }
});

module.exports = router;
