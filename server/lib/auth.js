// GitHub OAuth helpers + session middleware
const https = require('https');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let chunks = '';
      res.on('data', (d) => chunks += d);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); }
        catch { resolve(chunks); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { 'Accept': 'application/json', 'User-Agent': 'TOS-SparkNotes', ...headers },
    }, (res) => {
      let chunks = '';
      res.on('data', (d) => chunks += d);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); }
        catch { resolve(chunks); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Exchange code for access token
async function getGitHubToken(code) {
  return httpsPost('https://github.com/login/oauth/access_token', {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code,
  });
}

// Fetch GitHub user profile
async function getGitHubUser(accessToken) {
  return httpsGet('https://api.github.com/user', {
    Authorization: `Bearer ${accessToken}`,
  });
}

// Build the OAuth login URL
function getLoginUrl() {
  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(BASE_URL + '/api/auth/callback')}&scope=read:user`;
}

// Middleware: attach user to req if session exists
function attachUser(db) {
  return (req, res, next) => {
    if (req.session && req.session.userId) {
      const user = db.get('SELECT * FROM users WHERE id = ?', [req.session.userId]);
      req.user = user || null;
    } else {
      req.user = null;
    }
    next();
  };
}

// Middleware: require authentication
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Login required' });
  }
  next();
}

// Middleware: require admin/moderator role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}

module.exports = {
  GITHUB_CLIENT_ID,
  getLoginUrl,
  getGitHubToken,
  getGitHubUser,
  attachUser,
  requireAuth,
  requireRole,
};
