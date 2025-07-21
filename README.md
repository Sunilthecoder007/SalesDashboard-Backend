# 📊 Sales Dashboard Backend API

A comprehensive Node.js/Express backend providing REST APIs for a dynamic sales dashboard application. Built to serve sales analytics data with filtering capabilities by state, date range, and customer.

## 🚀 Features

### **Required APIs (✅ Implemented)**
- **States API** - Get list of all states for dropdown selection
- **Date Range API** - Get min/max order dates for a specific state

### **Bonus APIs (🎯 Implemented)**
- **Dashboard Data API** - Complete dashboard metrics (cards + charts)
- **Customers API** - Get list of all customers
- **Sales Trend API** - Time-based sales analytics
- **Analytics API** - Detailed performance metrics

### **Technical Features**
- 🔒 **CORS enabled** for frontend integration
- 🛡️ **Error handling** with consistent response format
- 📝 **TypeScript support** (optional)
- 🔍 **Input validation** and data filtering
- 📊 **Real-time calculations** from JSON data source
- ⚡ **Performance optimized** for dashboard needs

## 🏗️ Architecture

```
Backend Structure:
├── server.js (JavaScript version)
├── src/server.ts (TypeScript version)
├── data.json (Sales data source)
├── package.json
├── tsconfig.json (TypeScript config)
└── README.md
```

## 🚀 Quick Start

### Option 1: JavaScript Setup (Fast Start)

```bash
# 1. Clone/Download the project
mkdir sales-dashboard-backend
cd sales-dashboard-backend

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install express cors
npm install --save-dev nodemon

# 4. Copy files
# - Copy server.js to project root
# - Copy data.json to project root
# - Update package.json scripts

# 5. Start development server
npm run dev
```

### Option 2: TypeScript Setup (Recommended)

```bash
# 1. Initialize project
mkdir sales-dashboard-backend
cd sales-dashboard-backend
npm init -y

# 2. Install dependencies
npm install express cors
npm install --save-dev @types/express @types/cors @types/node typescript ts-node nodemon

# 3. Setup structure
mkdir src dist

# 4. Copy files
# - Copy server.ts to src/ folder
# - Copy tsconfig.json to root
# - Copy data.json to root
# - Update package.json scripts

# 5. Start development
npm run ts:dev

# 6. Build for production
npm run ts:build
npm run ts:start
```

## 📝 Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "ts:start": "node dist/server.js",
    "ts:dev": "nodemon --exec ts-node src/server.ts",
    "ts:build": "tsc",
    "ts:watch": "tsc --watch"
  }
}
```

## 🔌 API Endpoints

### **Base URL:** `http://localhost:3001/api`

| Method | Endpoint | Description | Type |
|--------|----------|-------------|------|
| GET | `/health` | Health check | System |
| GET | `/states` | Get all states | Required ✅ |
| GET | `/date-range/:state` | Get date range for state | Required ✅ |
| GET | `/dashboard-data` | Get dashboard data | Bonus 🎯 |
| GET | `/customers` | Get all customers | Bonus 🎯 |
| GET | `/sales-trend` | Get sales trend | Bonus 🎯 |
| GET | `/analytics` | Get detailed analytics | Bonus 🎯 |

## 📊 API Documentation

### 1. States API
```http
GET /api/states
```

**Response:**
```json
{
  "success": true,
  "data": ["California", "Texas", "New York", "Florida", ...]
}
```

### 2. Date Range API
```http
GET /api/date-range/California
```

**Response:**
```json
{
  "success": true,
  "data": {
    "minDate": "2014-05-13",
    "maxDate": "2017-07-16"
  }
}
```

### 3. Dashboard Data API
```http
GET /api/dashboard-data?state=California&fromDate=2016-01-01&toDate=2016-12-31
```

**Query Parameters:**
- `state` (optional) - Filter by state
- `fromDate` (optional) - Start date (YYYY-MM-DD)
- `toDate` (optional) - End date (YYYY-MM-DD)
- `customerId` (optional) - Filter by customer ID

**Response:**
```json
{
  "success": true,
  "data": {
    "cards": {
      "totalSales": 125000,
      "quantitySold": 450,
      "discountPercentage": 12.5,
      "profit": 35000
    },
    "charts": {
      "salesByCity": [
        { "city": "Los Angeles", "sales": 25000 },
        { "city": "San Francisco", "sales": 18000 }
      ],
      "salesByProducts": [
        { "productName": "Product A", "sales": 15000 }
      ],
      "salesByCategory": [
        { "category": "Furniture", "sales": 40000 }
      ],
      "salesBySubCategory": [
        { "subCategory": "Chairs", "sales": 12000 }
      ],
      "salesBySegment": [
        { "segment": "Consumer", "sales": 75000 }
      ]
    }
  }
}
```

