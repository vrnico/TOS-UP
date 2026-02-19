async function renderAnalyzerPage(container) {
  container.innerHTML = `
    <div class="container container--narrow page fade-in">
      <div class="under-construction">
        <div class="under-construction-icon">&#x1F6A7;</div>
        <h1 class="under-construction-heading">Under Construction</h1>
        <p class="under-construction-message">
          Our TOS analyzer is being upgraded. Check back soon.
        </p>
        <a href="#/" class="btn btn--primary">Back to Homepage</a>
      </div>
    </div>
  `;
}
