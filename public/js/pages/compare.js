async function renderComparePage(container) {
  container.innerHTML = `
    <div class="container container--wide page fade-in">
      <div class="section-header">
        <h1 class="section-title">Compare Platforms</h1>
        <p class="section-subtitle">Side-by-side category comparison. Select 2&ndash;4 platforms to see how they stack up.</p>
      </div>

      <div class="compare-tosup-selector" id="compareSelector">
        <div class="compare-tosup-loading"><div class="loading"><div class="spinner"></div></div></div>
      </div>
      <div id="compareResults"></div>
    </div>
  `;

  try {
    const data = await API.getScorecard();
    const platforms = data.platforms;

    const selector = $('#compareSelector', container);
    let html = '<div class="compare-tosup-dropdowns">';
    for (let i = 0; i < 4; i++) {
      html += `<select class="compare-tosup-select" data-slot="${i}">`;
      html += `<option value="">Platform ${i + 1}${i >= 2 ? ' (optional)' : ''}</option>`;
      for (const p of platforms) {
        html += `<option value="${escapeHtml(p.slug)}">${escapeHtml(p.platform)} (${p.tosup_score})</option>`;
      }
      html += '</select>';
    }
    html += '</div>';
    html += '<button class="btn btn--primary mt-md" id="compareBtn">Compare</button>';
    selector.innerHTML = html;

    $('#compareBtn', container).addEventListener('click', () => {
      const slugs = [...selector.querySelectorAll('select')]
        .map(s => s.value)
        .filter(Boolean);

      if (slugs.length < 2) {
        $('#compareResults', container).innerHTML = '<p class="text-muted text-center" style="padding:var(--space-xl);">Please select at least 2 platforms.</p>';
        return;
      }

      const selected = slugs.map(slug => platforms.find(p => p.slug === slug)).filter(Boolean);
      renderComparisonTable($('#compareResults', container), selected, data);
    });

  } catch (err) {
    renderError(container, err.message);
  }
}
