// --- frontend/src/components/pages/sub/Savings.js (НОВИЙ ФАЙЛ) ---
// (Цей код взято з нашого попереднього Services.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Savings = ({ onLogout, onBack }) => {
  const [jars, setJars] = useState([]);
  const [accounts, setAccounts] = useState([]); // Потрібні для поповнення
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  
  const fetchData = async () => {
    try {
      const resJars = await axios.get('/savings');
      setJars(resJars.data);
      const resAcc = await axios.get('/overview');
      setAccounts(resAcc.data.accounts);
    } catch (err) {
      setError('Помилка завантаження');
      if (err.response?.status === 401) onLogout();
    }
  };
  useEffect(() => { fetchData(); }, [onLogout]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      await axios.post('/savings/open', { name, goalAmount: parseFloat(goal) });
      setMessage('Банку створено!');
      setName(''); setGoal('');
      fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Помилка'); }
  };
  
  const handleAdd = async (jarId) => {
    const amount = parseFloat(prompt('Скільки додати?', '10'));
    if (!amount || amount <= 0) return;
    const activeAccount = accounts.find(a => a.currency === 'EUR' && a.status === 'active');
    if (!activeAccount) { alert('У вас немає активного EUR рахунку'); return; }
    try {
      await axios.post('/savings/add', { jarId, amount, fromAccountId: activeAccount.id });
      fetchData();
    } catch (err) { alert(err.response?.data?.message); }
  };
  
  const handleWithdraw = async (jarId) => {
    const amount = parseFloat(prompt('Скільки зняти?', '10'));
    if (!amount || amount <= 0) return;
    const activeAccount = accounts.find(a => a.currency === 'EUR' && a.status === 'active');
    if (!activeAccount) { alert('У вас немає активного EUR рахунку'); return; }
    try {
      await axios.post('/savings/withdraw', { jarId, amount, toAccountId: activeAccount.id });
      fetchData();
    } catch (err) { alert(err.response?.data?.message); }
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад до Сервісів</button>
      <h1>Мої "Банки"</h1>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="jars-list">
        {jars.map(jar => {
          const percent = (jar.currentAmount / jar.goalAmount) * 100;
          return (
            <div key={jar.id} className="jar-item">
              <div className="jar-header">
                <strong>{jar.name}</strong>
                <span>{jar.currentAmount.toFixed(0)} / {jar.goalAmount.toFixed(0)} EUR</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{width: `${percent > 100 ? 100 : percent}%`}}></div>
              </div>
              <div className="jar-actions">
                <button onClick={() => handleAdd(jar.id)}>+ Поповнити</button>
                <button onClick={() => handleWithdraw(jar.id)} className="secondary">- Зняти</button>
              </div>
            </div>
          );
        })}
      </div>
      
      <form onSubmit={handleCreate} className="service-form">
        <h3>Створити нову банку</h3>
        <input type="text" placeholder="Назва (напр. 'Ноутбук')" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Ціль (EUR)" value={goal} onChange={e => setGoal(e.target.value)} required min="1" />
        <button type="submit">Створити</button>
      </form>
    </div>
  );
};

export default Savings;