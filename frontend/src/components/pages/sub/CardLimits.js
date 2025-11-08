// --- frontend/src/components/pages/sub/CardLimits.js (v15.1) ---
import React from 'react';

const CardLimits = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Ліміти картки</h1>
      <div className="placeholder-content">
        <span role="img" aria-label="chart">💳</span>
        <h2>Керування лімітами (v16)</h2>
        <p>
          Тут ви зможете встановити денні та місячні ліміти на покупки
          та зняття готівки, щоб краще контролювати свої витрати.
        </p>
      </div>
    </div>
  );
};
export default CardLimits;