// --- frontend/src/components/pages/sub/Exchange.js (v15.1) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exchange = ({ onBack, onLogout, onUpdate }) => {
  const [accounts, setAccounts] = useState(null);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('/overview');
        if (res && res.data && Array.isArray(res.data.accounts)) {
          const userAccounts = res.data.accounts;
          setAccounts(userAccounts);
          
          if (userAccounts.length >= 2) {
            setFromAccountId(userAccounts[0].id);
            setToAccountId(userAccounts[1].id);
          } else if (userAccounts.length === 1) {
             setFromAccountId(userAccounts[0].id);
          }
        } else {
          setAccounts([]);
        }
      } catch (err) {
        setError('Не вдалося завантажити рахунки');
        setAccounts([]);
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchAccounts();
  }, [onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('/exchange', {
        fromAccountId,
        toAccountId,
        amount: parseFloat(amount)
      });
      setSuccess(res.data.message);
      setAmount('');
      setTimeout(() => {
        onUpdate(); 
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка обміну');
      setIsLoading(false);
    } 
  };
  
  if (!accounts) {
     return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Завантаження...</h1>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Обмін валют</h1>
      
      <form onSubmit={handleSubmit} className="service-form">
        <label htmlFor="fromAccount">З рахунку:</label>
        <select 
          id="fromAccount"
          value={fromAccountId} 
          onChange={(e) => setFromAccountId(e.target.value)}
          required
        >
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              ...{acc.lastFour} ({acc.balance.toFixed(2)} {acc.currency})
            </option>
          ))}
        </select>
        
        <label htmlFor="amount">Сума:</label>
        <input 
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          required
        />
        
        <label htmlFor="toAccount">На рахунок:</label>
        <select 
          id="toAccount"
          value={toAccountId} 
          onChange={(e) => setToAccountId(e.target.value)}
          required
        >
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              ...{acc.lastFour} ({acc.balance.toFixed(2)} {acc.currency})
            </option>
          ))}
        </select>
        
        <div className="exchange-rate">
          <p>Приблизний курс: <strong>1.00 EUR ≈ 1.08 USD</strong></p>
          <p>(Курс буде фіналізовано під час операції)</p>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <button type="submit" disabled={isLoading || accounts.length < 2}>
          {isLoading ? 'Обмін...' : 'Обміняти'}
        </button>
      </form>
    </div>
  );
};

export default Exchange;