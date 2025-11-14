// --- (ЗАМІНИТИ) frontend/src/index.js (v18.6) ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';
import axios from 'axios';

// (НОВЕ v18.6) - "Розумне" налаштування URL
// Це перевіряє, чи запущений код на Render ('production')
if (process.env.NODE_ENV === 'production') {
  // 1. ВСТАВТЕ СЮДИ URL ВАШОГО БЕК-ЕНДУ (bank-api)
  axios.defaults.baseURL = 'https://bank-api-xyz.onrender.com'; // <--- ЗАМІНІТЬ ЦЕ
}
// Якщо ми на 'development' (локально), axios автоматично 
// використає "proxy" з package.json

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);