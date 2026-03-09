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

// ==========================================
// 🔥 ХАК №1: ДЛЯ ГЛАВНОЙ СТРАНИЦЫ (Все 19 карточек) 🔥
// ==========================================
app.get("/api/venues", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM spots WHERE is_deleted = false");
    res.json(result.rows);
  } catch (err) {
    console.error("Error while getting the data", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 🔥 ХАК №2: ДЛЯ СТРАНИЦЫ ОДНОГО КАФЕ (Теперь с отзывами!) 🔥
// ==========================================
app.get("/api/venues/:id", async (req, res, next) => {
  const { id } = req.params;
  
  // Пропускаем, если вместо ID пришло слово (чтобы не сломать другие маршруты Роа)
  if (isNaN(id)) return next();

  try {
    // 1. Берем само кафе
    const spotResult = await pool.query("SELECT * FROM spots WHERE id = $1", [id]);
    
    if (spotResult.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }
    
    // 2. Берем НАСТОЯЩИЕ отзывы для этого кафе и имя пользователя
    const reviewsResult = await pool.query(
      `SELECT r.id, r.rating, r.comment, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.spot_id = $1 AND r.is_deleted = false 
       ORDER BY r.created_at DESC`, 
      [id]
    );
    
    // 3. Склеиваем кафе и отзывы
    const venueData = spotResult.rows[0];
    venueData.reviews = reviewsResult.rows; 

    res.json(venueData); // Отправляем всё на фронтенд!
  } catch (err) {
    console.error("Error while getting the venue:", err);
    res.status(500).json({ error: "Server error" });
  }
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