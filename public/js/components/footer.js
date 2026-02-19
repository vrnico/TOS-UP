function renderFooter() {
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-text">
          ToS-Up &mdash; The fine print, decoded.
        </div>
        <div class="footer-links">
          <a href="#/about">About</a>
          <a href="#/learn">Learn</a>
          <a href="https://themultiverse.school" target="_blank">themultiverse.school</a>
        </div>
      </div>
    </div>
  `;
}
