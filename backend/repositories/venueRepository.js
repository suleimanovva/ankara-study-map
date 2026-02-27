const pool = require("../config/db");

async function getVenuesByDistrictId(districtId) {
  const query = `
    SELECT id, name, latitude, longitude, wifi_rating, quiet_rating
    FROM spots
    WHERE district_id = $1
      AND is_approved = TRUE
      AND is_deleted = FALSE
  `;

  const result = await pool.query(query, [districtId]);
  return result.rows;
}

module.exports = {
  getVenuesByDistrictId
};