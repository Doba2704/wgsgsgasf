// --- (НОВИЙ ФАЙЛ) frontend/src/components/Settings.js (v17.3) ---
import React from 'react';

// Це компонент-заглушка, який ми будемо використовувати, 
// поки не реалізуємо повну сторінку налаштувань.
// Але він РОБОЧИЙ і не буде викликати помилок.

const Settings = ({ onBack, onLogout, email }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Налаштування</h1>

      <div className="profile-header">
        <div className="profile-avatar">
          {email ? email[0].toUpperCase() : 'P'}
        </div>
        <span className="profile-name">Admin User</span>
        <span className="profile-email">{email}</span>
      </div>
      
      <h3>Загальні</h3>
      <div className="settings-list">
        <div className="settings-item">
          <div className="settings-item-info">
            <span role="img" aria-label="language">🌐</span>
            <strong>Мова</strong>
          </div>
          <span className="arrow">Українська &gt;</span>
        </div>
        
        <div className="settings-item">
          <div className="settings-item-info">
            <span role="img" aria-label="notifications">🔔</span>
            <strong>Сповіщення</strong>
          </div>
          <span className="arrow">&gt;</span>
        </div>

        <div className="settings-item">
          <div className="settings-item-info">
            <span role="img" aria-label="theme">🌗</span>
            <strong>Темна тема</strong>
          </div>
          {/* Тут буде перемикач */}
        </div>
      </div>
      
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

export default Settings;