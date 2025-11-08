// --- frontend/src/components/pages/Transfer.js (v15.1) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transfer = ({ navigateTo, onLogout, viewProps }) => {
  const [accounts, setAccounts] = useState(null); 
  const [view, setView] = useState('main'); 
  const [fromAccountId, setFromAccountId] = useState('');
  const [recipient, setRecipient] = useState('');
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
          
          if (userAccounts.length > 0) {
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

  useEffect(() => {
    if(viewProps.timestamp) { 
        setView('main');
        setSuccess('Операція успішна!');
        setRecipient('');
        setAmount('');
        setError('');
        const timer = setTimeout(() => setSuccess(''), 3000);
        return () => clearTimeout(timer);
    }
  }, [viewProps.timestamp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    let url = '';
    let payload = {};

    switch(view) {
      case 'card':
        url = '/transfer/card';
        payload = { fromAccountId, amount: parseFloat(amount), cardNumber: recipient };
        break;
      case 'phone':
        url = '/pay-bill';
        payload = { fromAccountId, amount: parseFloat(amount), phone: recipient };
        break;
      case 'internal':
        url = '/transfer';
        payload = { fromAccountId, amount: parseFloat(amount), recipientEmail: recipient };
        break;
      default:
        setError('Невідомий тип переказу');
        setIsLoading(false);
        return;
    }
    
    try {
      const res = await axios.post(url, payload);
      setSuccess(res.data.message || 'Переказ успішний!');
      setRecipient('');
      setAmount('');
      setView('main'); 
      const timer = setTimeout(() => setSuccess(''), 3000); 
      return () => clearTimeout(timer);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка переказу');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMainView = () => (
    <div className="page-container">
      <h1>Платежі</h1>
      {success && <p className="success-message">{success}</p>}
      {error && !success && <p className="error-message">{error}</p>} 
      <h3>Шаблони</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => navigateTo('exchange')}>
          <span className="service-icon">🔄</span>
          Обмін валют
        </button>
        <button className="service-button" onClick={() => setView('phone')}>
          <span className="service-icon">📱</span>
          Мобільний
        </button>
      </div>

      <h3>Перекази</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => setView('card')}>
          <span className="service-icon">💳</span>
          На картку
        </button>
         <button className="service-button" onClick={() => setView('internal')}>
          <span className="service-icon">👤</span>
          Між рахунками
        </button>
         <button className="service-button disabled">
          <span className="service-icon">🌍</span>
          SWIFT / SEPA
        </button>
        <button className="service-button" onClick={() => navigateTo('splitBill')}>
          <span className="service-icon">⚖️</span>
          Розділити чек
        </button>
      </div>
    </div>
  );

  const renderFormView = () => {
    if (!accounts) {
      return (
        <div className="sub-page">
          <button onClick={() => setView('main')} className="back-button">←</button>
          <h1>Завантаження...</h1>
          {error && <p className="error-message">{error}</p>}
        </div>
      );
    }
    
    let title = 'Переказ';
    let label = 'Отримувач';
    let inputType = 'text';
    let placeholder = '';

    if (view === 'card') {
      title = 'На картку';
      label = 'Номер картки (16 цифр)';
      inputType = 'tel';
      placeholder = 'XXXX XXXX XXXX XXXX';
    } else if (view === 'phone') {
      title = 'Поповнити мобільний';
      label = 'Номер телефону';
      inputType = 'tel';
      placeholder = '+380 XX XXX XX XX';
    } else if (view === 'internal') {
      title = 'Між рахунками';
      label = 'Email отримувача';
      inputType = 'email';
      placeholder = 'user@example.com';
    }

    return (
      <div className="sub-page">
        <button onClick={() => setView('main')} className="back-button">←</button>
        <h1>{title}</h1>
        <form onSubmit={handleSubmit} className="service-form">
          <label htmlFor="fromAccount">З рахунку:</label>
          <select 
            id="fromAccount"
            value={fromAccountId} 
            onChange={(e) => setFromAccountId(e.target.value)}
            required
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
          
          <label htmlFor="recipient">{label}:</label>
          <input 
            type={inputType}
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={placeholder}
            required
          />
          
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
          
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" disabled={isLoading || accounts.length === 0}>
            {isLoading ? 'Відправка...' : 'Відправити'}
          </button>
        </form>
      </div>
    );
  };

  return view === 'main' ? renderMainView() : renderFormView();
};

export default Transfer;