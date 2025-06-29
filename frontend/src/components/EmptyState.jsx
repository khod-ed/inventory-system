import { PlusIcon } from '@heroicons/react/24/outline'

const EmptyState = ({ 
  title = 'No data found',
  description = 'Get started by creating your first item.',
  icon: Icon = PlusIcon,
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto h-12 w-12 text-gray-400">
        <Icon className="h-12 w-12" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState 