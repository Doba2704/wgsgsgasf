// --- (ЗАМІНИТИ) frontend/src/components/ExchangeModal.js (v17.4 - Виправлення 'setRate') ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExchangeModal = ({ onClose, onLogout, onUpdate }) => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  
  // (ВИПРАВЛЕНО v17.4) - Ми не використовуємо 'setRate', тому прибрали її.
  const [rate] = useState(0.92); // Фейковий курс EUR -> USD
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('/accounts');
        setAccounts(res.data);
        if (res.data.length > 1) {
          setFromAccount(res.data[0].id); 
          setToAccount(res.data[1].id);
        }
      } catch (err) {
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchAccounts();
    // Тут можна було б завантажувати реальний курс
  }, [onLogout]);

  // Розрахунок при зміні суми
  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    // Розраховуємо суму отримання
    const calculatedToAmount = (parseFloat(value) * rate).toFixed(2);
    setToAmount(isNaN(calculatedToAmount) ? '' : calculatedToAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fromAccount || !toAccount || !fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Будь ласка, заповніть всі поля');
      setIsLoading(false);
      return;
    }
    
    if (fromAccount === toAccount) {
      setError('Рахунки не можуть бути однаковими');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/exchange', {
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: parseFloat(fromAmount),
      });
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка обміну.');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">&times;</button>
        <h2>Обмін валют</h2>
        
        <form className="service-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <label>З рахунку</label>
          <select 
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance.toLocaleString('de-DE')} {acc.currency})
              </option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
          />

          <div className="exchange-rate">
             <p>Курс (приблизний): <strong>1 EUR ≈ {rate} USD</strong></p>
          </div>
          
          <label>На рахунок</label>
          <select 
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance.toLocaleString('de-DE')} {acc.currency})
              </option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="0.00"
            value={toAmount}
            disabled // Розраховується автоматично
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Обмін...' : 'Конвертувати'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExchangeModal;