import { formatCurrency, formatNumber } from '../utils/formatters'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'number',
  icon: Icon,
  trend = 'up',
  className = '' 
}) => {
  const formatValue = (val, type) => {
    switch (type) {
      case 'currency':
        return formatCurrency(val)
      case 'number':
        return formatNumber(val)
      case 'percentage':
        return `${val}%`
      default:
        return val
    }
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success-600' : 'text-danger-600'
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗' : '↘'
  }

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(value, changeType)}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)} {formatValue(Math.abs(change), changeType)}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard 