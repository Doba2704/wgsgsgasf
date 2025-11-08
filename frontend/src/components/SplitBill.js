// --- frontend/src/components/pages/sub/SplitBill.js (v15.1) ---
import React from 'react';

const SplitBill = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Розділити чек</h1>
      <p className="page-description">
        Легко розділяйте рахунки з ресторанів чи поїздок.
      </p>
       <div className="placeholder-content">
        <span role="img" aria-label="construct">⚖️</span>
        <h2>Розділити рахунок (v16)</h2>
        <p>
          Функція, що дозволить вам вибрати транзакцію та "розкидати" її вартість
          між друзями, вже у розробці.
        </p>
      </div>
    </div>
  );
};

export default SplitBill;