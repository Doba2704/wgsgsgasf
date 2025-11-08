// --- (ЗАМІНИТИ) frontend/src/components/CardDetails.js (v18.0) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardDetails = ({ onBack, onLogout, navigateTo, accountId }) => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) {
        setError('ID рахунку не знайдено');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // (ВИПРАВЛЕНО v18.0) - Запит на 1 конкретний рахунок
        const res = await axios.get(`/accounts/${accountId}`);
        setAccount(res.data);
      } catch (err) {
        setError('Не вдалося завантажити дані про рахунок');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccount();
  }, [accountId, onLogout]);

  if (isLoading) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Завантаження Картки...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Помилка</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>{account.name}</h1>
      
      <div className={`glass-card card-color-3`} style={{ width: '100%', height: '200px' }}>
        <div className="card-header">
          <span className="card-type">{account.cardType}</span>
          <span className="card-currency-logo">{account.currency}</span>
        </div>
        <div className="card-balance">
          {account.balance.toLocaleString('de-DE', { style: 'currency', currency: account.currency })}
        </div>
        <div className="card-footer">
          <span className="card-currency-name">{account.tariff} Plan</span>
          <span className="card-number">•••• {account.cardNumber.slice(-4)}</span>
        </div>
      </div>
      
      <h3>Керування карткою</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => navigateTo('cardLimits', { accountId: account.id })}>
          <span className="service-icon">📏</span>
          Ліміти
        </button>
        <button className="service-button" onClick={() => navigateTo('cardSecurity', { accountId: account.id })}>
          <span className="service-icon">🔒</span>
          Безпека
        </button>
        <button className="service-button" onClick={() => navigateTo('cardPin', { accountId: account.id })}>
          <span className="service-icon">🔑</span>
          PIN-код
        </button>
        {/* (НОВЕ v18.0) - Кнопка зміни тарифу */}
        <button className="service-button" onClick={() => navigateTo('cardTariff', { accountId: account.id, currentTariff: account.tariff })}>
          <span className="service-icon">✨</span>
          Змінити тариф
        </button>
      </div>
    </div>
  );
};

export default CardDetails;