const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const authenticateToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/venues/search:
 * get:
 * summary: Search venues by name
 * parameters:
 * - in: query
 * name: name
 * required: true
 * schema:
 * type: string
 * description: Search term for venue name
 * responses:
 * 200:
 * description: List of matching venues
 */
router.get("/search", venueController.searchVenues);

/**
 * @swagger
 * /api/venues/district/{districtId}:
 * get:
 * summary: Get venues by district ID (Protected)
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: districtId
 * required: true
 * schema:
 * type: integer
 * description: The district ID
 * responses:
 * 200:
 * description: List of venues
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
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

/**
 * @swagger
 * /api/venues:
 * post:
 * summary: Suggest a new study spot
 * description: Authenticated students can suggest a new venue. It receives is_approved=false by default.
 * tags:
 * - Venues
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * district_id:
 * type: integer
 * address:
 * type: string
 * has_outlets:
 * type: boolean
 * has_food:
 * type: boolean
 * wifi_rating:
 * type: integer
 * quiet_rating:
 * type: integer
 * responses:
 * 201:
 * description: Spot submitted for admin review
 * 500:
 * description: Server error
 */
router.post("/", authenticateToken, venueController.suggestVenue);

module.exports = router;