const venueRepository = require("../repositories/venueRepository");
const pool = require("../config/db"); 

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

async function searchVenues(req, res) {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ message: "Search term required" });
    }
    const venues = await venueRepository.searchVenuesByName(name);
    res.json(venues);
  } catch (error) {
    console.error("Search venues error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// 🔥 Наша новая функция
const suggestVenue = async (req, res) => {
  const { name, district_id, address, has_outlets, has_food, wifi_rating, quiet_rating } = req.body;
  const userId = req.user.userId; // Берем ID пользователя из токена

  const client = await pool.connect();

  try {
 
    const insertQuery = `
      INSERT INTO spots (name, district_id, address, has_outlets, has_food, wifi_rating, quiet_rating, is_approved, submitted_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, $8)
      RETURNING id, name, is_approved;
    `;
    
    const values = [name, district_id, address, has_outlets, has_food, wifi_rating, quiet_rating, userId];
    
    const result = await client.query(insertQuery, values);

    res.status(201).json({
      message: "Thank you! Your spot is pending admin approval.",
      spot: result.rows[0]
    });

  } catch (error) {
    console.error("Suggest spot error:", error);
    res.status(500).json({
      message: "Failed to submit the spot"
    });
  } finally {
    client.release();
  }
};


module.exports = {
  getByDistrict,
  getVenueById,
  searchVenues,
  suggestVenue
};