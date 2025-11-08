// --- (НОВИЙ ФАЙЛ) frontend/src/components/CardTariff.js (v18.0) ---
import React, { useState } from 'react';
import axios from 'axios';

const TariffOption = ({ title, description, isSelected, onSelect }) => {
  return (
    <div 
      className={`currency-option ${isSelected ? 'selected' : ''}`} 
      onClick={onSelect}
      style={{ borderColor: isSelected ? 'var(--brand-color)' : 'var(--border-color)', borderWidth: '2px', background: isSelected ? 'rgba(0, 82, 255, 0.05)' : 'var(--card-bg)'}}
    >
      <div className="currency-info">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
};

const CardTariff = ({ onBack, onLogout, onUpdate, accountId, currentTariff }) => {
  const [selectedTariff, setSelectedTariff] = useState(currentTariff);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (selectedTariff === currentTariff) {
      onBack(); // Якщо нічого не змінилося, просто повертаємось
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`/accounts/${accountId}/change-tariff`, {
        newTariff: selectedTariff,
      });
      onUpdate(); // Оновлюємо дані (баланс)
      onBack();   // Повертаємось на попередню сторінку
    } catch (err) {
      setError('Не вдалося змінити тариф');
      if (err.response?.status === 401) onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Зміна тарифу</h1>
      <p className="page-description">Оберіть новий план для вашої картки</p>
      
      {error && <p className="error-message">{error}</p>}

      <div className="currency-selection-list">
        <TariffOption
          title="Standard"
          description="0€/міс. Базові функції та безкоштовні перекази."
          isSelected={selectedTariff === 'Standard'}
          onSelect={() => setSelectedTariff('Standard')}
        />
        <TariffOption
          title="Premium"
          description="9.99€/міс. Страхування та ексклюзивні картки."
          isSelected={selectedTariff === 'Premium'}
          onSelect={() => setSelectedTariff('Premium')}
        />
        <TariffOption
          title="Metal"
          description="15.99€/міс. Металева картка та кешбек 1%."
          isSelected={selectedTariff === 'Metal'}
          onSelect={() => setSelectedTariff('Metal')}
        />
      </div>
      
      <button 
        style={{marginTop: '30px'}} 
        onClick={handleSubmit} 
        disabled={isLoading || selectedTariff === currentTariff}
      >
        {isLoading ? 'Оновлення...' : 'Підтвердити'}
      </button>
    </div>
  );
};

export default CardTariff;