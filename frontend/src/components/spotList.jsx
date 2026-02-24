import React from 'react';

// Данные из твоего SEED DATA
const spotsData = [
  {
    id: 1,
    name: 'Milli Kütüphane (National Library)',
    district: 'Çankaya',
    wifi_rating: 4,
    quiet_rating: 5,
    outlet: true,
    food: false,
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070' // Библиотека
  },
  {
    id: 5,
    name: 'Cumhurbaşkanlığı Millet Kütüphanesi',
    district: 'Yenimahalle',
    wifi_rating: 5,
    quiet_rating: 5,
    outlet: true,
    food: true,
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000' // Современная библиотека
  },
  {
    id: 3,
    name: 'Coffee Lab (Bahçelievler)',
    district: 'Çankaya',
    wifi_rating: 5,
    quiet_rating: 2,
    outlet: true,
    food: true,
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047' // Кафе
  },
  {
    id: 4,
    name: 'Workinton (Söğütözü)',
    district: 'Çankaya',
    wifi_rating: 5,
    quiet_rating: 4,
    outlet: true,
    food: true,
    img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070' // Коворкинг
  }
];

const SpotCard = ({ spot }) => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="relative h-64 overflow-hidden">
      <img src={spot.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={spot.name} />
      <div className="absolute bottom-4 left-4 flex gap-2">
        {spot.outlet && <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm">🔌</div>}
        {spot.food && <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm">☕</div>}
      </div>
    </div>
    <div className="p-8 text-left">
      <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1 leading-tight">{spot.name}</h3>
      <p className="text-gray-400 text-sm mb-4 font-sans">{spot.district}</p>
      <div className="space-y-2 font-sans">
        <div className="flex justify-between text-sm italic text-gray-500">
          <span>📶 Wi-Fi</span>
          <span className="text-orange-400 font-bold">
            {"★".repeat(spot.wifi_rating)}{"☆".repeat(5 - spot.wifi_rating)} {spot.wifi_rating}.0
          </span>
        </div>
        <div className="flex justify-between text-sm italic text-gray-500">
          <span>🔊 Quiet</span>
          <span className="text-orange-400 font-bold">
            {"★".repeat(spot.quiet_rating)}{"☆".repeat(5 - spot.quiet_rating)} {spot.quiet_rating}.0
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default function SpotList() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-left bg-[#FCFBF7]">
      <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2">Popular Study Spots</h2>
      <p className="text-gray-400 mb-8">{spotsData.length} spots found in Ankara</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {spotsData.map(spot => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </section>
  );
}