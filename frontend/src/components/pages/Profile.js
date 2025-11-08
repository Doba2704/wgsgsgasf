// --- frontend/src/components/Profile.js (ПОВНІСТЮ ЗАМІНИТИ - v14.0) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// (Виправлення v11.2) Додаємо ToggleSwitch
const ToggleSwitch = ({ id, checked, onChange }) => (
  <label className="toggle-switch" htmlFor={id}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
    <span className="slider round"></span>
  </label>
);

const Profile = ({ email, onLogout, navigateTo, currentTheme, onChangeTheme }) => {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  
  // (Виправлення) Використовуємо правильний useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProfile, resSettings] = await Promise.all([
          axios.get('/profile'),
          axios.get('/settings')
        ]);
        // (Виправлення v11.6) Надійна перевірка
        setProfile(resProfile.data || { name: "User" }); 
        setSettings(resSettings.data || { theme: 'light' }); 
      } catch (err) {
        setError('Не вдалося завантажити профіль');
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchData();
  }, [onLogout]); // (Виправлення) Запускаємо один раз

  // (Виправлення) Обробка стану завантаження
  if (!profile || !settings) {
    return <div className="page-container"><h1>Завантаження профілю...</h1></div>;
  }
  
  if (error) {
     return <div className="page-container"><h1>Профіль</h1><p className="error-message">{error}</p></div>;
  }
  
  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    onChangeTheme(newTheme); // Оновлюємо стан в App.js
    // Зберігаємо на бекенді
    axios.put('/settings', { theme: newTheme }).catch(err => console.error(err));
  };
  
  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
        </div>
        <h2 className="profile-name">{profile.name}</h2>
        <span className="profile-email">{email}</span>
      </div>

      <h3>Налаштування</h3>
      <div className="settings-list">
        {/* --- (ВИПРАВЛЕНО v13.0) --- */}
        <div className="settings-item" onClick={() => navigateTo('editProfile')}>
          <div className="settings-item-info">
            <span role="img" aria-label="person">👤</span>
            <strong>Особисті дані</strong>
          </div>
          <span className="arrow">›</span>
        </div>
        {/* --- (ВИПРАВЛЕНО v13.0) --- */}
        <div className="settings-item" onClick={() => navigateTo('security')}>
          <div className="settings-item-info">
            <span role="img" aria-label="shield">🛡️</span>
            <strong>Безпека</strong>
          </div>
          <span className="arrow">›</span>
        </div>
        <div className="settings-item">
          <div className="settings-item-info">
            <span role="img" aria-label="moon">🌙</span>
            <strong>Темна тема</strong>
          </div>
          <ToggleSwitch 
            id="theme-toggle"
            checked={currentTheme === 'dark'}
            onChange={handleThemeChange}
          />
        </div>
      </div>
      
      <div className="danger-zone">
        <h3>Небезпечна зона</h3>
        <div className="settings-list">
          <div className="settings-item danger" onClick={onLogout}>
            <div className="settings-item-info">
              <span role="img" aria-label="exit">🚪</span>
              <strong>Вийти з акаунту</strong>
            </div>
            <span className="arrow">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;