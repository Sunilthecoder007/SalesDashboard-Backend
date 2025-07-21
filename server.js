const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load sales data
const loadSalesData = () => {
  try {
    const dataPath = path.join(__dirname, "sales.json");
    const rawData = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error loading sales data:", error);
    return [];
  }
};

// Helper function to format date strings for comparison
const parseDate = (dateString) => {
  return new Date(dateString);
};

// Helper function to filter data by state and date range
const filterData = (data, state, fromDate, toDate) => {
  return data.filter((item) => {
    const itemDate = parseDate(item["Order Date"]);
    const stateMatch = !state || item.State === state;
    const dateMatch =
      (!fromDate || itemDate >= parseDate(fromDate)) &&
      (!toDate || itemDate <= parseDate(toDate));
    return stateMatch && dateMatch;
  });
};

// REQUIRED APIs

// 1. Get list of states for dropdown
app.get("/api/states", (req, res) => {
  try {
    const salesData = loadSalesData();
    const states = [...new Set(salesData.map((item) => item.State))].sort();

    res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching states",
      error: error.message,
    });
  }
});

// 2. Get min and max dates for a state
app.get("/api/date-range/:state", (req, res) => {
  try {
    const { state } = req.params;
    const salesData = loadSalesData();

    const stateData = salesData.filter((item) => item.State === state);

    if (stateData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the specified state",
      });
    }

    const dates = stateData.map((item) => parseDate(item["Order Date"]));
    const minDate = new Date(Math.min(...dates)).toISOString().split("T")[0];
    const maxDate = new Date(Math.max(...dates)).toISOString().split("T")[0];

    res.json({
      success: true,
      data: {
        minDate,
        maxDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching date range",
      error: error.message,
    });
  }
});

// BONUS APIs

