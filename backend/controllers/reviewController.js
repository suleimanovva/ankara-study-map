const pool = require("../config/db");

/*
  CREATE REVIEW
  POST /api/reviews
*/
exports.createReview = async (req, res) => {
  const { spot_id, rating, comment } = req.body;
  const userId = req.user.userId; // coming from JWT middleware

  try {

    const result = await pool.query(
      `INSERT INTO reviews (user_id, spot_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, spot_id, rating, comment]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};