const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");

router.get("/district/:districtId", venueController.getByDistrict);

module.exports = router;