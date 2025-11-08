// --- frontend/src/components/pages/sub/VirtualCards.js (v15.1) ---
import React from 'react';

const VirtualCards = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Віртуальні картки</h1>
      <p className="page-description">
        Створюйте картки для безпечних онлайн-покупок.
      </p>
       <div className="placeholder-content">
        <span role="img" aria-label="construct">🚀</span>
        <h2>Функція на зльоті (v16)</h2>
        <p>
          Ми вже працюємо над миттєвим випуском віртуальних карток. <br/>
          Очікуйте у наступній версії!
        </p>
      </div>
    </div>
  );
};

export default VirtualCards;