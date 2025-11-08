// --- (ЗАМІНИТИ) frontend/src/components/Overview.js (v18.3 - Конвертація) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper-функція для форматування дати
const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });
};

// Компонент одного елементу списку
const TransactionItem = ({ tx, onClick }) => {
  const isIncome = tx.amount > 0;
  return (
    <li className="transaction-item" onClick={() => onClick(tx.id)}>
      <div className="transaction-icon">
        <span>{isIncome ? '📥' : '📤'}</span>
      </div>
      <div className="transaction-details">
        <strong>{tx.from}</strong>
        <span>{tx.category || 'Без категорії'} • {formatDate(tx.date)}</span>
      </div>
      <span className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
        {isIncome ? '+' : ''}{tx.amount.toLocaleString('de-DE')} {tx.currency}
      </span>
    </li>
  );
};

// (НОВЕ v18.3) - Реалістичні курси для конвертації
// (Скільки 1 одиниця валюти коштує в EUR)
const EUR_RATES = {
  "EUR": 1,
  "USD": 0.92, // 1 USD = 0.92 EUR
  "UAH": 0.023  // 1 UAH = 0.023 EUR (Приблизно 43.5 грн/євро)
};

// Головний компонент сторінки
const Overview = ({ email, onLogout, navigateTo, viewProps }) => {
  const [data, setData] = useState({ accounts: [], transactions: [] });
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Завантаження даних (рахунки + транзакції)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [accRes, txRes] = await Promise.all([
          axios.get('/accounts'),
          axios.get('/transactions?limit=5') 
        ]);
        
        setData({ accounts: accRes.data, transactions: txRes.data });

        // (ОНОВЛЕНО v18.3) - Логіка розрахунку балансу
        const calculatedTotal = accRes.data.reduce((sum, acc) => {
          const rate = EUR_RATES[acc.currency] || 0; // Беремо курс або 0
          return sum + (acc.balance * rate);
        }, 0);
        setTotalBalance(calculatedTotal);
        
      } catch (err) {
        setError('Не вдалося завантажити дані');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout, viewProps.timestamp]);
  
  const handleTxClick = (id) => {
    navigateTo('transactionDetails', { transactionId: id });
  };
  
  const handleCardClick = (id) => {
     navigateTo('cardDetails', { accountId: id });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Головна</h1>
        <div className="avatar-icon" onClick={() => navigateTo('profile')}>
          {email ? email[0].toUpperCase() : 'P'}
        </div>
      </div>
      
      <div className="overview-header">
        <span className="welcome-text">Загальний баланс (в EUR)</span>
        <span className="total-balance">
          {/* (ОНОВЛЕНО v18.3) - Показуємо новий конвертований баланс */}
          {totalBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </span>
      </div>
      
      {/* Карусель карток */}
      <h3>Ваші картки</h3>
      <div className="card-carousel">
        {isLoading && <p>Завантаження карток...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {data.accounts.map((acc, index) => (
          <div 
            key={acc.id} 
            className={`glass-card card-color-${index % 6}`}
            onClick={() => handleCardClick(acc.id)}
          >
            <div className="card-header">
              <span className="card-type">{acc.cardType || 'Platinum'}</span>
              <span className="card-currency-logo">{acc.currency}</span>
            </div>
            <div className="card-balance">
              {acc.balance.toLocaleString('de-DE', { style: 'currency', currency: acc.currency })}
            </div>
            <div className="card-footer">
              <span className="card-currency-name">{acc.tariff} Plan</span>
              <span className="card-number">•••• {acc.cardNumber?.slice(-4)}</span>
            </div>
          </div>
        ))}
        {/* Кнопка "Додати нову" */}
        <div className="add-account-card" onClick={() => navigateTo('openAccountModal')}>
          <span className="add-account-icon">+</span>
          <span className="add-account-text">Відкрити рахунок</span>
        </div>
      </div>
      
      {/* Останні транзакції */}
      <h3>Останні операції</h3>
      {isLoading && <p>Завантаження транзакцій...</p>}
      
      {data.transactions.length === 0 && !isLoading && data.accounts.length > 0 && (
        <p>Історія транзакцій порожня.</p>
      )}
      
      {data.accounts.length === 0 && !isLoading && (
         <p>Схоже, у вас ще немає рахунків. Натисніть "+" вище, щоб почати.</p>
      )}
      
      {data.transactions.length > 0 && (
        <ul className="transactions-list">
          {data.transactions.map(tx => (
            <TransactionItem key={tx.id} tx={tx} onClick={handleTxClick} />
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default Overview;