import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. MEMORY CHECK: If we already have a token, we are authorized!
    const savedToken = localStorage.getItem('app_token');
    if (savedToken) {
      setIsLoggedIn(true);
    }

    // Fetch venue data
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

  // 🔥 LOGIN AND TOKEN EXCHANGE FUNCTION 🔥
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Received token from Google, sending to backend...");
    
    try {
      // Send Google token to your backend
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await res.json();

      if (res.ok) {
        // Backend recognized us and issued ITS token! Saving it.
        localStorage.setItem('app_token', data.token); // Save permanently (until logout)
        setIsLoggedIn(true); // Remove overlay
        console.log("Successful backend authorization!");
      } else {
        alert("Server authorization error: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Backend connection error:", err);
    }
  };

  // 🔥 SUBMIT REVIEW TO DATABASE FUNCTION 🔥
  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return; 
    setIsSubmitting(true);

    try {
      // Get OUR token from memory
      const token = localStorage.getItem('app_token');

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token to backend
        },
        body: JSON.stringify({
          spot_id: parseInt(id),
          rating: rating,
          comment: reviewText
        })
      });

      if (response.ok) {
        alert('Review added successfully!');
        setReviewText(""); 
        window.location.reload(); // Reload to see the review
      } else {
        const errorData = await response.json();
        alert(`Failed to add review: ${errorData.error || 'Unauthorized'}`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Server connection error.');
    } finally {
      setIsSubmitting(false);
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

        {/* REVIEWS SECTION */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Student Reviews</h2>
            
            <div className="space-y-4 mb-8">
              {venue.reviews && venue.reviews.length > 0 ? (
                venue.reviews.map(review => (
                  <div key={review.id} className="p-6 bg-[#FCFBF7] rounded-3xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-900">{review.username}</span>
                      <span className="text-orange-400 text-lg font-bold">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} {review.rating}.0
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-[#FCFBF7] rounded-3xl text-center border border-gray-100">
                    <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-8">
                <h3 className="text-2xl font-serif font-bold mb-2">Leave a Review</h3>
                
                <div className="relative">
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-gray-200">
                      <p className="text-gray-900 font-bold mb-4">Sign in to leave a review</p>
                      <GoogleLogin 
                        onSuccess={handleGoogleSuccess} 
                        onError={() => console.log("Login Failed")}
                        theme="filled_blue"
                        shape="pill"
                      />
                    </div>
                  )}
                  
                  <div className={`mb-4 flex items-center gap-2 ${!isLoggedIn && 'opacity-50'}`}>
                    <span className="font-bold text-gray-700">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          disabled={!isLoggedIn}
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-colors ${rating >= star ? 'text-orange-400' : 'text-gray-300 hover:text-orange-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    disabled={!isLoggedIn} 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-700 outline-none resize-none ${!isLoggedIn ? 'opacity-50' : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`} 
                    rows="4" 
                    placeholder="Write your review here..."
                  />
                  <button 
                    disabled={!isLoggedIn || isSubmitting} 
                    onClick={handleSubmitReview}
                    className={`mt-4 px-8 py-3 rounded-xl font-bold w-full md:w-auto transition-all ${isLoggedIn ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' : 'bg-gray-300 text-gray-500'}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}