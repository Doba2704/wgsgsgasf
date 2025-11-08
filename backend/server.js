// --- (ЗАМІНИТИ) bank-project/backend/server.js (v18.5 - JWT АУТЕНТИФІКАЦІЯ) ---
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // <-- (НОВЕ v18.5)
const app = express();
const PORT = 5000;

// (НОВЕ v18.5) - Секретний ключ для підпису токенів
const JWT_SECRET = 'my-super-secret-key-12345'; 

app.use(cors());
app.use(express.json());

// --- Наша "Фейкова" База Даних ---
let db = {
  users: [
    { 
      id: 'u1', 
      email: 'user@gmail.com', 
      password: '123', 
      name: 'Alex D.',
      phone: '+380 99 123 4567',
      address: 'м. Київ, вул. Хрещатик, 1'
    }
  ],
  accounts: [], 
  transactions: [] 
};
let nextTxId = 1;
let nextAccId = 1;
let nextUserId = 2;
// --- Кінець Фейкової Бази Даних ---

// (ОНОВЛЕНО v18.5 - Повертає ТОКЕН)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (user) {
    // Створюємо токен
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, message: 'Вхід успішний', email: user.email, token: token });
  } else {
    res.status(401).json({ success: false, error: 'Неправильний email або пароль' });
  }
});

// (ОНОВЛЕНО v18.5 - Повертає ТОКЕН)
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'Цей email вже зареєстрований' });
  }
  const newUser = {
    id: `u${nextUserId++}`,
    email: email,
    password: password, 
    name: email.split('@')[0],
    phone: '',
    address: ''
  };
  db.users.push(newUser);
  
  // Створюємо токен
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, message: 'Реєстрація успішна', email: newUser.email, token: token });
});

// (НОВЕ v18.5 - Мідлвар для перевірки токену)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // Немає токену

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Неправильний токен
    req.userId = user.id; // <-- Зберігаємо ID користувача в запиті
    next();
  });
};

// --- ЗАХИЩЕНІ ЕНДПОІНТИ ---
// (Тепер всі вони будуть використовувати verifyToken)

// (ОНОВЛЕНО v18.5 - Використовує req.userId)
app.get('/profile', verifyToken, (req, res) => {
  const user = db.users.find(u => u.id === req.userId); 
  if (user) {
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      memberSince: '2025-10-01T10:00:00Z' 
    });
  } else {
    res.status(404).json({ error: 'Користувача не знайдено' });
  }
});

// (ОНОВЛЕНО v18.5 - Використовує req.userId)
app.get('/accounts', verifyToken, (req, res) => {
  const userAccounts = db.accounts.filter(a => a.userId === req.userId);
  res.json(userAccounts);
});

// (Ендпоінт для ОДНОГО рахунку)
app.get('/accounts/:id', verifyToken, (req, res) => {
  const account = db.accounts.find(a => a.id === req.params.id && a.userId === req.userId);
  if (account) {
    res.json(account);
  } else {
    res.status(404).json({ error: 'Рахунок не знайдено' });
  }
});

// (Функція "Змінити тариф")
app.post('/accounts/:id/change-tariff', verifyToken, (req, res) => {
  const { newTariff } = req.body;
  const account = db.accounts.find(a => a.id === req.params.id && a.userId === req.userId);
  if (!account) return res.status(404).json({ error: 'Рахунок не знайдено' });
  
  account.tariff = newTariff;
  db.transactions.push({
    id: `t${nextTxId++}`, userId: req.userId, from: `Зміна тарифу`,
    date: new Date().toISOString(), amount: 0, currency: account.currency,
    category: 'Послуги', type: `Новий тариф: ${newTariff}`
  });
  res.json({ success: true, message: `Тариф змінено на ${newTariff}` });
});

