// --- (ЗАМІНИТИ) frontend/src/App.js (v18.5) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); // (НОВЕ v18.5)

  // (НОВЕ v18.5) - Перевірка токену при завантаженні
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      console.log('Found token, setting auth header');
      // Встановлюємо токен для всіх майбутніх запитів
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserEmail(email);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // (ОНОВЛЕНО v18.5) - Тепер отримуємо токен
  const handleLogin = (email, token) => {
    // 1. Зберігаємо токен
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    
    // 2. Встановлюємо токен для всіх майбутніх запитів
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // 3. Оновлюємо стан
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  // (ОНОВЛЕНО v18.5) - Очищуємо токен
  const handleLogout = () => {
    // 1. Очищуємо сховище
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    
    // 2. Видаляємо токен з заголовків
    delete axios.defaults.headers.common['Authorization'];
    
    // 3. Оновлюємо стан
    setUserEmail('');
    setIsAuthenticated(false);
  };

  // (НОВЕ v18.5) - Поки перевіряємо токен, нічого не показуємо
  if (isLoading) {
    return <div>Завантаження...</div>; // Або кращий спіннер
  }

  return (
    <div className="App">
      <div className="app-container">
        {isAuthenticated ? (
          <Dashboard email={userEmail} onLogout={handleLogout} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;