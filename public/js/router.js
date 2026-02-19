// Hash-based SPA router
const Router = {
  routes: [],
  currentRoute: null,

  add(pattern, handler) {
    // Convert "/company/:slug" to regex with named groups
    const paramNames = [];
    const regexStr = pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({
      pattern,
      regex: new RegExp(`^${regexStr}$`),
      paramNames,
      handler,
    });
    return this;
  },

  navigate(path) {
    window.location.hash = path;
  },

  getPath() {
    const hash = window.location.hash.slice(1) || '/';
    return hash.startsWith('/') ? hash : '/' + hash;
  },

  async resolve() {
    const path = this.getPath();

    for (const route of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        this.currentRoute = { path, pattern: route.pattern, params };

        // Update active nav link
        this._updateNav(route.pattern);

        // Call handler
        const main = document.getElementById('main');
        Store.set('error', null);

        try {
          await route.handler(main, params);
        } catch (err) {
          console.error('Route error:', err);
          main.innerHTML = `
            <div class="container page">
              <div class="error-state">
                <h3>Something went wrong</h3>
                <p>${escapeHtml(err.message)}</p>
                <button class="btn btn--primary mt-lg" onclick="Router.navigate('/')">Go Home</button>
              </div>
            </div>
          `;
        }

        // Scroll to top
        window.scrollTo(0, 0);
        return;
      }
    }

    // 404
    document.getElementById('main').innerHTML = `
      <div class="container page">
        <div class="error-state">
          <h3>Page Not Found</h3>
          <p>The page "${escapeHtml(path)}" doesn't exist.</p>
          <button class="btn btn--primary mt-lg" onclick="Router.navigate('/')">Go Home</button>
        </div>
      </div>
    `;
  },

  _updateNav(pattern) {
    const links = document.querySelectorAll('.navbar-links a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPath = href.replace('#', '');
      if (pattern === linkPath || (pattern.startsWith(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      } else if (linkPath === '/' && pattern === '/') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  start() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },
};
