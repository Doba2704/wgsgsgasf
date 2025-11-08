// --- (НОВИЙ ФАЙЛ) frontend/src/components/TransactionDetails.js (v16.9) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper-функція для повного формату дати
const formatFullDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TransactionDetails = ({ onBack, onLogout, transactionId }) => {
  const [tx, setTx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Стан для кнопки копіювання
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setError('Не вказано ID транзакції');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await axios.get(`/transactions/${transactionId}`);
        setTx(res.data);
      } catch (err) {
        setError('Не вдалося завантажити деталі транзакції');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId, onLogout]);

  // Логіка копіювання
  const handleCopyReceipt = () => {
    if (!tx) return;
    const isIncome = tx.amount > 0;
    
    // 1. Формуємо текстовий рядок
    const receiptText = `
--- Квитанція про операцію ---
Сума: ${isIncome ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('de-DE')} ${tx.currency}
Статус: ${isIncome ? 'Успішно зараховано' : 'Успішно виконано'}

--- Деталі ---
Від/Кому: ${tx.from}
Дата: ${formatFullDate(tx.date)}
Категорія: ${tx.category || 'Без категорії'}
Тип: ${tx.type}
ID: ${tx.id}
    `.trim().replace(/    /g, ''); // Очищуємо від зайвих відступів

    // 2. Використовуємо API буфера обміну
    navigator.clipboard.writeText(receiptText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Скидаємо стан кнопки
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Не вдалося скопіювати. Спробуйте вручну.');
      });
  };


  if (isLoading) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Завантаження квитанції...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Помилка</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="sub-page">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Квитанція</h1>
        <p>Транзакцію не знайдено.</p>
      </div>
    );
  }
  
  const isIncome = tx.amount > 0;

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Деталі операції</h1>
      
      <div className="receipt-container">
        <div className="receipt-header">
          <span className={`receipt-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('de-DE', { style: 'currency', currency: tx.currency })}
          </span>
          <span className="receipt-status success">
            {isIncome ? 'Успішно зараховано' : 'Успішно виконано'}
          </span>
        </div>
        
        <div className="receipt-body">
          <div className="receipt-row">
            <span>Отримувач / Відправник</span>
            <strong>{tx.from}</strong>
          </div>
          <div className="receipt-row">
            <span>Дата і час</span>
            <strong>{formatFullDate(tx.date)}</strong>
          </div>
           <div className="receipt-row">
            <span>Категорія</span>
            <strong>{tx.category || 'Без категорії'}</strong>
          </div>
           <div className="receipt-row">
            <span>Тип операції</span>
            <strong>{tx.type}</strong>
          </div>
        </div>
        
        <div className="receipt-footer">
          <span>ID Транзакції</span>
          <span>{tx.id}</span>
        </div>
      </div>
      
      {/* Кнопка копіювання */}
      <button 
        className="service-button"
        style={{marginTop: '20px', width: '100%'}} 
        onClick={handleCopyReceipt}
        disabled={isCopied}
      >
        <span className="service-icon">📄</span>
        {isCopied ? 'Скопійовано у буфер!' : 'Копіювати квитанцію (Текст)'}
      </button>

      {/* Кнопка "Повторити" */}
      <button 
        className="service-button secondary" 
        style={{marginTop: '10px', width: '100%'}} 
        onClick={() => alert('Повтор платежу (в розробці)...')}
      >
        <span className="service-icon">🔄</span>
        Повторити платіж
      </button>
      
    </div>
  );
};

export default TransactionDetails;