### 4. Customers API
```http
GET /api/customers
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "CG-12520", "name": "Claire Gute" },
    { "id": "DV-13045", "name": "Darrin Van Huff" }
  ]
}
```

### 5. Sales Trend API
```http
GET /api/sales-trend?state=California&period=monthly
```

**Query Parameters:**
- `state`, `fromDate`, `toDate`, `customerId` - Same as dashboard-data
- `period` - 'daily', 'monthly', 'yearly' (default: 'monthly')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "period": "2016-01",
      "sales": 25000,
      "profit": 7500,
      "quantity": 150
    }
  ]
}
```

### 6. Analytics API
```http
GET /api/analytics?state=California
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topProducts": [
      {
        "productName": "Product A",
        "category": "Furniture",
        "totalSales": 15000,
        "totalProfit": 4500,
        "totalQuantity": 25,
        "orderCount": 10,
        "avgOrderValue": 1500
      }
    ],
    "regionalPerformance": [
      {
        "region": "West",
        "sales": 50000,
        "profit": 15000,
        "orders": 200,
        "avgOrderValue": 250
      }
    ],
    "summary": {
      "totalOrders": 500,
      "uniqueCustomers": 150,
      "avgOrderValue": 250,
      "totalCategories": 3
    }
  }
}
```

## 🗄️ Data Source

The API reads from `data.json` file containing sales records with the following structure:

```json
[
  {
    "Row ID": 1,
    "Order ID": "CA-2016-152156",
    "Order Date": "2016-11-08",
    "Ship Date": "2016-11-11",
    "Ship Mode": "Second Class",
    "Customer ID": "CG-12520",
    "Customer Name": "Claire Gute",
    "Segment": "Consumer",
    "Country": "United States",
    "City": "Henderson",
    "State": "Kentucky",
    "Postal Code": 42420,
    "Region": "South",
    "Product ID": "FUR-BO-10001798",
    "Category": "Furniture",
    "Sub-Category": "Bookcases",
    "Product Name": "Bush Somerset Collection Bookcase",
    "Sales": 261.96,
    "Quantity": 2,
    "Discount": 0,
    "Profit": 41.9136
  }
]
```

## 🔧 Environment Setup

### Development
```bash
# Start development server with auto-reload
npm run dev          # JavaScript
npm run ts:dev       # TypeScript
```

### Production
```bash
# Build and start production server
npm run ts:build     # TypeScript only
npm start            # JavaScript
npm run ts:start     # TypeScript
```

## 🌐 CORS Configuration

CORS is enabled for all origins in development. For production, configure specific origins:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com']
}));
```

## 🛠️ Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (development only)"
}
```

**Common Error Status Codes:**
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (state/data not found)
- `500` - Internal Server Error

## 🧪 Testing the APIs

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Get States
```bash
curl http://localhost:3001/api/states
```

### Get Dashboard Data
```bash
curl "http://localhost:3001/api/dashboard-data?state=California&fromDate=2016-01-01&toDate=2016-12-31"
```

## 📈 Performance Features

- **In-memory data processing** for fast responses
- **Efficient filtering algorithms** for large datasets
- **Optimized calculations** for dashboard metrics
- **Minimal memory footprint** using streaming where possible

## 🔒 Security Features

- **Input validation** on all parameters
- **Safe data parsing** with error handling
- **No SQL injection risks** (JSON data source)
- **CORS protection** configured

## 📁 Project Structure Details

```
sales-dashboard-backend/
├── 📄 server.js              # Main JavaScript server
├── 📁 src/
│   └── 📄 server.ts          # TypeScript server source
├── 📁 dist/                  # Compiled TypeScript output
├── 📄 data.json              # Sales data source
├── 📄 package.json           # Dependencies and scripts
├── 📄 tsconfig.json          # TypeScript configuration
└── 📄 README.md              # This file
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables
```bash
PORT=3001                    # Server port
NODE_ENV=production          # Environment mode
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Change port in server file or kill process
lsof -ti:3001 | xargs kill -9
```

**2. Data.json Not Found**
```bash
# Ensure data.json is in the project root directory
ls -la data.json
```

**3. CORS Errors**
```bash
# Verify frontend URL matches CORS configuration
# Check browser console for specific CORS errors
```

**4. TypeScript Compilation Errors**
```bash
# Check tsconfig.json configuration
# Verify all type definitions are installed
npm install --save-dev @types/node @types/express @types/cors
```

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review API documentation
3. Test endpoints with curl/Postman
4. Check server logs for detailed errors

---

**Built with ❤️ for dynamic sales dashboard analytics**
