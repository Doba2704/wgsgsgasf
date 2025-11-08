// --- frontend/src/components/pages/sub/CardDetails.js (ЗАМІНИТИ v15.9) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getTxIcon = (type, category) => {
  if (type === 'Поповнення') return '📥';
  if (category === 'Їжа') return '🍔';
  if (category === 'Розваги') return '🎬';
  if (category === 'Перекази') return '💸';
  if (category === 'Транспорт') return '🚗';
  return '🛒';
};
const formatTxDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
};

// Кольори
const getCardColor = (currency, index) => {
  if (currency === 'EUR') return 3; 
  if (currency === 'USD') return 0; 
  if (currency === 'GBP') return 4; 
  if (currency === 'PLN') return 5; 
  return index % 4; 
}

const CardDetails = ({ onBack, onLogout, navigateTo, accountId, onUpdate }) => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // (НОВЕ v15.9)
  const [isEditingType, setIsEditingType] = useState(false);
  const [newType, setNewType] = useState('');

  const fetchAccountData = async () => {
    if (!accountId) {
      setError('Не вказано ID картки');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setAccount(null);
    setTransactions([]);
    setError('');
    setSuccess('');
    
    try {
      const [resAccount, resTransactions] = await Promise.all([
        axios.get(`/accounts/${accountId}`), 
        axios.get('/transactions') 
      ]);

      if (!resAccount.data || !Array.isArray(resTransactions.data)) {
           setError('Не вдалося завантажити дані про рахунок (невірна структура).');
           setIsLoading(false);
           return;
      }
      const cardCurrency = resAccount.data.currency;
      const relevantTransactions = resTransactions.data.filter(
        tx => tx.currency === cardCurrency
      );
      setAccount(resAccount.data);
      setNewType(resAccount.data.type); // (НОВЕ v15.9)
      setTransactions(relevantTransactions);
    } catch (err) {
      setError('Не вдалося завантажити дані про рахунок.');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [accountId, onLogout]); 

  // --- (НОВЕ v15.9) ---
  const handleTypeSave = async () => {
      setError('');
      setSuccess('');
      setIsLoading(true);
      try {
          const res = await axios.put(`/accounts/${accountId}/type`, { type: newType });
          setAccount(res.data.account);
          setSuccess(res.data.message);
          setIsEditingType(false);
      } catch (err) {
          setError(err.response?.data?.message || 'Помилка зміни типу');
      } finally {
          setIsLoading(false);
      }
  };
  
  // --- (НОВЕ v15.9) ---
  const handleCloseAccount = async () => {
      setError('');
      setSuccess('');
      
      const confirmClose = window.confirm(`Ви впевнені, що хочете закрити цей рахунок? (${account.currency})\n\nЦЮ ДІЮ НЕМОЖЛИВО СКАСУВАТИ.`);
      if (!confirmClose) return;
      
      setIsLoading(true);
      try {
          const res = await axios.delete(`/accounts/${accountId}`);
          setSuccess(res.data.message);
          // Успішне закриття, повертаємось на головну
          setTimeout(() => {
              onUpdate(); // Оновлює Головну
              onBack(); // Повертає на Головну
          }, 2000);
      } catch (err) {
          setError(err.response?.data?.message || 'Помилка закриття рахунку');
          setIsLoading(false);
      }
  };

  if (isLoading && !account) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Завантаження деталей картки...</h1>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Помилка</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!account) {
     return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Картку не знайдено</h1>
      </div>
    );
  }

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">←</button>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <div className={`glass-card card-color-${getCardColor(account.currency, 0)} ${account.status === 'frozen' ? 'frozen' : ''}`} style={{ width: '100%', margin: '10px 0' }}>
         <div className="card-header">
            {/* --- (ОНОВЛЕНО v15.9) --- */}
            <span className="card-type">{account.type}</span>
            <div className="card-chip"></div>
          </div>
          <span className="card-balance">
            {account.balance.toLocaleString('de-DE', { style: 'currency', currency: account.currency })}
          </span>
          <div className="card-footer">
            <span className="card-currency-name">{account.status === 'frozen' ? 'ЗАМОРОЖЕНО' : account.currency}</span>
            <span className="card-number">... {account.lastFour}</span>
          </div>
      </div>
      
      <h3>Опції картки</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => navigateTo('cardFreeze', { accountId: account.id, currentStatus: account.status })}>
          <span className="service-icon" style={{color: account.status === 'frozen' ? 'var(--brand-color)' : 'var(--text-secondary)'}}>
             {account.status === 'frozen' ? '❄️' : '❄️'}
          </span>
          {account.status === 'frozen' ? 'Розморозити' : 'Заморозити'}
        </button>
        <button className="service-button" onClick={() => navigateTo('cardSecurity')}>
          <span className="service-icon">🔒</span>
          Безпека
        </button>
        <button className="service-button" onClick={() => navigateTo('cardLimits')}>
          <span className="service-icon">💳</span>
          Ліміти
        </button>
        {/* --- (ОНОВЛЕНО v15.9) --- */}
        <button className="service-button" onClick={() => navigateTo('cardPin', { accountId: account.id })}>
          <span className="service-icon">👁️</span>
          PIN / CVC
        </button>
      </div>
      
      {/* --- (НОВЕ v15.9) --- */}
      <h3>Керування рахунком</h3>
      {!isEditingType ? (
        <button 
            className="service-button" 
            style={{width: '100%'}}
            onClick={() => setIsEditingType(true)}
            disabled={isLoading}
        >
            <span className="service-icon">✏️</span>
            Змінити тип рахунку (Поточний: {account.type})
        </button>
      ) : (
        <div className="service-form" style={{background: 'var(--card-bg)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)'}}>
            <label htmlFor="accountType">Новий тип рахунку:</label>
            <select 
                id="accountType"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
            >
                <option value="Main">Main</option>
                <option value="Savings">Savings</option>
                <option value="Business">Business</option>
            </select>
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <button className="secondary" onClick={() => setIsEditingType(false)}>Скасувати</button>
                <button onClick={handleTypeSave} disabled={isLoading}>
                    {isLoading ? 'Збереження...' : 'Зберегти'}
                </button>
            </div>
        </div>
      )}
      
      
      <h3>Транзакції ({account.currency})</h3>
      <ul className="transactions-list">
        {transactions.length > 0 ? (
          transactions.slice(0, 10).map(tx => (
            <li 
              key={tx.id} 
              className="transaction-item"
              onClick={() => navigateTo('transactionDetails', { transactionId: tx.id })}
            >
              <span className="transaction-icon">{getTxIcon(tx.type, tx.category)}</span>
              <div className="transaction-details">
                <strong>{tx.from}</strong>
                <span>{formatTxDate(tx.date)} • {tx.type}</span>
              </div>
              <span className={`transaction-amount ${tx.amount > 0 ? 'income' : 'expense'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency}
              </span>
            </li>
          ))
        ) : (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0'}}>
            Транзакцій по цій картці ще немає.
          </p>
        )}
      </ul>
      
      {/* --- (НОВЕ v15.9) --- */}
      <div className="danger-zone">
        <h3>Небезпечна зона</h3>
         <button 
            className="service-button danger" 
            style={{width: '100%'}}
            onClick={handleCloseAccount}
            disabled={isLoading}
        >
            <span className="service-icon">🗑️</span>
            Закрити рахунок
        </button>
        <p>Ця дія є незворотною. Ви можете закрити рахунок, лише якщо його баланс дорівнює 0.</p>
      </div>
      
    </div>
  );
};

export default CardDetails;