// --- frontend/src/components/PINModal.js (ПРАВИЛЬНИЙ КОД) ---
import React, { useState } from 'react';
import axios from 'axios';

const PINModal = ({ mode, onUnlock, onPinCreated, onClose }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePinInput = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleConfirmInput = (num) => {
    if (confirmPin.length < 4) {
      setConfirmPin(confirmPin + num);
    }
  };

  const handleDelete = () => setPin(pin.slice(0, -1));
  const handleConfirmDelete = () => setConfirmPin(confirmPin.slice(0, -1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'create') {
      // --- Логіка Створення ---
      if (pin.length !== 4) { setError('PIN має бути 4 цифри'); return; }
      if (pin !== confirmPin) { setError('PIN-коди не співпадають'); return; }
      try {
        await axios.post('/pin/setup', { password, pin });
        onPinCreated(); // Повідомляємо App.js, що PIN створено
      } catch (err) {
        setError(err.response?.data?.message || 'Помилка');
      }
      
    } else {
      // --- Логіка Перевірки ---
      if (pin.length !== 4) { setError('PIN має бути 4 цифри'); return; }
      try {
        await axios.post('/pin/verify', { pin });
        onUnlock(); // Розблоковуємо додаток/дію
      } catch (err) {
        setError(err.response?.data?.message || 'Невірний PIN-код');
        setPin(''); // Очищуємо PIN
      }
    }
  };

  const renderDots = (value) => {
    let dots = '';
    for (let i = 0; i < 4; i++) {
      dots += i < value.length ? '●' : '○';
    }
    return dots;
  };

  const Numpad = ({ onInput, onDelete }) => (
    <div className="numpad-grid">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map(key => (
        <button 
          key={key} 
          type="button" 
          className="numpad-key" 
          onClick={() => {
            if (key === '⌫') onDelete();
            else if (key === 'C') { setPin(''); setConfirmPin(''); }
            else onInput(key);
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );

  return (
    <div className="modal-overlay pin-modal-overlay">
      <div className="modal-content pin-modal-content">
        {onClose && (
          <button onClick={onClose} className="modal-close-button" style={{color: 'var(--text-primary)'}}>×</button>
        )}
        
        <h2>{mode === 'create' ? 'Створити PIN-код' : 'Введіть PIN-код'}</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}
          
          {mode === 'create' && (
            <input 
              type="password" 
              placeholder="Ваш пароль від акаунту" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{marginBottom: '15px'}}
            />
          )}

          <div className="pin-dots">{renderDots(pin)}</div>
          <Numpad onInput={handlePinInput} onDelete={handleDelete} />
          
          {mode === 'create' && (
            <>
              <h3 style={{marginTop: '20px'}}>Підтвердіть PIN-код</h3>
              <div className="pin-dots">{renderDots(confirmPin)}</div>
              <Numpad onInput={handleConfirmInput} onDelete={handleConfirmDelete} />
            </>
          )}
          
          <button type="submit" style={{marginTop: '20px'}}>
            {mode === 'create' ? 'Створити' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PINModal;