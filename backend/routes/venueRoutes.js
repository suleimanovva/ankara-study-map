const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const authenticateToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/venues/search:
 *   get:
 *     summary: Search venues by name
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for venue name
 *     responses:
 *       200:
 *         description: List of matching venues
 */
router.get("/search", venueController.searchVenues);

/**
 * @swagger
 * /api/venues/district/{districtId}:
 *   get:
 *     summary: Get venues by district ID (Protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The district ID
 *     responses:
 *       200:
 *         description: List of venues
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/district/:districtId",
  authenticateToken,
  venueController.getByDistrict
);

/*
  GET VENUE DETAILS
  GET /api/venues/:id
*/
router.get("/:id", venueController.getVenueById);

module.exports = router;