const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

/*
POST /api/reviews
Create a new review (Protected)
*/
router.post("/", authenticateToken, async (req, res) => {
  const { spot_id, rating, comment } = req.body;
  const userId = req.user.userId;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Insert the review
    const insertResult = await client.query(
      `INSERT INTO reviews (spot_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, spot_id, user_id, rating, comment`,
      [spot_id, userId, rating, comment]
    );

    // 2️⃣ Recalculate average ratings
    await client.query(
      `UPDATE spots
       SET wifi_rating = (
         SELECT ROUND(AVG(rating))
         FROM reviews
         WHERE spot_id = $1 AND is_deleted = FALSE
       ),
       quiet_rating = (
         SELECT ROUND(AVG(rating))
         FROM reviews
         WHERE spot_id = $1 AND is_deleted = FALSE
       )
       WHERE id = $1`,
      [spot_id]
    );

    await client.query("COMMIT");

    res.status(201).json(insertResult.rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(400).json({
        message: "You have already reviewed this venue"
      });
    }

    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });

  } finally {
    client.release();
  }
});

/*
DELETE /api/reviews/:id
Delete a user's own review (Protected)
*/
router.delete("/:id", authenticateToken, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE reviews
       SET is_deleted = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [reviewId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Not allowed to delete this review"
      });
    }

    res.status(200).json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      message: "Failed to delete review"
    });
  }
});

module.exports = router;