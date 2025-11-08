// --- frontend/src/components/pages/Overview.js (ЗАМІНИТИ v15.9) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Функція для форматування дати
const formatTxDate = (isoDate) => {
  const date = new Date(isoDate);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
};

// Іконки для транзакцій
const getTxIcon = (type, category) => {
  if (type === 'Поповнення') return '📥';
  if (category === 'Їжа') return '🍔';
  if (category === 'Розваги') return '🎬';
  if (category === 'Перекази') return '💸';
  if (category === 'Транспорт') return '🚗';
  return '🛒'; 
};

// Кольори для нових карток
const getCardColor = (currency, index) => {
  if (currency === 'EUR') return 3; // Blue
  if (currency === 'USD') return 0; // Black
  if (currency === 'GBP') return 4; // Grey
  if (currency === 'PLN') return 5; // Red
  return index % 4; // Default
}

const Overview = ({ email, onLogout, navigateTo, viewProps }) => {
  const [data, setData] = useState(null);
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setData(null);
      setBudget(null);
      setTransactions(null); 
      setError('');
      
      try {
        const [resData, resBudget, resTx] = await Promise.all([
          axios.get('/overview'),
          axios.get('/budget'),
          axios.get('/transactions')
        ]);
        
        setData(resData.data || { accounts: [], balances: { total: 0, crypto: 0, stocks: 0 } });
        setBudget(resBudget.data || { limit: 0, spent: 0 });
        setTransactions(resTx.data || []);

      } catch (err) {
        setError('Помилка завантаження даних');
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchData();
  }, [viewProps?.timestamp, onLogout]); 

  if (error) return <p className="error-message" style={{margin: '20px'}}>{error}</p>;

  if (!data || !budget || !transactions) {
    return <div className="page-container"><h1>Завантаження...</h1></div>;
  }
  
  const { accounts, balances } = data;
  
  if (!accounts || !balances) {
       return <div className="page-container"><h1>Помилка структури даних...</h1></div>;
  }
  
  const budgetProgress = (budget.limit > 0) ? (budget.spent / budget.limit) * 100 : 0;

  return (
    <div className="page-container">
      <div className="overview-header">
        <span className="welcome-text">Загальний баланс (EUR)</span>
        <span className="total-balance">
          {balances.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </span>
      </div>

      <div className="card-carousel">
        {accounts.map((acc, index) => (
          <div 
            key={acc.id} 
            className={`glass-card card-color-${getCardColor(acc.currency, index)} ${acc.status === 'frozen' ? 'frozen' : ''}`}
            onClick={() => navigateTo('cardDetails', { accountId: acc.id })}
          >
            <div className="card-header">
              <span className="card-type">{acc.type}</span>
              <div className="card-chip"></div>
            </div>
            <span className="card-balance">
              {acc.balance.toLocaleString('de-DE', { style: 'currency', currency: acc.currency })}
            </span>
            <div className="card-footer">
              <span className="card-currency-name">{acc.status === 'frozen' ? 'ЗАМОРОЖЕНО' : acc.currency}</span>
              <span className="card-number">... {acc.lastFour}</span>
            </div>
          </div>
        ))}
        
        {/* --- (НОВЕ v15.9) --- */}
        {/* Картка для додавання нового рахунку */}
        <div 
          className="add-account-card"
          onClick={() => navigateTo('openAccountModal', {})}
        >
          <span className="add-account-icon">+</span>
          <span className="add-account-text">Відкрити новий рахунок</span>
        </div>
        
      </div>

      <h3>Огляд</h3>
      <div className="balance-grid">
        <div className="balance-card" onClick={() => navigateTo('wealth')}>
          <span className="balance-icon">📈</span>
          <div className="balance-info">
            <span className="balance-title">Інвестиції</span>
            <span className="balance-amount">
              {(balances.crypto + balances.stocks).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>
      
      <div className="budget-widget" onClick={() => navigateTo('budget', {})}>
        <div className="budget-header">
          <span className="budget-spent">Витрачено: {budget.spent.toFixed(2)} €</span>
          <span className="budget-limit">Ліміт: {budget.limit} €</span>
        </div>
        <div className="budget-bar">
          <div className="budget-progress" style={{ width: `${budgetProgress}%` }}></div>
        </div>
      </div>

      <h3>Останні транзакції</h3>
      <ul className="transactions-list">
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map(tx => (
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
            Транзакцій ще немає. Почніть з поповнення!
          </p>
        )}
      </ul>
    </div>
  );
};

export default Overview;