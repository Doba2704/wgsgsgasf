// --- frontend/src/components/pages/sub/CardSecurity.js (v15.1) ---
import React from 'react';

const CardSecurity = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Безпека картки</h1>
      <div className="placeholder-content">
        <span role="img" aria-label="shield">🛡️</span>
        <h2>Центр Безпеки (v16)</h2>
        <p>
          Тут ви зможете керувати налаштуваннями:
          <br />- Онлайн-платежі (вкл/викл)
          <br />- Безконтактна оплата (NFC)
          <br />- Зняття готівки у банкоматах
        </p>
      </div>
    </div>
  );
};
export default CardSecurity;