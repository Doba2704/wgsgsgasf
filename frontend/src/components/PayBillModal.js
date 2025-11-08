// --- (ЗАМІНИТИ) frontend/src/components/PayBillModal.js (v18.0) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PayBillModal = ({ onClose, onLogout, onUpdate, paymentCategory }) => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [details, setDetails] = useState(''); // Номер тел. або рахунку
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Використовуємо передану категорію або "Інший платіж"
  const category = paymentCategory || 'Інший платіж';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('/accounts');
        setAccounts(res.data);
        if (res.data.length > 0) {
          setFromAccount(res.data[0].id);
        }
      } catch (err) {
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchAccounts();
  }, [onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fromAccount || !details || !amount || parseFloat(amount) <= 0) {
      setError('Будь ласка, заповніть всі поля');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/pay-bill', {
        fromAccountId: fromAccount,
        category: category,
        details: details,
        amount: parseFloat(amount),
      });
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка оплати.');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDetailsLabel = () => {
    if (category === 'Моб. поповнення') return 'Номер телефону (+380...)';
    if (category === 'Інтернет') return 'Номер договору';
    return 'Номер рахунку / Reference';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">&times;</button>
        <h2>Оплата: {category}</h2>
        
        <form className="service-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <label>З рахунку</label>
          <select 
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
          >
            {accounts.length > 0 ? (
              accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.balance.toLocaleString('de-DE')} {acc.currency})
                </option>
              ))
            ) : (
              <option disabled>У вас ще немає рахунків</option>
            )}
          </select>
          
          <label>{getDetailsLabel()}</label>
          <input 
            type="text" 
            placeholder="09..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <label>Сума</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <button type="submit" disabled={isLoading || accounts.length === 0}>
            {isLoading ? 'Оплата...' : 'Оплатити'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayBillModal;