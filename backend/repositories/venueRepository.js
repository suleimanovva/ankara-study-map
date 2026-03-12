const pool = require("../config/db");

async function getVenuesByDistrictId(districtId) {
  const reviewQuery = `
  SELECT 
    r.id,
    r.user_id,
    r.rating,
    r.comment,
    u.username
  FROM reviews r
  JOIN users u ON r.user_id = u.id
  WHERE r.spot_id = $1
    AND r.is_deleted = FALSE
`;

  const result = await pool.query(query, [districtId]);
  return result.rows;
}

async function getVenueById(id) {

  const venueQuery = `
    SELECT id, name, description, image_url,
           wifi_rating, quiet_rating,
           latitude, longitude
    FROM spots
    WHERE id = $1
      AND is_deleted = FALSE
      AND is_approved = TRUE
  `;

  const reviewQuery = `
    SELECT r.rating, r.comment, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.spot_id = $1
      AND r.is_deleted = FALSE
  `;

  const venue = await pool.query(venueQuery, [id]);
  const reviews = await pool.query(reviewQuery, [id]);

  return {
    venue: venue.rows[0],
    reviews: reviews.rows
  };
}

async function searchVenuesByName(name) {

  const query = `
    SELECT id, name, description, image_url,
           wifi_rating, quiet_rating,
           latitude, longitude
    FROM spots
    WHERE name ILIKE $1
      AND is_deleted = FALSE
      AND is_approved = TRUE
  `;

  const result = await pool.query(query, [`%${name}%`]);

  return result.rows;
}

module.exports = {
  getVenuesByDistrictId,
  getVenueById,
  searchVenuesByName
};