const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const pool = require("../config/db");

/**
 * @swagger
 * /api/venues/search:
 * get:
 * summary: Search venues by name
 */
router.get("/search", venueController.searchVenues);

/**
 * @swagger
 * /api/venues/district/{districtId}:
 * get:
 * summary: Get venues by district ID (Protected)
 */
router.get(
  "/district/:districtId",
  authenticateToken,
  venueController.getByDistrict
);

/**
 * @swagger
 * /api/venues:
 * post:
 * summary: Suggest a new study spot
 */
router.post(
  "/",
  authenticateToken,
  venueController.suggestVenue
);

/**
 * @swagger
 * /api/venues/admin/pending:
 * get:
 * summary: Get all pending venues (Admin)
 */
router.get(
  "/admin/pending",
  authenticateToken,
  requireAdmin, // 🔥 THIS IS THE FIX
  venueController.getPendingVenues
);

/**
 * @swagger
 * /api/venues/admin/{id}/approve:
 * put:
 * summary: Approve a pending venue (Admin)
 */
router.put(
  "/admin/:id/approve",
  authenticateToken,
  requireAdmin, // 🔥 THIS IS THE FIX
  venueController.approveVenue
);

/**
 * @swagger
 * /api/venues/admin/{id}/reject:
 * delete:
 * summary: Reject/Delete a pending venue (Admin)
 */
router.delete(
  "/admin/:id/reject",
  authenticateToken,
  requireAdmin, // 🔥 THIS IS THE FIX
  venueController.rejectVenue
);

/**
 * @swagger
 * /api/venues/{id}:
 * get:
 * summary: Get venue details
 */
router.get("/:id", venueController.getVenueById);

// DELETE APPROVED SPOT (ADMIN ONLY)
router.delete(
  "/admin/:id/delete",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query(
        "UPDATE spots SET is_deleted = true WHERE id = $1",
        [id]
      );

      res.json({ message: "Spot deleted successfully 🗑️" });
    } catch (err) {
      console.error("Delete spot error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;