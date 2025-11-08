// --- (ЗАМІНИТИ) frontend/src/components/OpenAccountModal.js (v18.1) ---
import React, { useState } from 'react';
import axios from 'axios';

// Компонент для вибору
const OptionSelector = ({ title, description, isSelected, onSelect }) => {
  return (
    <div 
      className={`currency-option ${isSelected ? 'selected' : ''}`} 
      onClick={onSelect}
      style={{ 
        borderColor: isSelected ? 'var(--brand-color)' : 'var(--border-color)', 
        borderWidth: '2px', 
        background: isSelected ? 'rgba(0, 82, 255, 0.05)' : 'var(--card-bg)'
      }}
    >
      <div className="currency-info">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
};

const OpenAccountModal = ({ onClose, onLogout, onUpdate }) => {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState('EUR');
  const [tariff, setTariff] = useState('Standard');
  const [accountName, setAccountName] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Перевірка на останньому кроці
    if (accountName.trim() === '') {
       setError('Будь ласка, введіть назву рахунку');
       return;
    }
    
    setIsLoading(true);

    try {
      await axios.post('/open-account', {
        currency: currency,
        name: accountName,
        tariff: tariff,
      });
      onUpdate(); // Оновлюємо дані на головній сторінці (щоб з'явилася нова картка)
      onClose();  // Закриваємо модальне вікно
    } catch (err) {
      setError('Помилка відкриття рахунку. Спробуйте пізніше.');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1: // Крок 1: Вибір Валюти
        return (
          <>
            <h2>Оберіть валюту</h2>
            <div className="currency-selection-list">
              <OptionSelector
                title="EUR (Євро)"
                description="Основний рахунок для платежів в ЄС"
                isSelected={currency === 'EUR'}
                onSelect={() => setCurrency('EUR')}
              />
              <OptionSelector
                title="USD (Долар США)"
                description="Для міжнародних розрахунків"
                isSelected={currency === 'USD'}
                onSelect={() => setCurrency('USD')}
              />
              <OptionSelector
                title="UAH (Гривня)"
                description="Для платежів в Україні"
                isSelected={currency === 'UAH'}
                onSelect={() => setCurrency('UAH')}
              />
            </div>
            <button style={{marginTop: '20px'}} onClick={() => setStep(2)}>Далі</button>
          </>
        );
      case 2: // Крок 2: Вибір Тарифу
        return (
          <>
            <h2>Оберіть тариф</h2>
            <div className="currency-selection-list">
              <OptionSelector
                title="Standard"
                description="0€/міс. Базові функції."
                isSelected={tariff === 'Standard'}
                onSelect={() => setTariff('Standard')}
              />
              <OptionSelector
                title="Premium"
                description="9.99€/міс. Страхування."
                isSelected={tariff === 'Premium'}
                onSelect={() => setTariff('Premium')}
              />
              <OptionSelector
                title="Metal"
                description="15.99€/міс. Металева картка."
                isSelected={tariff === 'Metal'}
                onSelect={() => setTariff('Metal')}
              />
            </div>
            <button style={{marginTop: '20px'}} onClick={() => setStep(3)}>Далі</button>
            <button style={{marginTop: '10px'}} className="secondary" onClick={() => setStep(1)}>Назад</button>
          </>
        );
      case 3: // Крок 3: Назва та Підтвердження
        return (
          <>
            <h2>Завершення</h2>
            <form className="service-form" onSubmit={handleSubmit}>
              <label>Назва рахунку</label>
              <input 
                type="text" 
                placeholder="Напр. 'Основна картка' або 'На відпустку'"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
              
              <ul style={{fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '20px'}}>
                <li>Валюта: <strong>{currency}</strong></li>
                <li>Тариф: <strong>{tariff}</strong></li>
              </ul>
              
              {error && <p className="error-message">{error}</p>}
              
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Відкриття...' : 'Відкрити рахунок'}
              </button>
              <button style={{marginTop: '10px'}} className="secondary" onClick={() => setStep(2)}>Назад</button>
            </form>
          </>
        );
      default:
        return <p>Невідомий крок</p>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">&times;</button>
        {renderStep()}
      </div>
    </div>
  );
};

export default OpenAccountModal;