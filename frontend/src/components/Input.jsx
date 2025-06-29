import { forwardRef } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon: Icon,
  onIconClick,
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  const inputClasses = `
    input-field
    ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}
    ${Icon ? 'pl-10' : ''}
    ${className}
  `.trim()

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div 
            className={`absolute inset-y-0 left-0 pl-3 flex items-center ${onIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
            onClick={onIconClick}
          >
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-danger-500" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-danger-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input 