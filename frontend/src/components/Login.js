// --- frontend/src/components/Login.js (v15.1) ---
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    clearForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const url = isRegister ? '/register' : '/login';
    const payload = isRegister ? { email, password, name } : { email, password };

    try {
      const res = await axios.post(url, payload);
      if (res.data && res.data.token) {
        onLoginSuccess(res.data);
      } else {
        setError('Помилка: Не отримано токен від сервера.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
      } else {
        setError('Невідома помилка. Перевірте консоль.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Створити акаунт' : 'Вхід у Банк'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        
        {isRegister && (
          <input
            type="text"
            placeholder="Ваше ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Завантаження...' : (isRegister ? 'Зареєструватись' : 'Увійти')}
        </button>
        
      </form>
      <div className="toggle-form" onClick={toggleForm}>
        {isRegister ? 'Вже маєте акаунт? Увійти.' : 'Немає акаунту? Зареєструватись.'}
      </div>
    </div>
  );
};

export default Login;