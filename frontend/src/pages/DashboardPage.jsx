import { useInventory } from '../context/InventoryContext'
import { formatCurrency, formatNumber } from '../utils/formatters'
import {
  CubeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import StatsCard from '../components/StatsCard'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import Badge from '../components/Badge'

const DashboardPage = () => {
  const { 
    products, 
    inventory, 
    getLowStockProducts, 
    getInventoryValue 
  } = useInventory()

  const totalProducts = products.length
  const totalInventoryItems = inventory.length
  const lowStockProducts = getLowStockProducts()
  const totalInventoryValue = getInventoryValue()

  // Calculate recent activity (mock data for now)
  const recentActivity = [
    {
      id: 1,
      type: 'stock_update',
      product: 'Laptop Pro',
      quantity: 10,
      action: 'Added',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      user: 'Admin User'
    },
    {
      id: 2,
      type: 'product_added',
      product: 'Wireless Keyboard',
      action: 'Created',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      user: 'Admin User'
    },
    {
      id: 3,
      type: 'low_stock_alert',
      product: 'Garden Hose',
      quantity: 3,
      action: 'Low Stock',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      user: 'System'
    }
  ]

  const activityColumns = [
    { key: 'action', label: 'Action', type: 'status' },
    { key: 'product', label: 'Product' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'user', label: 'User' },
    { key: 'timestamp', label: 'Time', type: 'datetime' }
  ]

  const lowStockColumns = [
    { key: 'product.name', label: 'Product' },
    { key: 'product.sku', label: 'SKU' },
    { key: 'quantity', label: 'Current Stock', type: 'number' },
    { key: 'minStock', label: 'Min Stock', type: 'number' },
    { key: 'status', label: 'Status', type: 'status' }
  ]

  const getActivityStatus = (type) => {
    switch (type) {
      case 'stock_update':
        return { text: 'Stock Updated', variant: 'success' }
      case 'product_added':
        return { text: 'Product Added', variant: 'primary' }
      case 'low_stock_alert':
        return { text: 'Low Stock Alert', variant: 'warning' }
      default:
        return { text: 'Activity', variant: 'default' }
    }
  }

  const formatActivityData = (activity) => {
    return activity.map(item => ({
      ...item,
      action: getActivityStatus(item.type).text,
      status: getActivityStatus(item.type).variant,
      timestamp: new Date(item.timestamp).toLocaleString()
    }))
  }

  const formatLowStockData = (items) => {
    return items.map(item => ({
      ...item,
      'product.name': item.product?.name || 'Unknown',
      'product.sku': item.product?.sku || 'N/A',
      status: item.quantity <= item.minStock ? 'Low Stock' : 'In Stock'
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your inventory management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          change={5}
          changeType="number"
          trend="up"
          icon={CubeIcon}
        />
        <StatsCard
          title="Total Inventory Value"
          value={totalInventoryValue}
          change={12.5}
          changeType="currency"
          trend="up"
          icon={CurrencyDollarIcon}
        />
        <StatsCard
          title="Inventory Items"
          value={totalInventoryItems}
          change={-2}
          changeType="number"
          trend="down"
          icon={ArrowTrendingUpIcon}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockProducts.length}
          change={3}
          changeType="number"
          trend="up"
          icon={ExclamationTriangleIcon}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <button className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </button>
            </div>
          }
        >
          <DataTable
            data={formatActivityData(recentActivity)}
            columns={activityColumns}
            searchable={false}
            pagination={false}
            itemsPerPage={5}
          />
        </Card>

        {/* Low Stock Alerts */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
              <Badge variant="warning" size="sm">
                {lowStockProducts.length} items
              </Badge>
            </div>
          }
        >
          {lowStockProducts.length > 0 ? (
            <DataTable
              data={formatLowStockData(lowStockProducts)}
              columns={lowStockColumns}
              searchable={false}
              pagination={false}
              itemsPerPage={5}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No low stock alerts</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card
        header={<h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Add Product</p>
                <p className="text-xs text-gray-500">Create new product</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-success-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Update Stock</p>
                <p className="text-xs text-gray-500">Adjust inventory levels</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-warning-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">View Reports</p>
                <p className="text-xs text-gray-500">Generate reports</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-info-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">View insights</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  )
}

export default DashboardPage 