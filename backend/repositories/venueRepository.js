const pool = require("../config/db");

// ==============================
// GET venues by district
// ==============================
async function getVenuesByDistrictId(districtId) {
  const query = `
    SELECT 
      s.id,
      s.name,
      s.description,
      s.image_url,
      s.wifi_rating,
      s.quiet_rating,
      s.latitude,
      s.longitude
    FROM spots s
    WHERE s.district_id = $1
      AND s.is_deleted = FALSE
      AND s.is_approved = TRUE
  `;

  const result = await pool.query(query, [districtId]);
  return result.rows;
}

// ==============================
// GET single venue + reviews
// ==============================
async function getVenueById(id) {

  const venueQuery = `
    SELECT 
      s.id,
      s.name,
      s.description,
      s.image_url,
      s.wifi_rating,
      s.quiet_rating,
      s.latitude,
      s.longitude
    FROM spots s
    WHERE s.id = $1
      AND s.is_deleted = FALSE
      AND s.is_approved = TRUE
  `;

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
    ORDER BY r.created_at DESC
  `;

  const venueResult = await pool.query(venueQuery, [id]);
  const reviewResult = await pool.query(reviewQuery, [id]);

  return {
    venue: venueResult.rows[0],
    reviews: reviewResult.rows
  };
}

// ==============================
// SEARCH venues by name
// ==============================
async function searchVenuesByName(name) {
  const query = `
    SELECT 
      s.id,
      s.name,
      s.description,
      s.image_url,
      s.wifi_rating,
      s.quiet_rating,
      s.latitude,
      s.longitude
    FROM spots s
    WHERE s.name ILIKE $1
      AND s.is_deleted = FALSE
      AND s.is_approved = TRUE
  `;

  const result = await pool.query(query, [`%${name}%`]);
  return result.rows;
}

// ==============================
// GET reviews for a spot (extra helper)
// ==============================
async function getReviewsBySpotId(spotId) {
  const query = `
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
    ORDER BY r.created_at DESC
  `;

  const result = await pool.query(query, [spotId]);
  return result.rows;
}

module.exports = {
  getVenuesByDistrictId,
  getVenueById,
  searchVenuesByName,
  getReviewsBySpotId
};