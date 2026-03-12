import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from './ReviewSection'; // 🔥 ИМПОРТИРУЕМ НАШ НОВЫЙ КОМПОНЕНТ 🔥

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); 

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('app_token');
    if (savedToken) {
      setIsLoggedIn(true);
      setCurrentUserId(decodeToken(savedToken)); 
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('app_token', data.token);
        setIsLoggedIn(true);
        setCurrentUserId(decodeToken(data.token));
      } else {
        alert("Server authorization error: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Backend connection error:", err);
    }
  };

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

        {/* DESCRIPTION & MAPS */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{venue.name}</h1>
          <p className="text-gray-500 text-lg mb-6">📍 {venue.address}</p>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{venue.description || 'Description not available.'}</p>
          
          {venue.google_maps_link && (
            <a href={venue.google_maps_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-8 py-4 rounded-full font-bold hover:bg-emerald-600 hover:text-white transition-all">
              <span>🗺️</span> Open in Google Maps
            </a>
          )}
        </div>

        {/* RATING ICONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-2">📶</div>
                <div className="font-bold text-gray-900 mb-1">Wi-Fi</div>
                <div className="text-orange-400 text-lg font-bold">
                  {"★".repeat(venue.wifi_rating || 0)}{"☆".repeat(5 - (venue.wifi_rating || 0))} {venue.wifi_rating || 0}.0
                </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-2">🔊</div>
                <div className="font-bold text-gray-900 mb-1">Quietness</div>
                <div className="text-orange-400 text-lg font-bold">
                  {"★".repeat(venue.quiet_rating || 0)}{"☆".repeat(5 - (venue.quiet_rating || 0))} {venue.quiet_rating || 0}.0
                </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-2">🔌</div>
                <div className="font-bold text-gray-900 mb-1">Outlets</div>
                <div className="text-emerald-600 font-bold">{venue.outlet_availability ? 'Yes' : 'No'}</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-2">☕</div>
                <div className="font-bold text-gray-900 mb-1">Food/Coffee</div>
                <div className="text-emerald-600 font-bold">{venue.has_food ? 'Yes' : 'No'}</div>
            </div>
        </div>

        {/* 🔥 ВЫЗЫВАЕМ НАШ НОВЫЙ КОМПОНЕНТ ОТЗЫВОВ 🔥 */}
        <ReviewSection 
          venueId={id} 
          reviews={venue.reviews} 
          isLoggedIn={isLoggedIn} 
          currentUserId={currentUserId}
          onGoogleSuccess={handleGoogleSuccess}
        />

      </div>
    </div>
  );
}