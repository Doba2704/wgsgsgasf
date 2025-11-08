// --- frontend/src/components/pages/sub/Pockets.js (v15.1) ---
import React from 'react';

const Pockets = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Кишені (Pockets)</h1>
      <p className="page-description">
        Автоматично відкладайте гроші на ваші цілі.
      </p>
      <div className="placeholder-content">
        <span role="img" aria-label="construct">🏦</span>
        <h2>Розділ у розробці (v16)</h2>
        <p>
          "Кишені" (аналог "Банок" у Monobank) з'являться у наступній версії. 
          Ви зможете створювати цілі та автоматично накопичувати на них.
        </p>
      </div>
    </div>
  );
};

export default Pockets;