// --- (ЗАМІНИТИ) frontend/src/components/Auth.js (v18.5) ---
import React, { useState } from 'react';
import axios from 'axios';

// (ОНОВЛЕНО v18.5) - 'onLogin' тепер очікує (email, token)
const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const url = isLogin ? '/login' : '/register';
    try {
      const res = await axios.post(url, { email, password });
      
      // (ОНОВЛЕНО v18.5) - Отримуємо токен з відповіді
      const { token } = res.data;
      
      if (res.data.success && token) {
        // Передаємо email І токен
        onLogin(email, token);
      } else {
        setError(res.data.error || 'Невідома помилка');
      }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка мережі. Спробуйте пізніше.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Вхід у Банк' : 'Створити акаунт'}</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={3} // (Мінімальна довжина)
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Завантаження...' : (isLogin ? 'Увійти' : 'Зареєструватись')}
        </button>
      </form>
      <div className="toggle-form" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
        {isLogin ? 'Не маєте акаунту? Зареєструватись.' : 'Вже маєте акаунт? Увійти.'}
      </div>
    </div>
  );
};

export default Auth;