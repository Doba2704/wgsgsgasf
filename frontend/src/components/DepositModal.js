// --- (НОВИЙ ФАЙЛ) frontend/src/components/DepositModal.js (v17.3) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepositModal = ({ onClose, onLogout, onUpdate }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Завантажуємо рахунки користувача
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('/accounts');
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccount(res.data[0].id); // Обираємо перший рахунок за замовчуванням
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

    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      setError('Будь ласка, оберіть рахунок та введіть коректну суму');
      setIsLoading(false);
      return;
    }

    try {
      // Відправляємо запит на поповнення
      await axios.post('/deposit', {
        accountId: selectedAccount,
        amount: parseFloat(amount),
      });
      onUpdate(); // Оновлюємо дані на головній сторінці
      onClose();  // Закриваємо модальне вікно
    } catch (err) {
      setError('Помилка поповнення. Спробуйте пізніше.');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">&times;</button>
        <h2>Поповнити рахунок</h2>
        
        <form className="service-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <label htmlFor="account-select">Оберіть рахунок</label>
          <select 
            id="account-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance.toLocaleString('de-DE')} {acc.currency})
              </option>
            ))}
          </select>
          
          <label htmlFor="amount-input">Сума поповнення</label>
          <input 
            type="number" 
            id="amount-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Завантаження...' : 'Поповнити'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;