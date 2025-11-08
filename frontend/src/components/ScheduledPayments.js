// --- frontend/src/components/pages/sub/ScheduledPayments.js (v15.1) ---
import React from 'react';

const ScheduledPayments = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Автоплатежі</h1>
      <p className="page-description">
        Налаштуйте регулярні платежі один раз.
      </p>
      <div className="placeholder-content">
        <span role="img" aria-label="construct">📅</span>
        <h2>Розділ у розробці (v16)</h2>
        <p>
          Автоматизуйте свої регулярні платежі (комуналка, інтернет) та забудьте про них. <br/>
          Скоро тут.
        </p>
      </div>
    </div>
  );
};

export default ScheduledPayments;