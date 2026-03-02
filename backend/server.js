const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const venueRoutes = require("./routes/venueRoutes");

// 🔹 Swagger (manual spec, no swagger-jsdoc)
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test DB connection
pool.connect()
  .then(() => console.log("PostgreSQL connected 🐘"))
  .catch(err => console.error("DB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Ankara Study Map Backend Running 🚀");
});

// Routes
app.use("/api/venues", venueRoutes);

// 🔹 Manual Swagger document
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Ankara Study Map API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  paths: {
    "/api/venues/district/{districtId}": {
      get: {
        summary: "Get venues by district ID",
        parameters: [
          {
            name: "districtId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "List of venues",
          },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});