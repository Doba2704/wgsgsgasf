// --- frontend/src/components/pages/Services.js (v15.1) ---
import React from 'react';

const Services = ({ navigateTo }) => {
  return (
    <div className="page-container">
      <h1>Сервіси</h1>
      <p className="page-description">
        Всі можливості вашого банку в одному місці.
      </p>
      
      <h3>Рахунки</h3>
      <div className="service-grid">
         {/* --- (НОВЕ v15.0) --- */}
        <button className="service-button" onClick={() => navigateTo('openAccountModal')}>
          <span className="service-icon">🌍</span>
          Відкрити рахунок
        </button>
        <button className="service-button" onClick={() => navigateTo('deposit')}>
          <span className="service-icon">💰</span>
          Поповнити рахунок
        </button>
      </div>
      
      <h3>Продукти</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => navigateTo('pockets')}>
          <span className="service-icon">🏦</span>
          Кишені (Pockets)
        </button>
        <button className="service-button" onClick={() => navigateTo('virtualCards')}>
          <span className="service-icon">📱</span>
          Віртуальні картки
        </button>
      </div>
      
      <h3>Платежі</h3>
       <div className="service-grid">
        <button className="service-button" onClick={() => navigateTo('scheduledPayments')}>
          <span className="service-icon">📅</span>
          Автоплатежі
        </button>
         <button className="service-button" onClick={() => navigateTo('budget')}>
          <span className="service-icon">📉</span>
          Бюджет
        </button>
      </div>

      <h3>Допомога</h3>
      <div className="service-grid">
         <button className="service-button" onClick={() => navigateTo('support')}>
          <span className="service-icon">💬</span>
          Підтримка 24/7
        </button>
      </div>
    </div>
  );
};

export default Services;