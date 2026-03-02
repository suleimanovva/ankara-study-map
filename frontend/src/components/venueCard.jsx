// src/components/VenueCard.jsx
export const VenueCard = ({ venue }) => {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img src={venue.image_url || 'default-spot.jpg'} className="w-full h-full object-cover" alt={venue.name} />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {venue.outlet_availability && <div className="bg-white/90 p-2 rounded-lg shadow-sm">🔌</div>}
          {venue.has_food && <div className="bg-white/90 p-2 rounded-lg shadow-sm">☕</div>}
        </div>
      </div>
      <div className="p-8 text-left">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">{venue.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{venue.address}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm italic text-gray-500">
            <span>📶 Wi-Fi</span>
            <span className="text-orange-400 font-bold">{"★".repeat(venue.wifi_rating)} {venue.wifi_rating}.0</span>
          </div>
          <div className="flex justify-between text-sm italic text-gray-500">
            <span>🔊 Quiet</span>
            <span className="text-orange-400 font-bold">{"★".repeat(venue.quiet_rating)} {venue.quiet_rating}.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};