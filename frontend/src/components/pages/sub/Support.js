// --- frontend/src/components/pages/sub/Support.js (v15.1) ---
import React from 'react';

const Support = ({ onBack }) => {
  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Підтримка 24/7</h1>
      <p className="page-description">
        Ми завжди готові допомогти вам.
      </p>

      <div className="settings-list">
        <div className="settings-item" onClick={() => alert('Відкриття чату...')}>
          <div className="settings-item-info">
            <span role="img" aria-label="chat">💬</span>
            <strong>Live Chat (Telegram)</strong>
          </div>
          <span className="arrow">›</span>
        </div>
        <div className="settings-item" onClick={() => alert('Дзвінок...')}>
          <div className="settings-item-info">
            <span role="img" aria-label="phone">📞</span>
            <strong>Подзвонити нам</strong>
          </div>
          <span className="arrow">›</span>
        </div>
        <div className="settings-item" onClick={() => window.location.href = 'mailto:support@bank.com'}>
          <div className="settings-item-info">
            <span role="img" aria-label="mail">✉️</span>
            <strong>Написати на Email</strong>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>
      
       <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        marginTop: '30px',
        color: 'var(--text-secondary)'
      }}>
        <span style={{fontSize: '32px'}} role="img" aria-label="faq">💡</span>
        <h3 style={{color: 'var(--text-primary)'}}>База знань (FAQ)</h3>
        <p>
          Розділ із відповідями на часті запитання з'явиться тут незабаром.
        </p>
      </div>
    </div>
  );
};

export default Support;