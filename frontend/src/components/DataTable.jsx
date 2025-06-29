import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatNumber } from '../utils/formatters'

const DataTable = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onView,
  searchable = true,
  pagination = true,
  itemsPerPage = 10 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting function
  const sortData = (data) => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  // Search function
  const filterData = (data) => {
    if (!searchTerm) return data

    return data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }

  // Pagination
  const filteredData = filterData(sortData(data))
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-primary-600" />
      : <ChevronDownIcon className="h-4 w-4 text-primary-600" />
  }

  const renderCell = (item, column) => {
    const value = item[column.key]

    switch (column.type) {
      case 'currency':
        return formatCurrency(value)
      case 'number':
        return formatNumber(value)
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'active' ? 'bg-success-100 text-success-800' :
            value === 'inactive' ? 'bg-gray-100 text-gray-800' :
            'bg-warning-100 text-warning-800'
          }`}>
            {value}
          </span>
        )
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={() => onView(item)}
                className="text-primary-600 hover:text-primary-900 text-sm font-medium"
              >
                View
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="text-primary-600 hover:text-primary-900 text-sm font-medium"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="text-danger-600 hover:text-danger-900 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </div>
        )
      default:
        return value
    }
  }

  return (
    <div className="card">
      {/* Search */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field max-w-md"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {paginatedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data found</p>
        </div>
      )}
    </div>
  )
}

export default DataTable 