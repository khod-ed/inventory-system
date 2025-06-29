const Card = ({ 
  children, 
  className = '',
  header,
  footer,
  padding = true 
}) => {
  return (
    <div className={`card ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-200">
          {header}
        </div>
      )}
      
      <div className={padding ? 'px-6 py-4' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card 