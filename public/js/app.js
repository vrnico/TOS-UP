// App initialization
(function () {
  // Render shell components
  renderNavbar();
  renderFooter();
  initAuth();

  // Register routes
  Router
    .add('/', renderHomePage)
    .add('/library', renderLibraryPage)
    .add('/company/:slug', renderCompanyPage)
    .add('/analyzer', renderAnalyzerPage)
    .add('/compare', renderComparePage)
    .add('/tosup/:slug', renderTosUpPlatformPage)
    .add('/learn', renderLearnPage)
    .add('/learn/:slug', renderArticlePage)
    .add('/about', renderAboutPage);

  // Start router
  Router.start();

  // Close mobile nav on route change
  window.addEventListener('hashchange', () => {
    const links = document.getElementById('navLinks');
    if (links) links.classList.remove('open');
  });
})();
