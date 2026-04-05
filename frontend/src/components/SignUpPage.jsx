import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 // Обработчик для стандартной регистрации
  const handleStandardSignUp = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username, 
          email: email, 
          password: password 
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Если бэкенд сразу возвращает токен, сохраняем его и пускаем на сайт
        if (data.token) {
          localStorage.setItem('app_token', data.token);
          navigate('/'); 
          window.location.reload();
        } else {
          // Если токен не возвращается, просто отправляем на страницу логина
          alert("Registration successful! Please log in.");
          navigate('/login');
        }
      } else {
        alert("Registration failed: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server connection error.");
    }
  };

  // Обработчик для Google регистрации/входа
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
        navigate('/'); // После успешной регистрации отправляем на главную
        window.location.reload();
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
        <h1 className="text-3xl font-serif font-bold text-center text-gray-900 mb-2">Create an Account</h1>
        <p className="text-center text-gray-500 mb-8">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
        </p>

        {/* СТАНДАРТНАЯ ФОРМА РЕГИСТРАЦИИ */}
        <form onSubmit={handleStandardSignUp} className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              placeholder="e.g. StudyMaster"
              required
            />
          </div>
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

          <button 
            type="submit" 
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-md mt-4"
          >
            SIGN UP
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-4 text-sm text-gray-400 font-bold uppercase">Or sign up with</span>
        </div>

        {/* КНОПКА GOOGLE */}
        <div className="flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => console.log("Sign Up Failed")}
            theme="outline"
            size="large"
            locale="en"
            text="signup_with"
          />
        </div>
      </div>
    </div>
  );
}