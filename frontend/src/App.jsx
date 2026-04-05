import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VenueDetails from './components/venueDetails'; 
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import SuggestSpot from './components/SuggestSpot';
import AdminPage from './components/AdminPage';

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
            {spot.outlet_availability && <div className="bg-white/90 p-2 rounded-xl shadow-sm text-lg" title="Has Outlets">🔌</div>}
            {spot.has_food && <div className="bg-white/90 p-2 rounded-xl shadow-sm text-lg" title="Has Food/Coffee">☕</div>}
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

const HomePage = ({ 
  spots, search, setSearch, handleDistrictClick, selectedDistrict, setSelectedDistrict, 
  districtVenues, isLoading, isLoggedIn, handleLogout, 
  filterOutlets, setFilterOutlets, filterFood, setFilterFood 
}) => {

  // Изменили фильтрацию: теперь React проверяет только розетки и еду, 
  // а поиск по тексту делает бэкенд Роа!
  const filteredPopularSpots = spots.filter(spot => {
    const matchOutlets = filterOutlets ? spot.outlet_availability === true : true;
    const matchFood = filterFood ? spot.has_food === true : true;
    return matchOutlets && matchFood;
  });

  const filteredDistrictSpots = districtVenues.filter(spot => {
    const matchOutlets = filterOutlets ? spot.outlet_availability === true : true;
    const matchFood = filterFood ? spot.has_food === true : true;
    return matchOutlets && matchFood;
  });

  return (
    <>
      <nav className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 transition-all ${selectedDistrict ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <Link to="/" onClick={() => setSelectedDistrict(null)} className="flex items-center gap-2 cursor-pointer">
          <div className="text-emerald-500 text-3xl">📍</div>
          <span className={`font-serif text-2xl font-bold tracking-tight ${selectedDistrict ? 'text-gray-900' : 'text-white'}`}>Ankara Study Map</span>
        </Link>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/suggest" className={`font-bold px-6 py-2 rounded-full transition-all ${selectedDistrict ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                + Suggest a Spot
              </Link>
              <button onClick={handleLogout} className={`font-bold px-6 py-2 rounded-full border transition-all ${selectedDistrict ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-white/30 text-white hover:bg-white/10'}`}>
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className={`font-bold px-8 py-2.5 rounded-full transition-all shadow-md ${selectedDistrict ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
              Log In
            </Link>
          )}
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
            {/* 🔥 ПРОФЕССИОНАЛЬНАЯ ПАНЕЛЬ ФИЛЬТРОВ 🔥 */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
              <h2 className="font-serif text-4xl font-bold text-gray-900 italic text-left">Popular Study Spots</h2>
              
              <div className="flex gap-3">
                <label className={`flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${filterOutlets ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={filterOutlets} onChange={(e) => setFilterOutlets(e.target.checked)} className="hidden" />
                  <span>🔌 Outlets</span>
                </label>
                
                <label className={`flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${filterFood ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={filterFood} onChange={(e) => setFilterFood(e.target.checked)} className="hidden" />
                  <span>☕ Food</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPopularSpots.length > 0 ? (
                filteredPopularSpots.slice(0, 6).map(spot => (
                  <VenueCard key={spot.id} spot={spot} />
                ))
              ) : (
                <p className="text-gray-500 text-xl col-span-3 text-center py-10">No spots match your filters. Try adjusting them!</p>
              )}
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
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <h2 className="font-serif text-5xl font-bold text-gray-900 italic text-left">Spots in {selectedDistrict}</h2>
            
            <div className="flex gap-3">
              <label className={`flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${filterOutlets ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <input type="checkbox" checked={filterOutlets} onChange={(e) => setFilterOutlets(e.target.checked)} className="hidden" />
                <span>🔌 Outlets</span>
              </label>
              
              <label className={`flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${filterFood ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <input type="checkbox" checked={filterFood} onChange={(e) => setFilterFood(e.target.checked)} className="hidden" />
                <span>☕ Food</span>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 italic">Finding the best focus zones...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredDistrictSpots.length > 0 ? (
                 filteredDistrictSpots.map(spot => <VenueCard key={spot.id} spot={spot} />)
              ) : (
                 <p className="text-gray-500 text-xl col-span-3 text-center py-10">No spots found matching your criteria in this district.</p>
              )}
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default function App() {
  const [spots, setSpots] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtVenues, setDistrictVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [filterOutlets, setFilterOutlets] = useState(false);
  const [filterFood, setFilterFood] = useState(false);

  // 1. useEffect только для проверки логина при загрузке
  useEffect(() => {
    const token = localStorage.getItem('app_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 2. 🔥 НОВЫЙ useEffect ДЛЯ УМНОГО ПОИСКА (Debounce) 🔥
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        // Если поиск пустой - грузим все кафе, если нет - используем маршрут Роа
        const url = search.trim() === '' 
          ? 'http://localhost:5000/api/venues' 
          : `http://localhost:5000/api/venues/search?q=${search}`;

        const res = await fetch(url);
        
        if (res.ok) {
          const data = await res.json();
          setSpots(data);
        }
      } catch (err) {
        console.error("Ошибка загрузки кафе:", err);
      }
    };

    // Ждем 500мс после того, как пользователь закончил печатать
    const delayDebounceFn = setTimeout(() => {
      fetchSpots();
    }, 500);

    // Очищаем таймер, если пользователь снова начал печатать
    return () => clearTimeout(delayDebounceFn);
  }, [search]); 

  const handleDistrictClick = (district) => {
    setIsLoading(true);
    setSelectedDistrict(district.name);
    setTimeout(() => {
      const filtered = spots.filter(s => s.district_id === district.id);
      setDistrictVenues(filtered);
      setIsLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    localStorage.removeItem('app_token');
    setIsLoggedIn(false);
    window.location.reload();
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
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              filterOutlets={filterOutlets}
              setFilterOutlets={setFilterOutlets}
              filterFood={filterFood}
              setFilterFood={setFilterFood}
            />
          } />
          <Route path="/venue/:id" element={<VenueDetails />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/suggest" element={<SuggestSpot />} />
          <Route path="/admin" element={<AdminPage />} />
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