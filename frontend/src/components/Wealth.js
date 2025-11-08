// --- (ЗАМІНИТИ) frontend/src/components/Wealth.js (v18.0 - "Сервіси") ---
import React from 'react';

// Ми перейменували "Активи" (Wealth) на "Сервіси"
// щоб реалізувати вашу ідею "багатьох способів платежу"

const Wealth = ({ navigateTo }) => {

  const handlePayment = (type) => {
    // Відкриваємо модальне вікно оплати, передаючи категорію
    navigateTo('payBillModal', { paymentCategory: type });
  };

  return (
    <div className="page-container">
      <h1>Платежі та Сервіси</h1>

      <h3>Комунальні платежі</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => handlePayment('Електроенергія')}>
          <span className="service-icon">💡</span>
          Електроенергія
        </button>
        <button className="service-button" onClick={() => handlePayment('Газопостачання')}>
          <span className="service-icon">🔥</span>
          Газ
        </button>
        <button className="service-button" onClick={() => handlePayment('Водопостачання')}>
          <span className="service-icon">💧</span>
          Вода
        </button>
        <button className="service-button" onClick={() => handlePayment('Інтернет')}>
          <span className="service-icon">🌐</span>
          Інтернет
        </button>
      </div>

      <h3>Мобільний зв'язок</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => handlePayment('Моб. поповнення')}>
          <span className="service-icon">📱</span>
          Поповнити мобільний
        </button>
      </div>
      
      <h3>Інші послуги</h3>
      <div className="service-grid">
        <button className="service-button" onClick={() => navigateTo('transferModal')}>
          <span className="service-icon">🔁</span>
          Переказ за email
        </button>
        <button className="service-button" onClick={() => navigateTo('depositModal')}>
          <span className="service-icon">📥</span>
          Поповнити картку
        </button>
        <button className="service-button" onClick={() => navigateTo('exchangeModal')}>
          <span className="service-icon">💱</span>
          Обмін валют
        </button>
      </div>
    </div>
  );
};

export default Wealth;