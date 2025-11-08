// --- frontend/src/components/pages/sub/EditProfile.js (ВИПРАВЛЕНО v15.1) ---
import React, { useState } from 'react';
import axios from 'axios';

const EditProfile = ({ onBack, currentName, onUpdateName, onUpdate }) => {
  const [name, setName] = useState(currentName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.put('/profile', { name });
      setSuccess(res.data.message || 'Ім\'я оновлено');
      onUpdateName(res.data.name); 
      
      setTimeout(() => {
        onUpdate(); 
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Помилка оновлення');
      setIsLoading(false);
    }
  };

  return (
    <div className="sub-page">
      <button onClick={onBack} className="back-button">← Назад</button>
      <h1>Особисті дані</h1>
      <p className="page-description">
        Змініть ваше ім'я, яке бачать інші.
      </p>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form className="service-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Ваше ім'я:</label>
        <input 
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Збереження...' : 'Зберегти зміни'}
        </button>
      </form>
    </div>
  );
};
export default EditProfile;