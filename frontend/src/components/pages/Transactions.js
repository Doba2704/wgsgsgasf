// --- frontend/src/components/pages/Transactions.js (ПОВНІСТЮ ЗАМІНИТИ) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- (Ф-16) Компонент Статистики ---
const Statistics = ({ onLogout }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/statistics');
        setChartData(res.data);
      } catch (err) {
        setError('Помилка завантаження статистики');
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchStats();
  }, [onLogout]);

  if (error) return <p className="error-message">{error}</p>;
  if (!chartData || chartData.data.length === 0) return <p>Недостатньо даних для статистики.</p>;
  
  const total = chartData.data.reduce((a, b) => a + b, 0);

  return (
    <div className="statistics-container">
      <h3>Витрати за категоріями</h3>
      <div className="chart-mock">
        {chartData.labels.map((label, index) => {
          const percent = (chartData.data[index] / total) * 100;
          return (
            <div key={label} className="chart-bar-wrapper">
              <span className="chart-label">{label} ({chartData.data[index].toFixed(2)} EUR)</span>
              <div className="chart-bar" style={{ width: `${percent}%`, background: `hsl(${index * 60}, 70%, 50%)` }}>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Компонент Списку Транзакцій ---
const TransactionList = ({ onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Помилка');
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchTransactions();
  }, [onLogout]);

  if (error) return <p className="error-message">{error}</p>;
  
  return (
    <ul className="transactions-list">
      {transactions.length > 0 ? transactions.map(t => (
        <li key={t.id} className="transaction-item">
          <div className={`transaction-amount ${t.type === 'Поповнення' ? 'income' : 'expense'}`}>
            {t.type === 'Поповнення' ? '+' : '-'}
            {t.amount.toFixed(2)} {t.currency}
          </div>
          <div className="transaction-details">
            <strong>{t.from}</strong>
            <span>{t.type} · {new Date(t.date).toLocaleDateString()}</span>
          </div>
        </li>
      )) : <p>У вас ще немає транзакцій.</p>}
    </ul>
  );
};

// --- Головний компонент ---
const Transactions = ({ onLogout }) => {
  const [view, setView] = useState('list');
  return (
    <div className="page-container">
      <h1>Історія</h1>
      <div className="segmented-control">
        <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>Список</button>
        <button onClick={() => setView('stats')} className={view === 'stats' ? 'active' : ''}>Статистика (Ф-16)</button>
      </div>
      {view === 'list' ? <TransactionList onLogout={onLogout} /> : <Statistics onLogout={onLogout} />}
    </div>
  );
};

export default Transactions;