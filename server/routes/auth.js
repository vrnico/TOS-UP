const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { GITHUB_CLIENT_ID, getLoginUrl, getGitHubToken, getGitHubUser } = require('../lib/auth');

// GET /api/auth/me - current user info
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      username: req.user.username,
      display_name: req.user.display_name,
      avatar_url: req.user.avatar_url,
      role: req.user.role,
    });
  } else {
    res.json(null);
  }
});

// GET /api/auth/login - redirect to GitHub
router.get('/login', (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(503).json({ error: 'GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.' });
  }
  res.json({ url: getLoginUrl() });
});

// GET /api/auth/callback - GitHub OAuth callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/#/?error=no_code');

  try {
    const tokenData = await getGitHubToken(code);
    if (!tokenData.access_token) {
      return res.redirect('/#/?error=token_failed');
    }

    const ghUser = await getGitHubUser(tokenData.access_token);
    if (!ghUser.id) {
      return res.redirect('/#/?error=user_fetch_failed');
    }

    // Upsert user
    const existing = db.get('SELECT * FROM users WHERE github_id = ?', [ghUser.id]);
    let userId;
    if (existing) {
      db.run(
        'UPDATE users SET username = ?, display_name = ?, avatar_url = ? WHERE github_id = ?',
        [ghUser.login, ghUser.name || ghUser.login, ghUser.avatar_url, ghUser.id]
      );
      userId = existing.id;
    } else {
      const result = db.run(
        'INSERT INTO users (github_id, username, display_name, avatar_url) VALUES (?, ?, ?, ?)',
        [ghUser.id, ghUser.login, ghUser.name || ghUser.login, ghUser.avatar_url]
      );
      userId = result.lastInsertRowid;
    }

    req.session.userId = userId;
    res.redirect('/#/?login=success');
  } catch (err) {
    console.error('OAuth error:', err);
    res.redirect('/#/?error=oauth_failed');
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

module.exports = router;
