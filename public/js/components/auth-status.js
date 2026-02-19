// Auth status component - shows login/logout in navbar
async function initAuth() {
  try {
    const user = await API.getMe();
    Store.set('user', user);
  } catch {
    Store.set('user', null);
  }
  renderAuthStatus();
}

function renderAuthStatus() {
  const user = Store.get('user');
  const el = document.getElementById('authStatus');
  if (!el) return;

  if (user) {
    el.innerHTML = `
      <div class="auth-user">
        <img src="${escapeHtml(user.avatar_url)}" alt="" class="auth-avatar">
        <span class="auth-name">${escapeHtml(user.display_name || user.username)}</span>
        <button class="btn btn--sm btn--ghost" onclick="handleLogout()">Logout</button>
      </div>
    `;
  } else {
    el.innerHTML = `
      <button class="btn btn--sm btn--primary" onclick="handleLogin()">Login with GitHub</button>
    `;
  }
}

async function handleLogin() {
  try {
    const { url } = await API.getLoginUrl();
    window.location.href = url;
  } catch (err) {
    // OAuth not configured - show message
    alert('GitHub OAuth not configured yet. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables to enable login.');
  }
}

async function handleLogout() {
  await API.logout();
  Store.set('user', null);
  renderAuthStatus();
}