// 3. Get dashboard data (cards and charts)
app.get("/api/dashboard-data", (req, res) => {
  try {
    const { state, fromDate, toDate, customerId } = req.query;
    const salesData = loadSalesData();

    let filteredData = filterData(salesData, state, fromDate, toDate);

    // Filter by customer ID if provided
    if (customerId) {
      filteredData = filteredData.filter(
        (item) => item["Customer ID"] === customerId
      );
    }

    // Calculate metrics
    const totalSales = filteredData.reduce((sum, item) => sum + item.Sales, 0);
    const totalQuantity = filteredData.reduce(
      (sum, item) => sum + item.Quantity,
      0
    );
    const totalProfit = filteredData.reduce(
      (sum, item) => sum + item.Profit,
      0
    );

    // Calculate average discount percentage
    const discountData = filteredData.filter((item) => item.Discount > 0);
    const avgDiscount =
      discountData.length > 0
        ? (discountData.reduce((sum, item) => sum + item.Discount, 0) /
            discountData.length) *
          100
        : 0;

    // Sales by City
    const salesByCity = {};
    filteredData.forEach((item) => {
      if (!salesByCity[item.City]) {
        salesByCity[item.City] = 0;
      }
      salesByCity[item.City] += item.Sales;
    });

    const salesByCityArray = Object.entries(salesByCity)
      .map(([city, sales]) => ({ city, sales: Math.round(sales) }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // Sales by Products (top 10)
    const salesByProduct = {};
    filteredData.forEach((item) => {
      if (!salesByProduct[item["Product Name"]]) {
        salesByProduct[item["Product Name"]] = 0;
      }
      salesByProduct[item["Product Name"]] += item.Sales;
    });

    const salesByProductArray = Object.entries(salesByProduct)
      .map(([productName, sales]) => ({
        productName,
        sales: Math.round(sales),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // Sales by Category
    const salesByCategory = {};
    filteredData.forEach((item) => {
      if (!salesByCategory[item.Category]) {
        salesByCategory[item.Category] = 0;
      }
      salesByCategory[item.Category] += item.Sales;
    });

    const salesByCategoryArray = Object.entries(salesByCategory).map(
      ([category, sales]) => ({ category, sales: Math.round(sales) })
    );

    // Sales by Sub Category
    const salesBySubCategory = {};
    filteredData.forEach((item) => {
      if (!salesBySubCategory[item["Sub-Category"]]) {
        salesBySubCategory[item["Sub-Category"]] = 0;
      }
      salesBySubCategory[item["Sub-Category"]] += item.Sales;
    });

    const salesBySubCategoryArray = Object.entries(salesBySubCategory)
      .map(([subCategory, sales]) => ({
        subCategory,
        sales: Math.round(sales),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // Sales by Segment
    const salesBySegment = {};
    filteredData.forEach((item) => {
      if (!salesBySegment[item.Segment]) {
        salesBySegment[item.Segment] = 0;
      }
      salesBySegment[item.Segment] += item.Sales;
    });

    const salesBySegmentArray = Object.entries(salesBySegment).map(
      ([segment, sales]) => ({ segment, sales: Math.round(sales) })
    );

    res.json({
      success: true,
      data: {
        cards: {
          totalSales: Math.round(totalSales),
          quantitySold: totalQuantity,
          discountPercentage: Math.round(avgDiscount * 10) / 10,
          profit: Math.round(totalProfit),
        },
        charts: {
          salesByCity: salesByCityArray,
          salesByProducts: salesByProductArray,
          salesByCategory: salesByCategoryArray,
          salesBySubCategory: salesBySubCategoryArray,
          salesBySegment: salesBySegmentArray,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
});

// 4. Get all customers for dropdown (bonus)
app.get("/api/customers", (req, res) => {
  try {
    const salesData = loadSalesData();
    const customers = [
      ...new Set(
        salesData.map((item) => ({
          id: item["Customer ID"],
          name: item["Customer Name"],
        }))
      ),
    ].sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching customers",
      error: error.message,
    });
  }
});

// 5. Get sales trend over time (bonus)
app.get("/api/sales-trend", (req, res) => {
  try {
    const {
      state,
      fromDate,
      toDate,
      customerId,
      period = "monthly",
    } = req.query;
    const salesData = loadSalesData();

    let filteredData = filterData(salesData, state, fromDate, toDate);

    if (customerId) {
      filteredData = filteredData.filter(
        (item) => item["Customer ID"] === customerId
      );
    }

    // Group by period
    const trendData = {};

    filteredData.forEach((item) => {
      const date = parseDate(item["Order Date"]);
      let periodKey;

      if (period === "monthly") {
        periodKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      } else if (period === "yearly") {
        periodKey = date.getFullYear().toString();
      } else {
        periodKey = date.toISOString().split("T")[0];
      }

      if (!trendData[periodKey]) {
        trendData[periodKey] = {
          period: periodKey,
          sales: 0,
          profit: 0,
          quantity: 0,
        };
      }

      trendData[periodKey].sales += item.Sales;
      trendData[periodKey].profit += item.Profit;
      trendData[periodKey].quantity += item.Quantity;
    });

    const trendArray = Object.values(trendData)
      .map((item) => ({
        ...item,
        sales: Math.round(item.sales),
        profit: Math.round(item.profit),
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    res.json({
      success: true,
      data: trendArray,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sales trend",
      error: error.message,
    });
  }
});

// 6. Get detailed analytics (bonus)
app.get("/api/analytics", (req, res) => {
  try {
    const { state, fromDate, toDate } = req.query;
    const salesData = loadSalesData();

    const filteredData = filterData(salesData, state, fromDate, toDate);

    // Top performing products
    const productPerformance = {};
    filteredData.forEach((item) => {
      const key = item["Product Name"];
      if (!productPerformance[key]) {
        productPerformance[key] = {
          productName: key,
          category: item.Category,
          totalSales: 0,
          totalProfit: 0,
          totalQuantity: 0,
          orderCount: 0,
        };
      }
      productPerformance[key].totalSales += item.Sales;
      productPerformance[key].totalProfit += item.Profit;
      productPerformance[key].totalQuantity += item.Quantity;
      productPerformance[key].orderCount += 1;
    });

    const topProducts = Object.values(productPerformance)
      .map((item) => ({
        ...item,
        totalSales: Math.round(item.totalSales),
        totalProfit: Math.round(item.totalProfit),
        avgOrderValue: Math.round(item.totalSales / item.orderCount),
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    // Regional performance
    const regionalPerformance = {};
    filteredData.forEach((item) => {
      if (!regionalPerformance[item.Region]) {
        regionalPerformance[item.Region] = {
          region: item.Region,
          sales: 0,
          profit: 0,
          orders: 0,
        };
      }
      regionalPerformance[item.Region].sales += item.Sales;
      regionalPerformance[item.Region].profit += item.Profit;
      regionalPerformance[item.Region].orders += 1;
    });

    const regionArray = Object.values(regionalPerformance).map((item) => ({
      ...item,
      sales: Math.round(item.sales),
      profit: Math.round(item.profit),
      avgOrderValue: Math.round(item.sales / item.orders),
    }));

    res.json({
      success: true,
      data: {
        topProducts,
        regionalPerformance: regionArray,
        summary: {
          totalOrders: filteredData.length,
          uniqueCustomers: new Set(
            filteredData.map((item) => item["Customer ID"])
          ).size,
          avgOrderValue: Math.round(
            filteredData.reduce((sum, item) => sum + item.Sales, 0) /
              filteredData.length
          ),
          totalCategories: new Set(filteredData.map((item) => item.Category))
            .size,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Sales Dashboard API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Sales Dashboard API Server running on port ${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
