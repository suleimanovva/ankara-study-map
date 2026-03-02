const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const venueRoutes = require("./routes/venueRoutes");
const authRoutes = require("./routes/authRoutes");

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
app.use("/api/auth", authRoutes);

// 🔐 Swagger Document with JWT Security
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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/venues/district/{districtId}": {
      get: {
        summary: "Get venues by district ID (Protected)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "districtId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "List of venues" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },

    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["username", "email", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        summary: "Login user and receive JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "JWT token returned" },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});