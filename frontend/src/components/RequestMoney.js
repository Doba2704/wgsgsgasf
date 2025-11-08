// --- frontend/src/components/pages/sub/RequestMoney.js (НОВИЙ ФАЙЛ) ---
import React, { useState } from 'react';
import axios from 'axios';

const RequestMoney = ({ onLogout, onBack }) => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await axios.post('/request/create', {
        recipientEmail: email,
        amount: parseFloat(amount)
      });
      setMessage(res.data.message);
      setEmail('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка');
      if (err.response?.status === 401) onLogout();
    }
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Запит на оплату</h1>
      <p className="page-description">
        Надішліть запит на оплату іншому користувачу банку.
      </p>
      
      <form onSubmit={handleSubmit} className="service-form">
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <label>Email отримувача:</label>
        <input 
          type="email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@example.com" 
          required 
        />
        <label>Сума (EUR):</label>
        <input 
          type="number" 
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="50.00" 
          required 
          min="0.01" 
          step="0.01"
        />
        
        <button type="submit">Надіслати запит</button>
      </form>
    </div>
  );
};

export default RequestMoney;