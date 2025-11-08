// --- frontend/src/components/pages/sub/Deposit.js (v15.1) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Deposit = ({ onBack, onLogout, onUpdate }) => {
  const [accounts, setAccounts] = useState(null); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('/overview');
        if (res && res.data && Array.isArray(res.data.accounts)) {
          setAccounts(res.data.accounts);
          if(res.data.accounts.length > 0) {
             setToAccountId(res.data.accounts[0].id); 
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

  // (НОВЕ v15.0) Обробка поповнення
  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.post('/deposit', {
        toAccountId,
        amount: parseFloat(amount)
      });
      setSuccess(res.data.message);
      setAmount('');
      
      setTimeout(() => {
        onUpdate(); 
      }, 1500);
      
    } catch (err) {
       setError(err.response?.data?.message || 'Помилка поповнення');
       setIsLoading(false);
    }
  };

  if (!accounts) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Завантаження рахунків...</h1>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Поповнити рахунок</h1>
      <p className="page-description">
        Виберіть рахунок, який бажаєте поповнити.
      </p>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form className="service-form" onSubmit={handleDeposit}>
        <label htmlFor="toAccount">На рахунок:</label>
        <select 
          id="toAccount"
          value={toAccountId} 
          onChange={(e) => setToAccountId(e.target.value)}
          required
          disabled={isLoading}
        >
          {accounts.length > 0 ? (
            accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                ...{acc.lastFour} ({acc.balance.toFixed(2)} {acc.currency})
              </option>
            ))
          ) : (
             <option value="" disabled>У вас немає рахунків</option>
          )}
        </select>
        
        <label htmlFor="amount">Сума (симуляція):</label>
        <input 
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50.00"
          step="0.01"
          min="1"
          required
          disabled={isLoading}
        />
        
        <p style={{color: 'var(--text-secondary)', fontSize: '0.9em', textAlign: 'center'}}>
          Це симуляція. Натискання кнопки миттєво поповнить баланс.
        </p>
        
        <button type="submit" disabled={isLoading || accounts.length === 0}>
          {isLoading ? 'Обробка...' : 'Поповнити'}
        </button>
      </form>
    </div>
  );
};

export default Deposit;