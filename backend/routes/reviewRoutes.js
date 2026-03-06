const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

/*
POST /api/reviews
Protected route
*/

router.post("/", authenticateToken, async (req, res) => {

  const { spot_id, rating, comment } = req.body;
  const user_id = req.user.userId;

  try {

    const result = await pool.query(
      `INSERT INTO reviews (spot_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, spot_id, user_id, rating, comment`,
      [spot_id, user_id, rating, comment]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }

});

module.exports = router;