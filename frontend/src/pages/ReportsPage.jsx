import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import Button from '../components/Button'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import Select from '../components/Select'

const ReportsPage = () => {
  const { 
    products, 
    inventory, 
    categories, 
    suppliers,
    getProductById,
    getCategoryById,
    getSupplierById,
    getLowStockProducts,
    getInventoryValue
  } = useInventory()

  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('30')

  // Calculate various metrics
  const totalProducts = products.length
  const totalInventoryItems = inventory.length
  const totalInventoryValue = getInventoryValue()
  const lowStockProducts = getLowStockProducts()
  const outOfStockProducts = inventory.filter(item => item.quantity === 0).length

  // Category breakdown
  const categoryBreakdown = categories.map(category => {
    const categoryProducts = products.filter(product => product.categoryId === category.id)
    const categoryInventory = inventory.filter(item => 
      categoryProducts.some(product => product.id === item.productId)
    )
    const categoryValue = categoryInventory.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.cost || 0) * item.quantity
    }, 0)
    
    return {
      name: category.name,
      productCount: categoryProducts.length,
      inventoryValue: categoryValue,
      avgPrice: categoryProducts.length > 0 
        ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length 
        : 0
    }
  })

  // Supplier breakdown
  const supplierBreakdown = suppliers.map(supplier => {
    const supplierProducts = products.filter(product => product.supplierId === supplier.id)
    const supplierInventory = inventory.filter(item => 
      supplierProducts.some(product => product.id === item.productId)
    )
    const supplierValue = supplierInventory.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.cost || 0) * item.quantity
    }, 0)
    
    return {
      name: supplier.name,
      productCount: supplierProducts.length,
      inventoryValue: supplierValue,
      contact: supplier.email
    }
  })

  // Low stock report
  const lowStockReport = lowStockProducts.map(item => ({
    product: getProductById(item.productId)?.name || 'Unknown',
    sku: getProductById(item.productId)?.sku || 'N/A',
    currentStock: item.quantity,
    minStock: item.minStock,
    category: getCategoryById(getProductById(item.productId)?.categoryId)?.name || 'N/A',
    supplier: getSupplierById(getProductById(item.productId)?.supplierId)?.name || 'N/A'
  }))

  const lowStockColumns = [
    { key: 'product', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'currentStock', label: 'Current Stock', type: 'number' },
    { key: 'minStock', label: 'Min Stock', type: 'number' },
    { key: 'category', label: 'Category' },
    { key: 'supplier', label: 'Supplier' }
  ]

  const categoryColumns = [
    { key: 'name', label: 'Category' },
    { key: 'productCount', label: 'Products', type: 'number' },
    { key: 'inventoryValue', label: 'Inventory Value', type: 'currency' },
    { key: 'avgPrice', label: 'Avg Price', type: 'currency' }
  ]

  const supplierColumns = [
    { key: 'name', label: 'Supplier' },
    { key: 'productCount', label: 'Products', type: 'number' },
    { key: 'inventoryValue', label: 'Inventory Value', type: 'currency' },
    { key: 'contact', label: 'Contact' }
  ]

  const handleExportReport = (reportType) => {
    // Mock export functionality
    console.log(`Exporting ${reportType} report...`)
    // In a real app, this would generate and download a CSV/PDF
  }

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Products"
                value={totalProducts}
                icon={CubeIcon}
              />
              <StatsCard
                title="Total Inventory Value"
                value={totalInventoryValue}
                changeType="currency"
                icon={CurrencyDollarIcon}
              />
              <StatsCard
                title="Low Stock Items"
                value={lowStockProducts.length}
                icon={ExclamationTriangleIcon}
              />
              <StatsCard
                title="Out of Stock"
                value={outOfStockProducts}
                icon={ExclamationTriangleIcon}
              />
            </div>

            {/* Category Breakdown */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Category Breakdown</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={DocumentArrowDownIcon}
                    onClick={() => handleExportReport('categories')}
                  >
                    Export
                  </Button>
                </div>
              }
            >
              <DataTable
                data={categoryBreakdown}
                columns={categoryColumns}
                searchable={false}
                pagination={false}
              />
            </Card>
          </div>
        )

      case 'low-stock':
        return (
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Low Stock Report</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={DocumentArrowDownIcon}
                  onClick={() => handleExportReport('low-stock')}
                >
                  Export
                </Button>
              </div>
            }
          >
            {lowStockReport.length > 0 ? (
              <DataTable
                data={lowStockReport}
                columns={lowStockColumns}
                searchable={true}
                pagination={true}
                itemsPerPage={10}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No low stock items found</p>
              </div>
            )}
          </Card>
        )

      case 'suppliers':
        return (
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Supplier Analysis</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={DocumentArrowDownIcon}
                  onClick={() => handleExportReport('suppliers')}
                >
                  Export
                </Button>
              </div>
            }
          >
            <DataTable
              data={supplierBreakdown}
              columns={supplierColumns}
              searchable={false}
              pagination={false}
            />
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate reports and analyze your inventory data
        </p>
      </div>

      {/* Report Controls */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Report Type"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            options={[
              { value: 'overview', label: 'Overview Dashboard' },
              { value: 'low-stock', label: 'Low Stock Report' },
              { value: 'suppliers', label: 'Supplier Analysis' }
            ]}
          />
          
          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last year' }
            ]}
          />
          
          <div className="flex items-end">
            <Button
              variant="primary"
              icon={ChartBarIcon}
              onClick={() => handleExportReport(selectedReport)}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  )
}

export default ReportsPage 