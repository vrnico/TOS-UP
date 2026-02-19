const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const db = require('./lib/db');
const { attachUser } = require('./lib/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '1mb' }));

app.use(cookieSession({
  name: 'tos_session',
  keys: [process.env.SESSION_SECRET || 'tos-sparknotes-dev-secret-change-in-prod'],
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
}));

app.use(attachUser(db));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve the original Day 2 demo at /app
app.use('/app', express.static(path.join(__dirname, '..', 'app')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/analyze', require('./routes/analysis'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/glossary', require('./routes/glossary'));
app.use('/api/search', require('./routes/search'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/compare', require('./routes/compare'));
app.use('/api/overlap', require('./routes/overlap'));
app.use('/api/scorecard', require('./routes/scorecard'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/contributions', require('./routes/contributions'));
app.use('/api/votes', require('./routes/votes'));

// SPA fallback - serve index.html for all non-API, non-static routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ToS-Up running at http://localhost:${PORT}`);
});
