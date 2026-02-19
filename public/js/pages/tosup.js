async function renderTosUpPage(container) {
  container.innerHTML = `
    <div class="container container--wide page fade-in">
      <div class="hero">
        <h1 class="hero-title">TOS-Up Scorecard</h1>
        <p class="hero-subtitle">
          Rotten Tomatoes for Terms of Service. We scored 12 platforms across 15 categories
          so you can see who actually respects your rights.
        </p>
      </div>
      <div id="tosupContent"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;

  const content = document.getElementById('tosupContent');

  try {
    const data = await API.getScorecard();

    let html = '';

    // Leaderboard section
    html += '<div class="section"><div class="section-header"><h2 class="section-title">Platform Rankings</h2><p class="section-subtitle">Ranked by overall TOS-Up Score (0\u2013100). Higher is better.</p></div><div id="tosupLeaderboard"></div></div>';

    // Legend
    html += '<div id="tosupLegend" class="section"></div>';

    // Theme filter tabs
    const themeNames = Object.keys(data.themes);
    html += '<div class="section"><div class="section-header"><h2 class="section-title">Category Heatmap</h2><p class="section-subtitle">Click any cell to see the evidence behind the score.</p></div>';
    html += '<div class="tosup-theme-tabs" id="tosupThemeTabs">';
    html += '<button class="filter-btn active" data-theme="All">All</button>';
    for (const name of themeNames) {
      html += `<button class="filter-btn" data-theme="${escapeHtml(name)}">${escapeHtml(name)}</button>`;
    }
    html += '</div>';

    // Heatmap container
    html += '<div id="tosupHeatmap"></div></div>';

    content.innerHTML = html;

    // Render sub-components
    renderTosUpLeaderboard(document.getElementById('tosupLeaderboard'), data.platforms);
    renderTosUpLegend(document.getElementById('tosupLegend'));
    renderTosUpHeatmap(document.getElementById('tosupHeatmap'), data, 'All');

    // Theme tab click handlers
    document.getElementById('tosupThemeTabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Toggle active state
      document.querySelectorAll('#tosupThemeTabs .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.dataset.theme;
      renderTosUpHeatmap(document.getElementById('tosupHeatmap'), data, theme);
    });

  } catch (err) {
    renderError(content, err.message);
  }
}

async function renderTosUpPlatformPage(container, params) {
  container.innerHTML = `
    <div class="container page fade-in">
      <div id="tosupPlatformContent"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;

  const content = document.getElementById('tosupPlatformContent');

  try {
    const data = await API.getScorecard();
    const platform = data.platforms.find(p => p.slug === params.slug);

    if (!platform) {
      renderError(content, 'Platform not found.');
      return;
    }

    const color = tosupScoreColor(platform.tosup_score);
    const typeLabel = platform.type === 'social_media' ? 'Social Media' : 'Creator Platform';
    const typeBadgeClass = platform.type === 'social_media' ? 'badge--privacy' : 'badge--financial';
    const rank = data.platforms.indexOf(platform) + 1;

    let html = '';

    // Hero / header
    html += `
      <div class="tosup-detail-hero">
        <a href="#/" class="tosup-back-link">&larr; Back to Scorecard</a>
        <div class="tosup-detail-header">
          <div>
            <h1 class="tosup-detail-name">${escapeHtml(platform.platform)}</h1>
            <div class="tosup-detail-meta">
              <span class="badge ${typeBadgeClass}">${typeLabel}</span>
              <span class="tosup-detail-rank">Rank #${rank} of ${data.platforms.length}</span>
              ${platform.gap_count > 0 ? `<span class="badge badge--risk-medium">\u26a0 ${platform.gap_count} gap flag${platform.gap_count > 1 ? 's' : ''}</span>` : ''}
            </div>
          </div>
          <div class="tosup-detail-score-ring" style="border-color:${color};">
            <span class="tosup-detail-score-value" style="color:${color};">${platform.tosup_score}</span>
            <span class="tosup-detail-score-label">TOS-Up</span>
          </div>
        </div>
        <div class="tosup-detail-bar-wrapper">
          <div class="tosup-rank-bar" style="height:12px;">
            <div class="tosup-rank-bar-fill" style="width:${platform.tosup_score}%;background:${color};"></div>
          </div>
        </div>
      </div>
    `;

    // Category breakdown by theme
    html += '<div class="section" style="margin-top:var(--space-xl);">';
    html += '<h2 class="section-title">Category Breakdown</h2>';

    for (const [themeName, categoryKeys] of Object.entries(data.themes)) {
      html += `<div class="tosup-detail-theme-section">`;
      html += `<h3 class="tosup-detail-theme-title">${escapeHtml(themeName)}</h3>`;

      for (const catKey of categoryKeys) {
        const cat = platform.scores[catKey];
        const label = data.category_labels[catKey] || catKey;

        if (!cat || cat.score === null) {
          html += `
            <div class="tosup-detail-category-card card">
              <div class="tosup-detail-cat-header">
                <span class="tosup-detail-cat-name">${escapeHtml(label)}</span>
                <span class="tosup-detail-cat-score tosup-score-null">N/A</span>
              </div>
            </div>
          `;
          continue;
        }

        const cellClass = tosupCellClass(cat.score);
        const scoreColor = tosupCellColor(cat.score);

        html += `
          <div class="tosup-detail-category-card card">
            <div class="tosup-detail-cat-header">
              <span class="tosup-detail-cat-name">${escapeHtml(label)}</span>
              <div class="tosup-detail-cat-badges">
                ${cat.gap_flag ? '<span class="badge badge--risk-medium">\u26a0 Gap</span>' : ''}
                <span class="tosup-detail-cat-score ${cellClass}">${cat.score}/5</span>
              </div>
            </div>
            <div class="tosup-detail-cat-bar">
              <div class="tosup-rank-bar" style="height:6px;">
                <div class="tosup-rank-bar-fill" style="width:${(cat.score / 5) * 100}%;background:${scoreColor};"></div>
              </div>
            </div>
            ${cat.gap_note ? `<div class="tosup-detail-gap-note">${escapeHtml(cat.gap_note)}</div>` : ''}
            ${cat.evidence ? `<blockquote class="tosup-detail-evidence">${escapeHtml(cat.evidence)}</blockquote>` : ''}
          </div>
        `;
      }

      html += '</div>';
    }

    html += '</div>';

    content.innerHTML = html;

  } catch (err) {
    renderError(content, err.message);
  }
}
