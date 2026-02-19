function renderLoading(container) {
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

function renderError(container, message = 'Something went wrong') {
  container.innerHTML = `
    <div class="error-state">
      <h3>Error</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}
