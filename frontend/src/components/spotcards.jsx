function SpotCard({ title, district, rating, quiet, img, tags }) {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 transition-hover hover:shadow-md">
      <div className="relative h-72">
        <img src={img} className="w-full h-full object-cover" />
        <button className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
        {/* Теги на фото (например Wi-Fi и Розетка) */}
        <div className="absolute bottom-4 left-5 flex gap-2">
          {tags.map((t, i) => (
            <span key={i} className="bg-white/90 backdrop-blur p-2 rounded-lg text-sm">{t}</span>
          ))}
        </div>
      </div>
      <div className="p-8">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-400 font-sans mb-4">{district}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>📶 Wi-Fi</span>
            <div className="flex text-orange-400 ml-auto">
              {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}
              <span className="ml-1 text-gray-400 font-bold">{rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>🔊 Quiet</span>
            <div className="flex text-orange-400 ml-auto">
              {"★".repeat(Math.floor(quiet))}{"☆".repeat(5-Math.floor(quiet))}
              <span className="ml-1 text-gray-400 font-bold">{quiet}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}