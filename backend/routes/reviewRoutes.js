const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

/*
  POST /api/reviews
  Protected route
*/
router.post("/", authMiddleware, reviewController.createReview);

module.exports = router;