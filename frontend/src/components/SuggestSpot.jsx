import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SuggestSpot() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [districtId, setDistrictId] = useState('1'); // По умолчанию Çankaya
  const [address, setAddress] = useState('');
  const [hasOutlets, setHasOutlets] = useState(false);
  const [hasFood, setHasFood] = useState(false);
  const [wifiRating, setWifiRating] = useState(5);
  const [quietRating, setQuietRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Защита маршрута: пускаем только авторизованных
  useEffect(() => {
    const token = localStorage.getItem('app_token');
    if (!token) {
      alert("Please log in to suggest a new spot!");
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('app_token');
      const res = await fetch('http://localhost:5000/api/venues', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
       body: JSON.stringify({
          name: name,
          district_id: parseInt(districtId),
          address: address,
          outlet_availability: hasOutlets,
          has_food: hasFood,
          wifi_rating: parseInt(wifiRating),   // ДОБАВИЛИ parseInt
          quiet_rating: parseInt(quietRating)  // ДОБАВИЛИ parseInt
        })
      });

      if (res.ok) {
        // Уведомление об успехе (как прописано в Спринте 4)
        alert("Thank you! Your spot is pending admin approval. 🚀");
        navigate('/'); 
      } else {
        const data = await res.json();
        alert("Failed to submit: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-20 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-emerald-600 font-bold hover:underline mb-8 inline-block">
          ← Back to Map
        </Link>
        
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Suggest a Spot</h1>
          <p className="text-gray-500 mb-8">Know a great place to study? Fill out the details below and we'll review it!</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Venue Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" placeholder="e.g. Starbucks Tunalı" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">District</label>
              <select value={districtId} onChange={e => setDistrictId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                <option value="1">Çankaya</option>
                <option value="2">Yenimahalle</option>
                <option value="3">Keçiören</option>
                <option value="4">Gölbaşı</option>
                <option value="5">Etimesgut</option>
                <option value="6">Altındağ</option>
                <option value="7">Mamak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
              <textarea required value={address} onChange={e => setAddress(e.target.value)} rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" placeholder="Enter the full street address..." />
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasOutlets} onChange={e => setHasOutlets(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                <span className="font-bold text-gray-700">Has Outlets 🔌</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasFood} onChange={e => setHasFood(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                <span className="font-bold text-gray-700">Has Food/Coffee ☕</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">Wi-Fi Quality: {wifiRating}.0</label>
              <input type="range" min="1" max="5" value={wifiRating} onChange={e => setWifiRating(e.target.value)} className="w-full accent-emerald-600" />
            </div>

            <div className="pb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Quietness: {quietRating}.0</label>
              <input type="range" min="1" max="5" value={quietRating} onChange={e => setQuietRating(e.target.value)} className="w-full accent-emerald-600" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-md">
              {isSubmitting ? 'Submitting...' : 'SUBMIT FOR REVIEW'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}