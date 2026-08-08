const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// ======================================================
// LABORATORY AUTH ROUTES
// ======================================================

app.use(
  "/api/laboratory-auth",
  require(
    "./routes/laboratoryAuthRoutes"
  )
);
// ======================================================
// PHARMACY AUTH ROUTES
// ======================================================
app.use( "/api/medicine-categories", require( "./routes/medicineCategoryRoutes" ) );
app.use( "/api/medicine-subcategories", require( "./routes/medicineSubCategoryRoutes" ) );
app.use( "/api/medicine-items", require( "./routes/medicineItemRoutes" ) );
app.use(
  "/api/pharmacy-auth",
  require(
    "./routes/pharmacyAuthRoutes"
  )
);
app.use(
  "/api/diagnostic-test",
  require("./routes/diagnosticTestRoutes")
);
const labManagementRoutes = require(
  "./routes/labManagementRoutes"
);

app.use(
  "/api/lab-management",
  labManagementRoutes
);app.use(
  "/api/lab-booking-management",
  require(
    "./routes/labBookingManagementRoutes"
  )
);
const billingRoutes =
  require("./routes/billingRoutes");

app.use(
  "/api/billing",
  billingRoutes
);
// server.js

const labAvailabilityRoutes =
require("./routes/labAvailabilityRoutes");


// ROUTES
app.use(
  "/api/lab-availability",
  labAvailabilityRoutes
);
// ======================================================
// PHARMACY ORDER ROUTES
// ======================================================

app.use(
  "/api/pharmacy-orders",
  require(
    "./routes/pharmacyOrderRoutes"
  )
);
// ======================================================
// LAB PERFORMANCE ROUTES
// ======================================================

app.use(
  "/api/lab-performance",
  require(
    "./routes/labPerformanceRoutes"
  )
);
app.use(
  "/api/pharmacy-settings",
  require(
    "./routes/pharmacySettingsRoutes"
  )
);
app.use(
  "/api/categories",
  require("./routes/categoryRoutes")
);
// server.js

const bookingLabRoutes =
require(
  "./routes/bookingLabRoutes"
);

app.use(
  "/api/booking-lab",
  bookingLabRoutes
);
app.use(

  "/api/reception-auth",

  require(
    "./routes/receptionAuthRoutes"
  )

);
// ======================================================
// PHARMACY PRODUCT ROUTES
// ======================================================

// app.use(
//   "/api/pharmacy-products",
//   require(
//     "./routes/pharmacyProductRoutes"
//   )
// );
app.use(
  "/api/pickup-orders",
  require(
    "./routes/pickupOrderRoutes"
  )
);
// ======================================================
// LAB REPORT ROUTES
// ======================================================

app.use(
  "/api/lab-reports",
  require(
    "./routes/labReportRoutes"
  )
);
app.use(
  "/api/schedules",
  require("./routes/scheduleRoutes")
);
app.use(

  "/api/pet-care-products",

  require(
    "./routes/petCareProductRoutes"
  )

);    
const appointmentRoutes =
  require("./routes/appointmentRoutes");

app.use(
  "/api/appointments",
  appointmentRoutes
);
// ================================
// server.js / app.js
// ================================


app.use(

  "/api/management-pet-orders",

  require(
    "./routes/managementPetOrderRoutes"
  )

);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});