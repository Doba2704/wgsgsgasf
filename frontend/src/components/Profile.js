// --- (ЗАМІНИТИ) frontend/src/components/Profile.js (v18.2 - Робоча версія) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ onLogout, navigateTo }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/profile');
        setProfile(res.data);
      } catch (err) {
        setError('Не вдалося завантажити профіль');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [onLogout]);

  if (isLoading) {
    return (
      <div className="page-container">
        <h1>Завантаження профілю...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Профіль</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="page-container">
      {/* Ми не використовуємо "page-header" тут, 
        щоб аватар був по центру 
      */}
      <h1>Профіль</h1>
      
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name ? profile.name[0].toUpperCase() : 'P'}
        </div>
        <span className="profile-name">{profile.name}</span>
        <span className="profile-email">{profile.email}</span>
      </div>
      
      <h3>Керування</h3>
      <div className="settings-list">
        {/* Кнопка "Налаштування" */}
        <button 
          className="settings-item" 
          onClick={() => navigateTo('settings', { email: profile.email })}
        >
          <div className="settings-item-info">
            <span role="img" aria-label="settings">⚙️</span>
            <strong>Загальні налаштування</strong>
          </div>
          <span className="arrow">&gt;</span>
        </button>

        {/* Кнопка "Підтримка" (Заглушка) */}
        <button className="settings-item" onClick={() => alert('Підтримка (в розробці)')}>
          <div className="settings-item-info">
            <span role="img" aria-label="support">💬</span>
            <strong>Підтримка</strong>
          </div>
          <span className="arrow">&gt;</span>
        </button>
      </div>

      {/* Кнопка "Вийти" */}
      <div className="danger-zone" style={{marginTop: '30px'}}>
        <button 
          className="service-button danger" 
          style={{width: '100%'}} 
          onClick={onLogout}
        >
          <span className="service-icon">🚪</span>
          Вийти з акаунту
        </button>
      </div>
      
    </div>
  );
};

export default Profile;