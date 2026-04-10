import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ReviewSection({ venueId, reviews, isLoggedIn, currentUserId }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5); 
  //  НОВОЕ СОСТОЯНИЕ: Для красивого эффекта наведения (hover) 
  const [hoverRating, setHoverRating] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // УДАЛЕНИЕ ОТЗЫВА
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('app_token');

      const response = await fetch(`https://ankara-study-map.onrender.com/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        alert('Review deleted successfully!');
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        alert(`Failed to delete review: ${errorData.error || 'Unauthorized'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server connection error.');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return; 
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('app_token');

      const response = await fetch('https://ankara-study-map.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          spot_id: parseInt(venueId),
          rating: rating,
          comment: reviewText
        })
      });

      if (response.ok) {
        alert('Review added successfully!');
        setReviewText(""); 
        window.location.reload(); 
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

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Student Reviews</h2>
        
        <div className="space-y-4 mb-8">
          {reviews && reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="p-6 bg-[#FCFBF7] rounded-3xl border border-gray-100 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900">{review.username}</span>
                  <span className="text-orange-400 text-lg font-bold">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} {review.rating}.0
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                {/* КНОПКА УДАЛЕНИЯ (Показываем только владельцу отзыва) */}
                {currentUserId && currentUserId === review.user_id && (
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="absolute bottom-6 right-6 text-sm text-red-400 hover:text-red-600 font-bold transition-colors"
                  >
                    Delete
                  </button>
                )}
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
            
            <div className="relative mt-6">
              {!isLoggedIn && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-gray-200">
                  <p className="text-gray-900 font-bold mb-4">Sign in to leave a review</p>
                  <Link 
                    to="/login"
                    className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-md"
                  >
                    Log In
                  </Link>
                </div>
              )}
              
              <div className={`mb-4 flex items-center gap-2 ${!isLoggedIn && 'opacity-50'}`}>
                <span className="font-bold text-gray-700">Rating:</span>
                <div className="flex gap-1">
                  {/*  ИНТЕРАКТИВНЫЕ ЗВЕЗДЫ  */}
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      type="button"
                      key={star} 
                      disabled={!isLoggedIn}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => isLoggedIn && setHoverRating(star)}
                      onMouseLeave={() => isLoggedIn && setHoverRating(0)}
                      className={`text-3xl transition-colors cursor-pointer ${
                        star <= (hoverRating || rating) ? 'text-orange-400' : 'text-gray-200'
                      }`}
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
  );
}