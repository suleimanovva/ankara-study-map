const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const venueRoutes = require("./routes/venueRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

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

// API Routes
app.use("/api/venues", venueRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// Swagger API Documentation
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

    "/api/venues/{id}": {
      get: {
        summary: "Get venue details and reviews",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Venue details with reviews" },
          404: { description: "Venue not found" },
        },
      },
    },

    "/api/reviews": {
      post: {
        summary: "Create a review (Protected)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  spot_id: { type: "integer" },
                  rating: { type: "integer" },
                  comment: { type: "string" }
                },
                required: ["spot_id", "rating"]
              }
            }
          }
        },
        responses: {
          201: { description: "Review created successfully" },
          401: { description: "Unauthorized" }
        }
      }
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

    "/api/auth/google": {
      post: {
        summary: "Login with Google OAuth",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" }
                },
                required: ["token"]
              }
            }
          }
        },
        responses: {
          200: { description: "JWT token returned" },
          401: { description: "Google authentication failed" }
        }
      }
    }

  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});