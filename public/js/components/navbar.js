function renderNavbar() {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = `
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;">
      <a href="#/" class="navbar-brand">&#x2696; ToS-Up</a>
      <button class="navbar-hamburger" onclick="toggleMobileNav()" aria-label="Menu">&#9776;</button>
      <div class="navbar-links" id="navLinks">
        <a href="#/library">Library</a>
        <a href="#/compare">Compare</a>
        <a href="#/learn">Learn</a>
        <a href="#/about">About</a>
        <div id="authStatus"></div>
      </div>
    </div>
  `;
}

function toggleMobileNav() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}
