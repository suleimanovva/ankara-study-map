export default function Hero() {
  return (
    <section className="relative h-[650px] w-full flex items-center justify-center px-6 overflow-hidden">
      {/* Фоновое изображение с затемнением */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" 
          className="w-full h-full object-cover" 
          alt="Students studying"
        />
        {/* Мягкий темный слой поверх фото, как на твоем скрине */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Контент Hero */}
      <div className="relative z-10 w-full max-w-5xl text-center text-white mt-12">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Find your perfect study spot in Ankara
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover cafes, libraries, and coworking spaces rated by students for Wi-Fi, quiet levels, and amenities.
        </p>
        
        {/* Строка поиска - максимально скругленная и белая */}
        <div className="relative max-w-3xl mx-auto">
          <input 
            type="text" 
            placeholder="Search by name, district, or vibe..." 
            className="w-full px-10 py-6 rounded-[2rem] bg-white text-gray-800 text-lg shadow-2xl outline-none placeholder:text-gray-400 font-sans"
          />
        </div>
      </div>
    </section>
  );
}