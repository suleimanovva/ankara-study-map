const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");

/**
 * @swagger
 * /api/venues/district/{districtId}:
 *   get:
 *     summary: Get venues by district ID
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
 */

router.get("/district/:districtId", venueController.getByDistrict);

module.exports = router;