// (ОНОВЛЕНО v18.5 - Використовує req.userId)
app.get('/transactions', verifyToken, (req, res) => {
  const userTxs = db.transactions.filter(t => t.userId === req.userId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const limit = req.query.limit;
  if (limit) {
    res.json(userTxs.slice(0, parseInt(limit)));
  } else {
    res.json(userTxs);
  }
});

// (TransactionDetails)
app.get('/transactions/:id', verifyToken, (req, res) => {
  const tx = db.transactions.find(t => t.id === req.params.id && t.userId === req.userId);
  if (tx) res.json(tx);
  else res.status(404).json({ error: 'Транзакцію не знайдено' });
});

// (DepositModal)
app.post('/deposit', verifyToken, (req, res) => {
  const { accountId, amount } = req.body;
  const account = db.accounts.find(a => a.id === accountId && a.userId === req.userId);
  if (!account) return res.status(404).json({ error: 'Рахунок не знайдено' });

  account.balance += amount;
  db.transactions.push({
    id: `t${nextTxId++}`, userId: req.userId, from: 'Поповнення',
    date: new Date().toISOString(), amount: amount, currency: account.currency,
    category: 'Поповнення', type: 'Депозит'
  });
  res.json({ success: true, newBalance: account.balance });
});

// (TransferModal)
app.post('/transfer', verifyToken, (req, res) => {
  const { fromAccountId, toUserEmail, amount } = req.body;
  const fromAccount = db.accounts.find(a => a.id === fromAccountId && a.userId === req.userId);
  const toUser = db.users.find(u => u.email === toUserEmail);

  if (!fromAccount) return res.status(404).json({ error: 'Рахунок відправника не знайдено' });
  if (!toUser) return res.status(404).json({ error: 'Користувача (отримувача) не знайдено' });
  if (fromAccount.balance < amount) return res.status(400).json({ error: 'Недостатньо коштів' });
  
  // Знаходимо *перший* рахунок одержувача
  const toAccount = db.accounts.find(a => a.userId === toUser.id);
  if (!toAccount) return res.status(404).json({ error: 'Рахунок отримувача не знайдено (у нього 0 карток)' });

  fromAccount.balance -= amount;
  toAccount.balance += amount;
  
  db.transactions.push({
    id: `t${nextTxId++}`, userId: req.userId, from: `Переказ ${toUserEmail}`,
    date: new Date().toISOString(), amount: -amount, currency: fromAccount.currency,
    category: 'Перекази', type: 'Вихідний переказ'
  });
  res.json({ success: true, newBalance: fromAccount.balance });
});

// (PayBillModal)
app.post('/pay-bill', verifyToken, (req, res) => {
  const { fromAccountId, category, details, amount } = req.body;
  const fromAccount = db.accounts.find(a => a.id === fromAccountId && a.userId === req.userId);
  
  if (!fromAccount) return res.status(404).json({ error: 'Рахунок не знайдено' });
  if (fromAccount.balance < amount) return res.status(400).json({ error: 'Недостатньо коштів' });
  
  fromAccount.balance -= amount;
  db.transactions.push({
    id: `t${nextTxId++}`, userId: req.userId, from: category,
    date: new Date().toISOString(), amount: -amount, currency: fromAccount.currency,
    category: 'Платежі', type: details
  });
  res.json({ success: true, newBalance: fromAccount.balance });
});

// (ExchangeModal)
app.post('/exchange', verifyToken, (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  const fromAccount = db.accounts.find(a => a.id === fromAccountId && a.userId === req.userId);
  const toAccount = db.accounts.find(a => a.id === toAccountId && a.userId === req.userId);
  
  if (!fromAccount || !toAccount) return res.status(404).json({ error: 'Рахунки не знайдено' });
  if (fromAccount.balance < amount) return res.status(400).json({ error: 'Недостатньо коштів' });

  const rate = 0.92; // Фейковий курс
  const exchangedAmount = amount * rate;
  
  fromAccount.balance -= amount;
  toAccount.balance += exchangedAmount;
  
  db.transactions.push({
    id: `t${nextTxId++}`, userId: req.userId, from: `Обмін ${fromAccount.currency} -> ${toAccount.currency}`,
    date: new Date().toISOString(), amount: -amount, currency: fromAccount.currency,
    category: 'Обмін', type: 'Конвертація'
  });
  res.json({ success: true });
});

// (OpenAccountModal)
app.post('/open-account', verifyToken, (req, res) => {
    const { currency, name, tariff } = req.body;
    const newCardNumber = `4000 4000 4000 ${Math.floor(1000 + Math.random() * 9000)}`;
    const newAccount = {
        id: `a${nextAccId++}`,
        userId: req.userId, // <-- Використовуємо ID з токену
        name: name,
        currency: currency,
        balance: 0, 
        cardNumber: newCardNumber,
        cardType: 'Visa Digital',
        tariff: tariff || 'Standard', 
        cardLimits: { online: 500, pos: 500 },
        isFrozen: false
    };
    db.accounts.push(newAccount);
    res.json(newAccount);
});

// (Budget)
app.get('/budget', verifyToken, (req, res) => {
  const expenses = db.transactions.filter(t => t.userId === req.userId && t.amount < 0);
  const totalSpent = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  
  const byCategory = expenses.reduce((acc, tx) => {
    const category = tx.category || 'Інше';
    acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  res.json({
    totalSpent: totalSpent,
    limit: 1500, 
    categories: byCategory
  });
});

// (Wealth/Services)
app.get('/wealth', verifyToken, (req, res) => {
  res.json({
    stocks: 0,
    crypto: 0,
    bonds: 0
  });
});

app.listen(PORT, () => {
  console.log(`(v18.5) Server running on http://localhost:${PORT}`);
});