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

const suggestVenue = async (req, res) => {
  const { name, district_id, address, has_outlets, has_food, wifi_rating, quiet_rating } = req.body;
  const userId = req.user.userId;

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
    res.status(500).json({ message: "Failed to submit the spot" });
  } finally {
    client.release();
  }
};


const getPendingVenues = async (req, res) => {
  const client = await pool.connect();
  try {
    // Получаем все места, которые еще не одобрены и не удалены
    const result = await client.query('SELECT * FROM spots WHERE is_approved = FALSE AND is_deleted = FALSE ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get pending venues error:", error);
    res.status(500).json({ message: "Failed to fetch pending venues" });
  } finally {
    client.release();
  }
};

const approveVenue = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const query = `UPDATE spots SET is_approved = TRUE WHERE id = $1 RETURNING id, name, is_approved`;
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: "Venue not found" });
    res.status(200).json({ message: "Venue approved successfully", venue: result.rows[0] });
  } catch (error) {
    console.error("Approve venue error:", error);
    res.status(500).json({ message: "Failed to approve venue" });
  } finally {
    client.release();
  }
};

const rejectVenue = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    // Делаем мягкое удаление
    const query = `UPDATE spots SET is_deleted = TRUE WHERE id = $1 RETURNING id`;
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: "Venue not found" });
    res.status(200).json({ message: "Venue rejected and deleted successfully" });
  } catch (error) {
    console.error("Reject venue error:", error);
    res.status(500).json({ message: "Failed to reject venue" });
  } finally {
    client.release();
  }
};

module.exports = {
  getByDistrict,
  getVenueById,
  searchVenues,
  suggestVenue,
  getPendingVenues, 
  approveVenue,
  rejectVenue
};