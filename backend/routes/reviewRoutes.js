const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, async (req, res) => {
  const { spot_id, rating, comment } = req.body;
  const user_id = req.user.userId;

  // Use a client from the pool for the transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1️⃣ Insert the review
    const result = await client.query(
      `INSERT INTO reviews (spot_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, spot_id, user_id, rating, comment`,
      [spot_id, user_id, rating, comment]
    );

    // 2️⃣ Recalculate average rating
    await client.query(
      `UPDATE spots
       SET wifi_rating = (SELECT ROUND(AVG(rating)) FROM reviews WHERE spot_id = $1),
           quiet_rating = (SELECT ROUND(AVG(rating)) FROM reviews WHERE spot_id = $1)
       WHERE id = $1`,
      [spot_id]
    );

    await client.query('COMMIT'); // Save changes
    res.status(201).json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK'); // Undo changes on error
    
    if (error.code === "23505") {
      return res.status(400).json({ message: "You have already reviewed this venue" });
    }

    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  } finally {
    client.release(); // Always release the client back to the pool
  }
});

module.exports = router;