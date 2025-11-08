// --- frontend/src/components/pages/Wealth.js (v15.1) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wealth = ({ onLogout }) => {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/wealth');
        setData(res.data); 
        setError('');
      } catch (err) {
        setError('Не вдалося завантажити активи');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout]); 

  if (isLoading) {
    return <div className="page-container"><h1>Завантаження активів...</h1></div>;
  }

  if (error) {
    return <div className="page-container"><h1>Активи</h1><p className="error-message">{error}</p></div>;
  }

  if (!data || !Array.isArray(data.crypto) || !Array.isArray(data.stocks)) {
     return <div className="page-container"><h1>Активи</h1><p className="error-message">Не вдалося обробити дані про активи.</p></div>;
  }

  const totalCrypto = data.crypto.reduce((sum, asset) => sum + (asset.amount * asset.current_price), 0);
  const totalStocks = data.stocks.reduce((sum, stock) => sum + (stock.amount * stock.current_price), 0);
  const totalWealth = totalCrypto + totalStocks;

  const renderAssetList = (assets, isCrypto = false) => {
    if (assets.length === 0) {
      return (
         <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0'}}>
           У вас ще немає цих активів.
         </p>
      );
    }
    
    return assets.map(asset => {
      const currentValue = asset.amount * asset.current_price;
      const avgValue = asset.amount * asset.avg_price;
      const profit = currentValue - avgValue;
      const profitPercent = (avgValue > 0) ? (profit / avgValue) * 100 : 0;

      return (
        <li key={asset.id} className="transaction-item">
          <span className="transaction-icon">{isCrypto ? '₿' : '📈'}</span>
          <div className="transaction-details">
            <strong>{asset.name}</strong>
            <span>{asset.amount.toFixed(isCrypto ? 6 : 2)} {isCrypto ? asset.id.toUpperCase() : 'акцій'}</span>
          </div>
          <div className="transaction-details" style={{textAlign: 'right'}}>
            <strong>
              {currentValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </strong>
            <span className={profit >= 0 ? 'income' : 'expense'} style={{color: profit >= 0 ? 'var(--success)' : 'var(--error)'}}>
              {profit >= 0 ? '+' : ''}{profit.toFixed(2)}€ ({profitPercent.toFixed(2)}%)
            </span>
          </div>
        </li>
      );
    });
  };

  return (
    <div className="page-container">
      <h1>Активи</h1>
      <p className="page-description">
        Загальна вартість: 
        <strong style={{color: 'var(--text-primary)', marginLeft: '5px'}}>
           {totalWealth.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </strong>
      </p>
      
      <h3>Криптовалюта ({totalCrypto.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})</h3>
      <ul className="transactions-list">
        {renderAssetList(data.crypto, true)}
      </ul>
      
      <h3>Акції ({totalStocks.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})</h3>
      <ul className="transactions-list">
        {renderAssetList(data.stocks, false)}
      </ul>
    </div>
  );
};

export default Wealth;