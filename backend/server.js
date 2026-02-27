const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const venueRoutes = require("./routes/venueRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test database connection
pool.connect()
  .then(() => console.log("PostgreSQL connected 🐘"))
  .catch(err => console.error("DB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Ankara Study Map Backend Running 🚀");
});

// Mount venue routes
app.use("/api/venues", venueRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});