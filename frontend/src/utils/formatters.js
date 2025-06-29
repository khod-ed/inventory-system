export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

export const formatSKU = (sku) => {
  return sku?.toUpperCase() || ''
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const generateSKU = (category, productName) => {
  const categoryCode = category?.substring(0, 3).toUpperCase() || 'PRO'
  const productCode = productName?.substring(0, 3).toUpperCase() || 'DCT'
  const timestamp = Date.now().toString().slice(-4)
  return `${categoryCode}${productCode}${timestamp}`
} 