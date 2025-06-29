import { forwardRef } from 'react'
import { ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  const selectClasses = `
    input-field
    appearance-none
    bg-white
    ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}
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
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {error ? (
            <ExclamationCircleIcon className="h-5 w-5 text-danger-500" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-danger-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select 