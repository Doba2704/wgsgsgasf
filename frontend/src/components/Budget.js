// --- (ЗАМІНИТИ) frontend/src/components/Budget.js (v18.0) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Компонент для одного рядка категорії
const BudgetCategory = ({ name, amount, total, color }) => {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="budget-category-item" style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <strong>{name}</strong>
        <span>{amount.toLocaleString('de-DE')} €</span>
      </div>
      <div className="budget-bar">
        <div 
          className="budget-progress" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

const Budget = ({ onLogout }) => {
  const [data, setData] = useState({ totalSpent: 0, limit: 1500, categories: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/budget');
        setData(res.data);
      } catch (err) {
        setError('Не вдалося завантажити дані бюджету');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout]);

  if (isLoading) return <p>Завантаження бюджету...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const spent = data.totalSpent;
  const limit = data.limit;
  const remaining = limit - spent;
  const progress = (spent / limit) * 100;

  const categoryColors = ['#0052FF', '#FF9500', '#34C759', '#FF3B30', '#5856D6'];

  return (
    <div className="page-container">
      <h1>Бюджет</h1>
      <p className="page-description">Витрати за Поточний Місяць</p>

      <div className="budget-widget">
        <div className="budget-header">
          <span className="budget-spent">Витрачено: {spent.toLocaleString('de-DE')} €</span>
          <span className="budget-limit">Ліміт: {limit.toLocaleString('de-DE')} €</span>
        </div>
        <div className="budget-bar">
          <div className="budget-progress" style={{ width: `${progress > 100 ? 100 : progress}%` }}></div>
        </div>
        <p style={{marginTop: '10px', fontWeight: '500'}}>
          Залишилось: {remaining.toLocaleString('de-DE')} €
        </p>
      </div>
      
      <h3>Витрати за категоріями</h3>
      <div>
        {Object.entries(data.categories).map(([name, amount], index) => (
          <BudgetCategory 
            key={name}
            name={name}
            amount={amount}
            total={spent}
            color={categoryColors[index % categoryColors.length]}
          />
        ))}
        {Object.keys(data.categories).length === 0 && (
          <p>Цього місяця витрат ще не було.</p>
        )}
      </div>
    </div>
  );
};

export default Budget;