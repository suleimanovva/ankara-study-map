import React, { useState } from 'react';

// --- ТВОЯ ОБНОВЛЕННАЯ БАЗА ДАННЫХ (20 МЕСТ) ---
const spotsFromDB = [
{ id: 1, name: 'Milli Kütüphane (National Library)', district: 'Çankaya', address: 'Bahçelievler, İsmet İnönü Blv.', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Milli+Kutuphane+Ankara', latitude: 39.91842, longitude: 32.82864, wifi: 4, quiet: 5, outlet: true, food: false, img: '/spots/milliKut.jpg'},
  { id: 2, name: 'Coffee Lab (7. Cadde)', district: 'Çankaya', address: 'Bahçelievler, Aşkabat Cd. No:23', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Coffee+Lab+7.Cadde+Ankara', latitude: 39.92201, longitude: 32.82553, wifi: 5, quiet: 3, outlet: true, food: true, img: '/spots/CoffeeLabCankaya.jpg' },
  { id: 3, name: 'EspressoLab (Tunalı)', district: 'Çankaya', address: 'Kavaklıdere, Tunalı Hilmi Cd.', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=EspressoLab+Tunali+Ankara', latitude: 39.90251, longitude: 32.85902, wifi: 5, quiet: 3, outlet: true, food: true, img: '/spots/cofeeLabTunali.jpg' },
  { id: 4, name: 'Workinton (Söğütözü)', district: 'Çankaya', address: 'Söğütözü, Koç Kuleleri', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Workinton+Sogutozu+Ankara', latitude: 39.91152, longitude: 32.81084, wifi: 5, quiet: 4, outlet: true, food: true, img: '/spots/workington.jpg' },
  { id: 5, name: 'Federal Coffee Company', district: 'Çankaya', address: 'Kavaklıdere, Tunalı Hilmi Cd.', google_maps_link: 'https://maps.app.goo.gl/P9orF9UhYfrvA6uD8', latitude: 39.90543, longitude: 32.86015, wifi: 4, quiet: 3, outlet: true, food: true, img: '/spots/feder.jpg' },
  
  // YENİMAHALLE
  { id: 6, name: 'Cumhurbaşkanlığı Millet Kütüphanesi', district: 'Yenimahalle', address: 'Cumhurbaşkanlığı Külliyesi', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Cumhurbaskanligi+Millet+Kutuphanesi+Ankara', latitude: 39.93041, longitude: 32.79832, wifi: 5, quiet: 5, outlet: true, food: true, img: '/spots/MilliKutuphane.jpg' },
  { id: 7, name: 'Arabica Coffee House (Batıkent)', district: 'Yenimahalle', address: 'Batıkent Bulvarı', google_maps_link: 'https://maps.app.goo.gl/8X2zWycN1xZGm5ao8', latitude: 39.96551, longitude: 32.73105, wifi: 4, quiet: 3, outlet: true, food: true, img: '/spots/arabicaBatikent.jpg' },
  { id: 8, name: 'Starbucks (Atlantis AVM)', district: 'Yenimahalle', address: 'Batıkent, Atlantis AVM', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Starbucks+Atlantis+AVM+Ankara', latitude: 39.95764, longitude: 32.73501, wifi: 4, quiet: 2, outlet: true, food: true, img: '/spots/sturbacks.jpg' },
  { id: 9, name: 'Thila Coffee', district: 'Yenimahalle', address: 'Mehmet Akif Ersoy.', google_maps_link: 'https://share.google/kCmeAEhMcoWhwCmIy', latitude: 39.96412, longitude: 32.72304, wifi: 4, quiet: 3, outlet: true, food: true, img: '/spots/thila.jpg' },

  // KEÇİÖREN
  { id: 10, name: 'Coffee Lab (Keçiören)', district: 'Keçiören', address: 'Aşağı Eğlence Mah.', google_maps_link: 'https://maps.app.goo.gl/72Y4X3VkJX7JdpYb7', latitude: 39.97345, longitude: 32.84652, wifi: 5, quiet: 3, outlet: true, food: true, img: '/spots/cofeeLabKecioren.jpg' },
  { id: 11, name: 'Coffee de Madrid', district: 'Keçiören', address: 'Şenlik Mah.', google_maps_link: 'https://share.google/gOIvsCw58Z4b6Czpo', latitude: 39.9781, longitude: 32.86815, wifi: 3, quiet: 4, outlet: true, food: false, img: '/spots/madrid.jpg' },
  { id: 12, name: 'Mackbear Coffee Co. (Etlik)', district: 'Keçiören', address: 'Etlik Caddesi', google_maps_link: 'https://maps.app.goo.gl/Lb5vLhdJc25hna9XA', latitude: 39.96805, longitude: 32.83506, wifi: 4, quiet: 3, outlet: true, food: true, img: '/spots/macbearEtlik.jpg' },

  // GÖLBAŞI
  { id: 13, name: 'Arabica (Gölbaşı)', district: 'Gölbaşı', address: 'Bahçelievler Mah.', google_maps_link: 'https://maps.app.goo.gl/nV3me8H7V3K29dLx5', latitude: 39.78912, longitude: 32.80234, wifi: 4, quiet: 3, outlet: true, food: true, img: '/spots/arabicagolbasi.jpg' },
  { id: 14, name: 'EspressoLab (Gölbaşı)', district: 'Gölbaşı', address: 'Ankara Üni. Kampüs Yolu', google_maps_link: 'https://maps.app.goo.gl/Qg31mP56Kun3qa9LA', latitude: 39.79105, longitude: 32.80508, wifi: 5, quiet: 3, outlet: true, food: true, img: '/spots/espressoLab.jpg' },
  { id: 15, name: 'Gölbaşı İlçe Kütüphanesi', district: 'Gölbaşı', address: 'Gölbaşı Merkez', google_maps_link: 'https://maps.app.goo.gl/L7QdX3LmHhHdwB13A', latitude: 39.78502, longitude: 32.80501, wifi: 3, quiet: 5, outlet: true, food: false, img: '/spots/golbasiLibrary.jpg' },

  // ETİMESGUT
  { id: 16, name: 'Coffee Lab (Eryaman)', district: 'Etimesgut', address: 'Шехит Осман Авджи Мах.', google_maps_link: 'https://maps.app.goo.gl/vBRvEzWEi4pPkV4u8', latitude: 39.98254, longitude: 32.64152, wifi: 5, quiet: 3, outlet: true, food: true, img: '/spots/coffeeLabEryaman.jpg' },
  { id: 17, name: 'Starbucks (Göksu Parkı)', district: 'Etimesgut', address: 'Eryaman, Göksu', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Starbucks+Goksu+Parki+Ankara', latitude: 39.97851, longitude: 32.63004, wifi: 4, quiet: 2, outlet: true, food: true, img: '/spots/starbacks.jpg' },

  // ALTINDAĞ & MAMAK
  { id: 18, name: 'Altındağ Gençlik Merkezi', district: 'Altındağ', address: 'Karapürçek Mah.', google_maps_link: 'https://maps.app.goo.gl/xf2hesAoECFSzyyaA', latitude: 39.95503, longitude: 32.90506, wifi: 3, quiet: 5, outlet: true, food: false, img: '/spots/GenclikMerkezi.jpg' },
  { id: 19, name: 'Mamak Study Hall', district: 'Mamak', address: 'Şafaktepe Mah.', google_maps_link: 'https://www.google.com/maps/search/?api=1&query=Mamak+Genclik+Merkezi+Ankara', latitude: 39.93802, longitude: 32.90204, wifi: 4, quiet: 4, outlet: true, food: false, img: '/spots/mamakGenclik.jpg' }
];

const districtsData = [
  { id: 1, name: 'Çankaya', count: 5, img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070' },
  { id: 2, name: 'Yenimahalle', count: 4, img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000' },
  { id: 3, name: 'Keçiören', count: 3, img: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1000' },
  { id: 4, name: 'Gölbaşı', count: 3, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000' },
  { id: 5, name: 'Etimesgut', count: 3, img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1000' },
  { id: 6, name: 'Altındağ', count: 1, img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000' }
];

const VenueCard = ({ spot }) => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="relative h-72 overflow-hidden">
      <img src={spot.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={spot.name} />
      <div className="absolute bottom-4 left-5 flex gap-2">
        {spot.outlet && <div className="bg-white/90 p-2 rounded-xl shadow-sm text-lg">🔌</div>}
        {spot.food && <div className="bg-white/90 p-2 rounded-xl shadow-sm text-lg">☕</div>}
      </div>
    </div>
    <div className="p-8">
      <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1 leading-tight">{spot.name}</h3>
      <p className="text-gray-400 text-sm mb-3 italic">{spot.district}</p>
      <p className="text-gray-500 text-xs mb-4 line-clamp-1">{spot.address}</p>
      
      <div className="space-y-3 font-sans mb-6">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-sm text-gray-500">
          <span>📶 Wi-Fi</span>
          <span className="text-orange-400 font-bold">{"★".repeat(spot.wifi)}{"☆".repeat(5-spot.wifi)} {spot.wifi}.0</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>🔊 Quiet</span>
          <span className="text-orange-400 font-bold">{"★".repeat(spot.quiet)}{"☆".repeat(5-spot.quiet)} {spot.quiet}.0</span>
        </div>
      </div>

      {/* КНОПКА К КАРТАМ */}
      <a 
        href={spot.google_maps_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block text-center bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-100 transition"
      >
        View on Google Maps
      </a>
    </div>
  </div>
);

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtVenues, setDistrictVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDistrictClick = (district) => {
    setIsLoading(true);
    setSelectedDistrict(district.name);
    
    // Имитация загрузки
    setTimeout(() => {
      const filtered = spotsFromDB.filter(s => s.district === district.name);
      setDistrictVenues(filtered);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] font-sans selection:bg-emerald-100">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 transition-all ${selectedDistrict ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedDistrict(null)}>
          <div className="text-emerald-500 text-3xl">📍</div>
          <span className={`font-serif text-2xl font-bold tracking-tight ${selectedDistrict ? 'text-gray-900' : 'text-white'}`}>Ankara Study Map</span>
        </div>
        {selectedDistrict && (
          <button onClick={() => setSelectedDistrict(null)} className="text-emerald-600 font-bold hover:underline">← Back Home</button>
        )}
      </nav>

      {!selectedDistrict ? (
        <>
          {/* HERO */}
          <header className="relative h-[600px] flex items-center justify-center px-6 overflow-hidden text-center">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 w-full max-w-4xl text-white">
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">Find your perfect study spot in Ankara</h1>
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

          {/* POPULAR SPOTS */}
          <main className="max-w-7xl mx-auto px-8 py-20 text-left">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2 italic">Popular Study Spots</h2>
            <p className="text-gray-400 mb-10 font-sans">{spotsFromDB.length} curated locations found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {spotsFromDB.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6).map(spot => (
                <VenueCard key={spot.id} spot={spot} />
              ))}
            </div>
          </main>

          {/* DISTRICTS */}
          <section className="max-w-7xl mx-auto px-8 py-20 bg-[#F9F7F2] rounded-[3rem] mb-20 text-left">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2">Explore by District</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
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
        /* RESULTS VIEW */
        <main className="max-w-7xl mx-auto px-8 pt-32 pb-20 text-left min-h-screen">
          <h2 className="font-serif text-5xl font-bold text-gray-900 mb-2 italic tracking-tight">Spots in {selectedDistrict}</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p className="font-serif text-xl italic text-gray-600">Finding the best focus zones...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {districtVenues.map(spot => <VenueCard key={spot.id} spot={spot} />)}
            </div>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="py-20 flex flex-col items-center justify-center border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-emerald-600 text-3xl">📍</span>
          <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">Ankara Study Map</span>
        </div>
        <p className="text-gray-500 italic font-light">Helping Ankara students find their focus since 2026.</p>
      </footer>
    </div>
  );
}