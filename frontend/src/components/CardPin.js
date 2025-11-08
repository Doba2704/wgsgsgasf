// --- (ЗАМІНА) frontend/src/components/pages/sub/CardPin.js (v15.9) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardPin = ({ onBack, onLogout, accountId }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!accountId) {
        setError('Не вказано ID картки');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await axios.get(`/accounts/${accountId}/details`);
        setDetails(res.data);
      } catch (err) {
        setError('Не вдалося завантажити деталі картки');
        if (err.response?.status === 401) onLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [accountId, onLogout]);

  const renderContent = () => {
    if (isLoading) {
      return <p>Завантаження секретних даних...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    if (!details) {
      return <p>Дані не знайдено.</p>;
    }
    
    return (
      <div className="secure-card-details">
        <div 
          className={`secure-card-overlay ${isRevealed ? 'revealed' : ''}`}
          onClick={() => setIsRevealed(true)}
        >
          {!isRevealed && (
            <div className="reveal-prompt">
              <span className="reveal-icon">👁️</span>
              <strong>Натисніть, щоб побачити</strong>
              <span>(Не показуйте нікому ці дані)</span>
            </div>
          )}
        </div>
        
        <div className="secure-card-row">
          <span>Номер картки</span>
          <strong>{details.cardNumber}</strong>
        </div>
        <div className="secure-card-row half">
          <span>Термін дії</span>
          <strong>{details.expiryDate}</strong>
        </div>
         <div className="secure-card-row half">
          <span>CVC</span>
          <strong>{details.cvc}</strong>
        </div>
        <div className="secure-card-row">
          <span>PIN-код</span>
          <strong>{details.pin}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">←</button>
      <h1>Деталі картки</h1>
      <p className="page-description">
        Це ваші конфіденційні дані. Не діліться ними ні з ким.
      </p>
      {renderContent()}
    </div>
  );
};

export default CardPin;