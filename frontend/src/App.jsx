import React, { useState } from 'react';

// --- ДАННЫЕ ИЗ ТВОЕЙ БАЗЫ ---
const spotsFromDB = [
  { id: 1, name: 'Milli Kütüphane (National Library)', district: 'Çankaya', wifi: 4, quiet: 5, outlet: true, food: false, img: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2000' },
  { id: 2, name: 'Adnan Ötüken İl Halk Kütüphanesi', district: 'Çankaya', wifi: 3, quiet: 5, outlet: true, food: false, img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070' },
  { id: 3, name: 'Coffee Lab (Bahçelievler 7.Cadde)', district: 'Çankaya', wifi: 5, quiet: 2, outlet: true, food: true, img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047' },
  { id: 5, name: 'Cumhurbaşkanlığı Millet Kütüphanesi', district: 'Yenimahalle', wifi: 5, quiet: 5, outlet: true, food: true, img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000' },
  { id: 7, name: 'Arabica Coffee House (Gölbaşı)', district: 'Gölbaşı', wifi: 4, quiet: 3, outlet: true, food: true, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070' }
];

const districtsData = [
  { id: 1, name: 'Çankaya', img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070' },
  { id: 3, name: 'Keçiören', img: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1000' },
  { id: 2, name: 'Yenimahalle', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000' },
  { id: 6, name: 'Altındağ', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000' }
];

// --- ВСПОМОГАТЕЛЬНЫЙ КОМПОНЕНТ КАРТОЧКИ ---
const VenueCard = ({ spot }) => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="relative h-72 overflow-hidden">
      <img src={spot.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={spot.name} />
      <div className="absolute bottom-4 left-5 flex gap-2">
        {spot.outlet && <div className="bg-white/90 p-2 rounded-xl shadow-sm">🔌</div>}
        {spot.food && <div className="bg-white/90 p-2 rounded-xl shadow-sm">☕</div>}
      </div>
    </div>
    <div className="p-8">
      <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1 leading-tight">{spot.name}</h3>
      <p className="text-gray-400 text-sm mb-5 italic">{spot.district}</p>
      <div className="space-y-3 font-sans">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-sm text-gray-500">
          <span>📶 Wi-Fi</span>
          <span className="text-orange-400 font-bold">{"★".repeat(spot.wifi)}{"☆".repeat(5-spot.wifi)} {spot.wifi}.0</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>🔊 Quiet</span>
          <span className="text-orange-400 font-bold">{"★".repeat(spot.quiet)}{"☆".repeat(5-spot.quiet)} {spot.quiet}.0</span>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Название района
  const [districtVenues, setDistrictVenues] = useState([]);       // Данные из API
  const [isLoading, setIsLoading] = useState(false);              // Статус загрузки

  // --- ЛОГИКА SPRINT 2: ОБРАБОТКА КЛИКА И ЗАПРОС К API ---
  const handleDistrictClick = async (district) => {
    setIsLoading(true);
    setSelectedDistrict(district.name);

    try {
      // Имитация вызова API Рои (GET /api/venues/district/{id})
      // Когда бэкенд будет готов, раскомментируй строку ниже:
      // const response = await fetch(`http://localhost:8080/api/venues/district/${district.id}`);
      // const data = await response.json();
      // setDistrictVenues(data);

      // Временная заглушка: фильтруем локально
      setTimeout(() => {
        const filtered = spotsFromDB.filter(s => s.district === district.name);
        setDistrictVenues(filtered);
        setIsLoading(false);
      }, 800); 
    } catch (error) {
      console.error("Ошибка API:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] font-sans selection:bg-emerald-100">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 transition-all ${selectedDistrict ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedDistrict(null)}>
          <div className="text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" /></svg>
          </div>
          <span className={`font-serif text-2xl font-bold tracking-tight ${selectedDistrict ? 'text-gray-900' : 'text-white'}`}>Ankara Study Map</span>
        </div>
        {selectedDistrict && (
          <button onClick={() => setSelectedDistrict(null)} className="text-emerald-600 font-bold hover:underline">
            ← Back Home
          </button>
        )}
      </nav>

      {!selectedDistrict ? (
        /* --- ЭКРАН 1: HOME PAGE --- */
        <>
          <header className="relative h-[600px] flex items-center justify-center px-6 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 w-full max-w-4xl text-center text-white">
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">Find your perfect study spot in Ankara</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Discover cafes, libraries, and coworking spaces rated by students for Wi-Fi, quiet levels, and amenities.
              </p>
              <div className="relative max-w-2xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  className="w-full px-10 py-6 rounded-[2.5rem] bg-white text-gray-800 text-lg shadow-2xl outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-8 py-20 text-left">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2 italic">Popular Study Spots</h2>
            <p className="text-gray-400 mb-10 font-sans">{spotsFromDB.length} spots found</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {spotsFromDB.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(spot => (
                <VenueCard key={spot.id} spot={spot} />
              ))}
            </div>
          </main>

          <section className="max-w-7xl mx-auto px-8 py-20 bg-[#F9F7F2] rounded-[3rem] mb-20 text-left">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2">Explore by District</h2>
            <p className="text-gray-500 mb-10">Browse study spots by Ankara's neighborhoods.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {districtsData.map(d => (
                <div key={d.name} onClick={() => handleDistrictClick(d)} className="relative h-64 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-md transition-transform active:scale-95">
                  <img src={d.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                    <h3 className="text-3xl font-serif font-bold">{d.name}</h3>
                    <p className="text-sm opacity-90 tracking-widest uppercase mt-2">View {d.count} spots</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* --- ЭКРАН 2: DISTRICT RESULTS (SPRINT 2) --- */
        <main className="max-w-7xl mx-auto px-8 pt-32 pb-20 text-left min-h-screen">
          <h2 className="font-serif text-5xl font-bold text-gray-900 mb-2 italic tracking-tight">Spots in {selectedDistrict}</h2>
          <p className="text-gray-400 mb-12 font-sans">Handpicked locations for productive sessions.</p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p className="font-serif text-xl italic text-gray-600 animate-pulse">Consulting the local experts...</p>
            </div>
          ) : districtVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {districtVenues.map(spot => (
                <VenueCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
              <p className="font-serif text-2xl text-gray-400 italic">No spots found in {selectedDistrict} yet.</p>
            </div>
          )}
        </main>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-20 flex flex-col items-center justify-center border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" /></svg>
          </div>
          <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">Ankara Study Map</span>
        </div>
        <p className="text-gray-500 italic font-light">Helping Ankara students find their focus since 2026.</p>
      </footer>
    </div>
  );
}