// --- (ЗАМІНИТИ) frontend/src/App.js (v18.6) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './components/App.css'; // <-- (ВИПРАВЛЕНО v18.6) - ПОВЕРТАЄМО СТИЛІ

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      console.log('Found token, setting auth header');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserEmail(email);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    delete axios.defaults.headers.common['Authorization'];
    setUserEmail('');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Завантаження...</div>; 
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