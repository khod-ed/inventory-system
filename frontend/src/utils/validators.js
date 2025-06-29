export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength
}

export const validateNumber = (value) => {
  return !isNaN(value) && value !== null && value !== undefined
}

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && Number(value) > 0
}

export const validatePrice = (value) => {
  return validateNumber(value) && Number(value) >= 0
}

export const validateSKU = (sku) => {
  const skuRegex = /^[A-Z0-9]{3,20}$/
  return skuRegex.test(sku?.toUpperCase())
}

export const validateProductForm = (data) => {
  const errors = {}

  if (!validateRequired(data.name)) {
    errors.name = 'Product name is required'
  }

  if (!validateRequired(data.sku)) {
    errors.sku = 'SKU is required'
  } else if (!validateSKU(data.sku)) {
    errors.sku = 'SKU must be 3-20 characters, letters and numbers only'
  }

  if (!validateRequired(data.categoryId)) {
    errors.categoryId = 'Category is required'
  }

  if (!validateRequired(data.supplierId)) {
    errors.supplierId = 'Supplier is required'
  }

  if (!validatePrice(data.price)) {
    errors.price = 'Price must be a valid number'
  }

  if (!validatePrice(data.cost)) {
    errors.cost = 'Cost must be a valid number'
  }

  return errors
}

export const validateCategoryForm = (data) => {
  const errors = {}

  if (!validateRequired(data.name)) {
    errors.name = 'Category name is required'
  }

  if (!validateMinLength(data.name, 2)) {
    errors.name = 'Category name must be at least 2 characters'
  }

  return errors
}

export const validateSupplierForm = (data) => {
  const errors = {}

  if (!validateRequired(data.name)) {
    errors.name = 'Supplier name is required'
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  return errors
} 