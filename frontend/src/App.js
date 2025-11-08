// --- frontend/src/App.js (v15.1) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [name, setName] = useState(localStorage.getItem('name'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Ефект для оновлення теми
  useEffect(() => {
    document.body.className = ''; 
    document.body.classList.add(theme); 
    localStorage.setItem('theme', theme); 
  }, [theme]);

  // Ефект для налаштування Axios при завантаженні
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
    }
  }, [token, email, name]); 

  // Функція входу
  const handleLoginSuccess = async (data) => {
    setToken(data.token);
    setEmail(data.email);
    setName(data.name);

    axios.defaults.headers.common['Authorization'] = data.token;
    
    try {
      const res = await axios.get('/settings');
      const newTheme = res.data.theme || 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (err) {
      console.error("Не вдалося завантажити налаштування теми (але вхід успішний):", err);
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Функція виходу
  const handleLogout = () => {
    axios.post('/logout').catch(err => console.error("Помилка під час /logout", err));
    setToken(null);
    setEmail(null);
    setName(null);
    setTheme('light'); 
  };

  // Функція зміни теми (для Profile.js)
  const handleChangeTheme = (newTheme) => {
    setTheme(newTheme);
  };
  
  // (НОВЕ v15.0) Функція оновлення імені (для EditProfile.js)
  const handleUpdateName = (newName) => {
    setName(newName);
    localStorage.setItem('name', newName);
  }

  return (
    <div className="App">
      <div className="app-container">
        {token ? (
          <Dashboard 
            email={email} 
            name={name} // (НОВЕ v15.0)
            onLogout={handleLogout} 
            currentTheme={theme}
            onChangeTheme={handleChangeTheme}
            onUpdateName={handleUpdateName} // (НОВЕ v15.0)
          />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;