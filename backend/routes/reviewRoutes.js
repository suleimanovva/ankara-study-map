const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Adds a review for a study spot
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spot_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: User already reviewed this spot
 *       500:
 *         description: Server error
 */
router.post("/", authenticateToken, async (req, res) => {
  const { spot_id, rating, comment } = req.body;
  const userId = req.user.userId;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert review
    const insertResult = await client.query(
      `INSERT INTO reviews (spot_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, spot_id, user_id, rating, comment`,
      [spot_id, userId, rating, comment]
    );

    // Recalculate ratings
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
    res.status(500).json({
      message: "Failed to create review"
    });

  } finally {
    client.release();
  }
});


/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Soft deletes a review by setting is_deleted to TRUE
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Not allowed to delete this review
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.userId;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get spot id first
    const reviewResult = await client.query(
      `SELECT spot_id FROM reviews WHERE id = $1`,
      [reviewId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    const spotId = reviewResult.rows[0].spot_id;

    // Soft delete review
    const deleteResult = await client.query(
      `UPDATE reviews
       SET is_deleted = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [reviewId, userId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(403).json({
        message: "Not allowed to delete this review"
      });
    }

    // Recalculate ratings
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
      [spotId]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Delete review error:", error);
    res.status(500).json({
      message: "Failed to delete review"
    });

  } finally {
    client.release();
  }
});

module.exports = router;