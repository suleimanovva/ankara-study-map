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

/*
  GET /api/venues/:id
*/
async function getVenueById(req, res) {

  const id = req.params.id;

  try {

    const data = await venueRepository.getVenueById(id);

    if (!data.venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json(data);

  } catch (error) {
    console.error("Get venue error:", error);
    res.status(500).json({ message: "Server error" });
  }

}

module.exports = {
  getByDistrict,
  getVenueById
};