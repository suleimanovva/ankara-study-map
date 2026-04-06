import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from './ReviewSection';

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // 🔥 NEW

  // ==============================
  // DECODE TOKEN
  // ==============================
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      return null;
    }
  };

  // ==============================
  // LOAD DATA + AUTH
  // ==============================
  useEffect(() => {
    const savedToken = localStorage.getItem('token'); // ✅ FIXED

    if (savedToken) {
      const decoded = decodeToken(savedToken);

      setIsLoggedIn(true);
      setCurrentUserId(decoded.userId);

      if (decoded.role === "admin") {
        setIsAdmin(true);
      }
    }

    fetch(`http://localhost:5000/api/venues/${id}`)
      .then(res => res.json())
      .then(data => {
        const currentVenue = Array.isArray(data) ? data[0] : data;
        setVenue(currentVenue);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  // ==============================
  // DELETE SPOT (ADMIN ONLY)
  // ==============================
  const deleteSpot = async () => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm("Are you sure you want to delete this spot?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/venues/admin/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        alert("Spot deleted 🗑️");
        window.location.href = "/"; // go back
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error");
    }
  };

  // ==============================
  // LOADING STATES
  // ==============================
  if (loading) return <div className="pt-40 text-center text-2xl font-serif text-gray-500">Loading details...</div>;
  if (!venue) return <div className="pt-40 text-center text-2xl font-serif text-red-500">Venue not found :(</div>;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FCFBF7]">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link to="/" className="text-emerald-600 font-bold hover:underline mb-6 inline-block text-lg">
          ← Back to list
        </Link>

        {/* IMAGE */}
        <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-lg mb-8 bg-gray-200">
          {venue.image_url ? (
            <img src={venue.image_url} className="w-full h-full object-cover" alt={venue.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No photo available</div>
          )}
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            {venue.name}
          </h1>

          {/* 🔥 DELETE BUTTON (ADMIN ONLY) */}
          {isAdmin && (
            <button
              onClick={deleteSpot}
              className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors"
            >
              Delete Spot 🗑️
            </button>
          )}

          <p className="text-gray-500 text-lg mb-6">📍 {venue.address}</p>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            {venue.description || 'Description not available.'}
          </p>

          {venue.google_maps_link && (
            <a
              href={venue.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-8 py-4 rounded-full font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              🗺️ Open in Google Maps
            </a>
          )}
        </div>

        {/* RATINGS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2rem] text-center">
            📶 Wi-Fi: {venue.wifi_rating || 0}
          </div>
          <div className="bg-white p-6 rounded-[2rem] text-center">
            🔊 Quiet: {venue.quiet_rating || 0}
          </div>
          <div className="bg-white p-6 rounded-[2rem] text-center">
            🔌 {venue.outlet_availability ? 'Yes' : 'No'}
          </div>
          <div className="bg-white p-6 rounded-[2rem] text-center">
            ☕ {venue.has_food ? 'Yes' : 'No'}
          </div>
        </div>

        {/* REVIEWS */}
        <ReviewSection
          venueId={id}
          reviews={venue.reviews}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}