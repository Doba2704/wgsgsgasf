// --- (ЗАМІНИТИ) frontend/src/components/Transactions.js (v17.2 - РОБОЧА ВЕРСІЯ) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper-функція для форматування дати
const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });
};

// Компонент одного елементу списку
const TransactionItem = ({ tx, onClick }) => {
  const isIncome = tx.amount > 0;
  return (
    <li className="transaction-item" onClick={() => onClick(tx.id)}>
      <div className="transaction-icon">
        <span>{isIncome ? '📥' : '📤'}</span>
      </div>
      <div className="transaction-details">
        <strong>{tx.from}</strong>
        <span>{tx.category || 'Без категорії'} • {formatDate(tx.date)}</span>
      </div>
      <span className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
        {isIncome ? '+' : ''}{tx.amount.toLocaleString('de-DE')} {tx.currency}
      </span>
    </li>
  );
};

// Головний компонент сторінки
const Transactions = ({ onLogout, navigateTo }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Завантаження даних
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        setError('Не вдалося завантажити історію транзакцій');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [onLogout]);
  
  const handleTxClick = (id) => {
    // Функція навігації, яку ми отримуємо з Dashboard.js
    navigateTo('transactionDetails', { transactionId: id });
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>Завантаження історії...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    if (transactions.length === 0) {
      return <p>Історія транзакцій порожня.</p>;
    }
    return (
      <ul className="transactions-list">
        {transactions.map(tx => (
          <TransactionItem key={tx.id} tx={tx} onClick={handleTxClick} />
        ))}
      </ul>
    );
  };

  return (
    <div className="page-container">
      <h1>Історія операцій</h1>
      
      {/* Тут могли б бути фільтри (у майбутньому) */}
      
      {renderContent()}
    </div>
  );
};

export default Transactions;