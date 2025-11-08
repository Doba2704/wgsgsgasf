// --- frontend/src/components/pages/sub/Budget.js (v15.1) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Budget = ({ onBack, onLogout }) => {
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/budget');
        setBudget(res.data || { limit: 0, spent: 0, categories: {} });
      } catch (err) {
        setError('Не вдалося завантажити дані бюджету');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudget();
  }, [onLogout]);

  if (isLoading) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Завантаження бюджету...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Бюджет</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }
  
  if (!budget) {
     return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Бюджет</h1>
        <p>Немає даних про бюджет.</p>
      </div>
    );
  }

  const { limit, spent, categories } = budget;
  const budgetProgress = (limit > 0) ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;
  
  const sortedCategories = Object.keys(categories).sort((a, b) => categories[b] - categories[a]);

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Бюджет</h1>
      <p className="page-description">
        Ваш контроль над витратами за поточний місяць (EUR).
      </p>

      <div className="budget-widget">
        <div className="budget-header">
          <span className="budget-spent">Витрачено: {spent.toFixed(2)} €</span>
          <span className="budget-limit">Ліміт: {limit.toFixed(2)} €</span>
        </div>
        <div className="budget-bar">
          <div className="budget-progress" style={{ width: `${budgetProgress.toFixed(2)}%` }}></div>
        </div>
      </div>
      
      <div className="balance-card" style={{marginTop: '15px'}}>
        <span className="balance-icon">💰</span>
        <div className="balance-info">
          <span className="balance-title">Залишилось у ліміті</span>
          <span className="balance-amount" style={{color: remaining >= 0 ? 'var(--success)' : 'var(--error)'}}>
            {remaining.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </div>
      
      <h3>Витрати за категоріями</h3>
      
      {sortedCategories.length > 0 ? (
        <ul className="transactions-list">
          {sortedCategories.map(key => (
            <li key={key} className="transaction-item">
              <span className="transaction-icon">
                {key === 'Їжа' ? '🍔' : (key === 'Транспорт' ? '🚗' : '🛒')}
              </span>
              <div className="transaction-details">
                <strong>{key}</strong>
              </div>
              <span className="transaction-amount expense">
                -{categories[key].toFixed(2)} €
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0'}}>
            Витрат у цьому місяці ще не було.
        </p>
      )}
      
    </div>
  );
};

export default Budget;