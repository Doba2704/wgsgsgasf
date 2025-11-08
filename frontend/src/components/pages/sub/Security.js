// --- frontend/src/components/pages/sub/Security.js (v15.1) ---
import React from 'react';

const Security = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Безпека</h1>
      <div className="placeholder-content">
        <span role="img" aria-label="shield">🛡️</span>
        <h2>Центр Безпеки Акаунту (v16)</h2>
        <p>
          Тут ви зможете керувати своїм паролем,
          двофакторною аутентифікацією (2FA) та переглядати активні сесії.
        </p>
      </div>
    </div>
  );
};

export default Security;