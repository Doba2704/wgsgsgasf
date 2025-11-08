// --- frontend/src/components/pages/sub/CardFreeze.js (v15.1) ---
import React, { useState } from 'react';
import axios from 'axios';

const ToggleSwitch = ({ id, checked, onChange, disabled }) => (
  <label className="toggle-switch" htmlFor={id}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} disabled={disabled} />
    <span className="slider round"></span>
  </label>
);

const CardFreeze = ({ onBack, onUpdate, accountId, currentStatus }) => {
  const [isFrozen, setIsFrozen] = useState(currentStatus === 'frozen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = async (e) => {
    const newStatus = e.target.checked ? 'frozen' : 'active';
    setIsLoading(true);
    setError('');
    
    try {
      await axios.put(`/accounts/${accountId}/status`, { status: newStatus });
      setIsFrozen(newStatus === 'frozen');
      onUpdate(); 
    } catch (err) {
      setError('Не вдалося змінити статус картки');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Заморозити картку</h1>
      <p className="page-description">
        Якщо ви загубили картку, ви можете миттєво її заморозити.
      </p>
      
      <div className="settings-list">
        <div className="settings-item">
          <div className="settings-item-info">
            <span role="img" aria-label="freeze">❄️</span>
            <strong>Картка заморожена</strong>
          </div>
          <ToggleSwitch 
            id="freeze-toggle"
            checked={isFrozen}
            onChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {error && <p className="error-message" style={{marginTop: '15px'}}>{error}</p>}
      
      {isFrozen && (
         <div className="placeholder-content" style={{marginTop: '20px', background: 'var(--base-bg)'}}>
            <span role="img" aria-label="shield">🛡️</span>
            <h2>Картку Заморожено</h2>
            <p>
              Всі платежі та зняття готівки по цій картці заблоковано.
            </p>
         </div>
      )}
    </div>
  );
};
export default CardFreeze;