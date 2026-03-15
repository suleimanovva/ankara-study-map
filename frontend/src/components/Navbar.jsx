import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  // Проверяем, есть ли у пользователя токен (авторизован ли он)
  const isLoggedIn = !!localStorage.getItem('app_token'); 

  const handleLogout = () => {
    localStorage.removeItem('app_token'); // Удаляем токен из памяти
    navigate('/'); // Отправляем на главную
    window.location.reload(); // Перезагружаем, чтобы интерфейс обновился
  };

  return (
    // z-[100], чтобы Navbar всегда был сверху
    <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-6 py-5 bg-transparent">
      
      <div className="flex items-center gap-2">
        {/* Сделали логотип кликабельным */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Ankara Study Map
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {/* 🔥 НОВЫЙ БЛОК АВТОРИЗАЦИИ 🔥 */}
        <div className="min-w-[100px] flex justify-end">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-white/20 text-white border border-white/50 px-6 py-2 rounded-full font-bold hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              Log out
            </button>
          ) : (
            <Link 
              to="/login"
              className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-md border border-emerald-500"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Меню Гамбургер */}
        <button className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}