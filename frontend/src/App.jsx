import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import VenueDetails from './components/venueDetails'; 

const districtsData = [
  { id: 1, name: 'Çankaya', count: 5, img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070' },
  { id: 2, name: 'Yenimahalle', count: 4, img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000' },
  { id: 3, name: 'Keçiören', count: 3, img: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1000' },
  { id: 4, name: 'Gölbaşı', count: 3, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000' },
  { id: 5, name: 'Etimesgut', count: 3, img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1000' },
  { id: 6, name: 'Altındağ', count: 1, img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000' },
  { id: 7, name: 'Mamak', count: 1, img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070' }
];

const VenueCard = ({ spot }) => {
  const districtName = districtsData.find(d => d.id === spot.district_id)?.name || 'Ankara';

  return (
    <Link to={`/venue/${spot.id}`} className="block group">
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative h-72 overflow-hidden">
          <img src={spot.image_url || '/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={spot.name} />
          <div className="absolute bottom-4 left-5 flex gap-2">
            {spot.outlet_availability && <div className="bg-white/90 p-2 rounded-xl shadow-sm text-lg">🔌</div>}
            {spot.has_food && <div className="bg-white/90 p-2 rounded-xl shadow-sm text-lg">☕</div>}
          </div>
        </div>
        <div className="p-8">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1 leading-tight">{spot.name}</h3>
          <p className="text-gray-400 text-sm mb-3 italic">{districtName}</p>
          <div className="space-y-3 font-sans mb-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-sm text-gray-500">
              <span>📶 Wi-Fi</span>
              <span className="text-orange-400 font-bold">{"★".repeat(spot.wifi_rating || 0)}{"☆".repeat(5-(spot.wifi_rating || 0))} {spot.wifi_rating || 0}.0</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>🔊 Quietness</span>
              <span className="text-orange-400 font-bold">{"★".repeat(spot.quiet_rating || 0)}{"☆".repeat(5-(spot.quiet_rating || 0))} {spot.quiet_rating || 0}.0</span>
            </div>
          </div>
          <div className="block text-center bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold group-hover:bg-emerald-100 transition">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

// ВНИМАНИЕ: Навбар с кнопкой Google теперь живет ТОЛЬКО внутри HomePage
const HomePage = ({ spots, search, setSearch, handleDistrictClick, selectedDistrict, setSelectedDistrict, districtVenues, isLoading }) => (
  <>
    {/* ПОМЕНЯЛИ fixed НА absolute */}
    <nav className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 transition-all ${selectedDistrict ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <Link to="/" onClick={() => setSelectedDistrict(null)} className="flex items-center gap-2 cursor-pointer">
        <div className="text-emerald-500 text-3xl">📍</div>
        <span className={`font-serif text-2xl font-bold tracking-tight ${selectedDistrict ? 'text-gray-900' : 'text-white'}`}>Ankara Study Map</span>
      </Link>
      <div className="flex items-center gap-6">
        <div className="min-w-[150px]">
          <GoogleLogin 
            onSuccess={res => console.log("Success", res)} 
            onError={() => console.log("Failed")}
            theme="filled_blue"
            shape="pill"
          />
        </div>
        {selectedDistrict && (
          <button onClick={() => setSelectedDistrict(null)} className="text-emerald-600 font-bold hover:underline">← Back Home</button>
        )}
      </div>
    </nav>

    {!selectedDistrict ? (
      <>
        <header className="relative h-[600px] flex items-center justify-center px-6 overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 w-full max-w-4xl text-white pt-10">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">Find your perfect study spot in Ankara</h1>
            <div className="relative max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Search by name..." 
                className="w-full px-10 py-6 rounded-[2.5rem] bg-white text-gray-800 text-lg shadow-2xl outline-none focus:ring-4 focus:ring-emerald-500/20"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-20">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2 italic text-left">Popular Study Spots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
            {spots.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6).map(spot => (
              <VenueCard key={spot.id} spot={spot} />
            ))}
          </div>
        </main>

        <section className="max-w-7xl mx-auto px-8 py-20 bg-[#F9F7F2] rounded-[3rem] mb-20">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-10 text-left">Explore by District</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {districtsData.map(d => (
              <div key={d.id} onClick={() => handleDistrictClick(d)} className="relative h-64 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-md transition-transform active:scale-95">
                <img src={d.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                  <h3 className="text-3xl font-serif font-bold">{d.name}</h3>
                  <p className="text-sm opacity-90 tracking-widest uppercase mt-2">Explore {d.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    ) : (
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-20 min-h-screen">
        <h2 className="font-serif text-5xl font-bold text-gray-900 mb-10 italic text-left">Spots in {selectedDistrict}</h2>
        {isLoading ? (
          <div className="text-center py-20 italic">Finding the best focus zones...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {districtVenues.length > 0 ? (
               districtVenues.map(spot => <VenueCard key={spot.id} spot={spot} />)
            ) : (
               <p className="text-gray-500 text-xl">Здесь пока нет добавленных мест.</p>
            )}
          </div>
        )}
      </main>
    )}
  </>
);

export default function App() {
  const [spots, setSpots] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtVenues, setDistrictVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/venues') 
      .then(res => res.json())
      .then(data => {
        setSpots(data);
      })
      .catch(err => console.error("Ошибка загрузки:", err));
  }, []);

  const handleDistrictClick = (district) => {
    setIsLoading(true);
    setSelectedDistrict(district.name);
    setTimeout(() => {
      const filtered = spots.filter(s => s.district_id === district.id);
      setDistrictVenues(filtered);
      setIsLoading(false);
    }, 400);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FCFBF7] font-sans selection:bg-emerald-100 relative">
        <Routes>
          <Route path="/" element={
            <HomePage 
              spots={spots}
              search={search} setSearch={setSearch} 
              handleDistrictClick={handleDistrictClick} 
              selectedDistrict={selectedDistrict} 
              setSelectedDistrict={setSelectedDistrict}
              districtVenues={districtVenues}
              isLoading={isLoading}
            />
          } />
          <Route path="/venue/:id" element={<VenueDetails />} /> 
        </Routes>

        <footer className="py-20 flex flex-col items-center justify-center border-t border-gray-100 bg-white mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-3xl">📍</span>
            <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">Ankara Study Map</span>
          </div>
          <p className="text-gray-500 italic font-light">Helping Ankara students find their focus since 2026.</p>
        </footer>
      </div>
    </Router>
  );
}