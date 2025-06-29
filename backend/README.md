# Inventory Management System - Backend API

A robust Node.js/Express backend API for the Inventory Management System with full CRUD operations, authentication, and comprehensive reporting.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: User registration, login, and profile management
- **Product Management**: Full CRUD operations for products with categories and suppliers
- **Inventory Management**: Stock tracking, low stock alerts, and transaction history
- **Category Management**: Product categorization with color coding
- **Supplier Management**: Supplier information and contact details
- **Reporting**: Dashboard analytics, inventory summaries, and transaction reports
- **Security**: Input validation, rate limiting, CORS, and helmet security
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `config.env` and modify as needed
   - Update JWT_SECRET for production

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **For production:**
   ```bash
   npm start
   ```

## 🔧 Configuration

The API uses the following environment variables (see `config.env`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products (with pagination & filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Suppliers
- `GET /api/suppliers` - Get all suppliers (with pagination & search)
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier (Admin)
- `PUT /api/suppliers/:id` - Update supplier (Admin)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin)

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/value` - Get total inventory value
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory` - Create new inventory item (Admin)
- `PUT /api/inventory/:id/stock` - Update stock level (Admin)
- `DELETE /api/inventory/:id` - Delete inventory item (Admin)
- `GET /api/inventory/:id/transactions` - Get item transactions

### Reports
- `GET /api/reports/dashboard` - Dashboard analytics
- `GET /api/reports/inventory-summary` - Inventory summary report
- `GET /api/reports/low-stock` - Low stock report
- `GET /api/reports/transactions` - Transaction history report

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Admin User
- Email: `admin@inventory.com`
- Password: `admin123`

## 📊 Data Structure

### Product
```json
{
  "id": 1,
  "name": "Laptop Pro",
  "sku": "LAP-001",
  "description": "High-performance laptop",
  "categoryId": 1,
  "supplierId": 1,
  "price": 1299.99,
  "cost": 899.99,
  "minStock": 5,
  "maxStock": 50,
  "unit": "piece",
  "status": "active"
}
```

### Inventory Item
```json
{
  "id": 1,
  "productId": 1,
  "quantity": 15,
  "location": "Warehouse A - Shelf 1",
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and user roles
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevents abuse with request limiting
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers middleware
- **Password Hashing**: bcrypt for secure password storage

## 📝 Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📈 Performance

- **Compression**: Response compression for better performance
- **Pagination**: Efficient data pagination
- **Caching**: Ready for Redis integration
- **Optimized Queries**: Efficient data filtering and searching

## 🔄 Development

The backend is designed to work seamlessly with the React frontend. All endpoints return JSON responses and follow RESTful conventions.

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Set up a production database (currently using in-memory data)
5. Use a process manager like PM2

## 📞 Support

For issues or questions, please refer to the main project documentation or create an issue in the repository. 