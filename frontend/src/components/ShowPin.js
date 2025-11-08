// --- frontend/src/components/pages/sub/ShowPin.js (НОВИЙ ФАЙЛ) ---
import React, { useState } from 'react';
import axios from 'axios';

const ShowPin = ({ onLogout, onBack, accountId }) => {
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/card/pin', { accountId, password });
      setPin(res.data.pin);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка');
      if (err.response?.status === 401) onLogout();
    }
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Перегляд PIN-коду</h1>
      
      {!pin ? (
        <form onSubmit={handleSubmit} className="service-form">
          <p>Для безпеки, будь ласка, введіть ваш пароль від акаунту.</p>
          {error && <p className="error-message">{error}</p>}
          <label>Пароль:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Показати PIN</button>
        </form>
      ) : (
        <div className="pin-display-box">
          <p>Ваш PIN-код:</p>
          <div className="pin-code">{pin}</div>
          <p>Запам'ятайте його. Він зникне, коли ви підете звідси.</p>
        </div>
      )}
    </div>
  );
};

export default ShowPin;