// --- (НОВИЙ ФАЙЛ) frontend/src/components/TransferModal.js (v17.3) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransferModal = ({ onClose, onLogout, onUpdate }) => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toEmail, setToEmail] = useState(''); // Спрощено: переказ за email
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('/accounts');
        setAccounts(res.data);
        if (res.data.length > 0) {
          setFromAccount(res.data[0].id); 
        }
      } catch (err) {
        setError('Не вдалося завантажити рахунки');
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchAccounts();
  }, [onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fromAccount || !toEmail || !amount || parseFloat(amount) <= 0) {
      setError('Будь ласка, заповніть всі поля коректно');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/transfer', {
        fromAccountId: fromAccount,
        toUserEmail: toEmail,
        amount: parseFloat(amount),
      });
      onUpdate(); 
      onClose();  
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка переказу.');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">&times;</button>
        <h2>Переказ коштів</h2>
        
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
          
          <label>Email отримувача</label>
          <input 
            type="email" 
            placeholder="example@gmail.com"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
          />
          
          <label>Сума</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Переказ...' : 'Надіслати'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;