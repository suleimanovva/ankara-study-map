import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 // Обработчик для стандартного входа (почта и пароль)
  const handleStandardLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });

      const data = await res.json();

   if (res.ok) {
        localStorage.setItem('app_token', data.token);
        
        // Отправляем пользователя на главную страницу и обновляем сайт
        navigate('/'); 
        window.location.reload();
      } else {
        alert("Login failed: " + (data.error || 'Invalid credentials'));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server connection error.");
    }
  };

  // Обработчик для Google входа (перенесли его сюда из отзывов)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('app_token', data.token);
        navigate(-1); // Возвращает пользователя туда, откуда он пришел (например, на страницу кафе)
      } else {
        alert("Server authorization error: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Backend connection error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-center items-center px-6 pt-20">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-serif font-bold text-center text-gray-900 mb-2">Log in</h1>
        <p className="text-center text-gray-500 mb-8">
          New to StudySpots? <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Sign up</Link>
        </p>

        {/* СТАНДАРТНАЯ ФОРМА (Почта/Пароль) */}
        <form onSubmit={handleStandardLogin} className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              placeholder="name@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password (8+ characters)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="text-right">
            <a href="#" className="text-sm text-emerald-600 font-bold hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
          >
            LOG IN
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-4 text-sm text-gray-400 font-bold uppercase">Or continue with</span>
        </div>

        {/* КНОПКА GOOGLE */}
        <div className="flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => console.log("Login Failed")}
            theme="outline"
            size="large"
            locale="en"
          />
        </div>
      </div>
    </div>
  );
}