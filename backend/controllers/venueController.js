const venueRepository = require("../repositories/venueRepository");

async function getByDistrict(req, res) {
  try {
    const districtId = req.params.districtId;

    const venues = await venueRepository.getVenuesByDistrictId(districtId);

    res.json(venues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getByDistrict
};