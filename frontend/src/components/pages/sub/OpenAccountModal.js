// --- (НОВИЙ ДИЗАЙН) frontend/src/components/pages/sub/OpenAccountModal.js (v15.6) ---
import React, { useState } from 'react';
import axios from 'axios';

// Список доступних валют
const availableCurrencies = [
  { code: 'GBP', name: 'Британський фунт', flag: '🇬🇧' },
  { code: 'PLN', name: 'Польський злотий', flag: '🇵🇱' },
  { code: 'CHF', name: 'Швейцарський франк', flag: '🇨🇭' },
  { code: 'USD', name: 'Долар США', flag: '🇺🇸' },
];

const OpenAccountModal = ({ onClose, onUpdate }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('GBP'); // За замовчуванням
  const [type] = useState('Savings'); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/accounts/open', { currency: selectedCurrency, type });
      setSuccess(res.data.message || 'Рахунок відкрито!');
      
      setTimeout(() => {
        onClose(); 
        onUpdate(); 
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Помилка відкриття рахунку');
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} disabled={isLoading}>&times;</button>
        <h2>Відкрити рахунок</h2>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <form onSubmit={handleSubmit} className="service-form">
          <label>Виберіть валюту:</label>
          
          <div className="currency-selection-list">
            {availableCurrencies.map(currency => (
              <div
                key={currency.code}
                className={`currency-option ${selectedCurrency === currency.code ? 'selected' : ''}`}
                onClick={() => !isLoading && setSelectedCurrency(currency.code)}
              >
                <span className="currency-flag">{currency.flag}</span>
                <div className="currency-info">
                  <strong>{currency.code}</strong>
                  <span>{currency.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9em', textAlign: 'center', marginTop: '10px'}}>
            Рахунок типу "Savings" буде відкрито миттєво з балансом 0.00.
          </p>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Відкриття...' : `Відкрити рахунок (${selectedCurrency})`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpenAccountModal;