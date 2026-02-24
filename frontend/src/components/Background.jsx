export default function Background() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Затемнение, чтобы текст был читаемым */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10"></div>
      
      {/* Красивое фото Анкары или Библиотеки */}
      <img 
        src="https://images.unsplash.com/photo-1523050335456-adabc08b97e4?auto=format&fit=crop&q=80" 
        className="w-full h-full object-cover"
        alt="Study Environment"
      />
    </div>
  );
}