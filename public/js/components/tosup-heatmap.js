// TOS-Up Heatmap Components

const PLATFORM_ICONS = {
  'TikTok':    { abbr: 'TK', bg: '#000000', color: '#ffffff' },
  'Instagram': { abbr: 'IG', bg: '#E1306C', color: '#ffffff' },
  'X':         { abbr: 'X',  bg: '#000000', color: '#ffffff' },
  'X/Twitter': { abbr: 'X',  bg: '#000000', color: '#ffffff' },
  'Snapchat':  { abbr: 'SC', bg: '#FFFC00', color: '#000000' },
  'Reddit':    { abbr: 'R',  bg: '#FF4500', color: '#ffffff' },
  'LinkedIn':  { abbr: 'LI', bg: '#0A66C2', color: '#ffffff' },
  'YouTube':   { abbr: 'YT', bg: '#FF0000', color: '#ffffff' },
  'Twitch':    { abbr: 'TW', bg: '#9146FF', color: '#ffffff' },
  'Kick':      { abbr: 'K',  bg: '#53FC18', color: '#000000' },
  'Patreon':   { abbr: 'P',  bg: '#FF424D', color: '#ffffff' },
  'Substack':  { abbr: 'S',  bg: '#FF6719', color: '#ffffff' },
  'Discord':   { abbr: 'D',  bg: '#5865F2', color: '#ffffff' },
};

function tosupPlatformIcon(platformName) {
  const icon = PLATFORM_ICONS[platformName];
  if (!icon) {
    const letter = platformName.charAt(0).toUpperCase();
    return `<span class="tosup-platform-icon" style="background:#666;color:#fff;">${letter}</span>`;
  }
  return `<span class="tosup-platform-icon" style="background:${icon.bg};color:${icon.color};">${icon.abbr}</span>`;
}

function tosupScoreColor(score100) {
  if (score100 >= 70) return '#1a7f37';
  if (score100 >= 50) return '#4b8b3b';
  if (score100 >= 35) return '#ac6600';
  if (score100 >= 20) return '#9a4e09';
  return '#a51d2d';
}

function tosupCellColor(score5) {
  const map = {
    1: '#a51d2d',
    2: '#9a4e09',
    3: '#ac6600',
    4: '#1a7f37',
    5: '#116329',
  };
  return map[score5] || 'transparent';
}

function tosupCellClass(score5) {
  if (score5 === null) return 'tosup-score-null';
  return 'tosup-score-' + score5;
}

function renderTosUpLeaderboard(container, platforms) {
  let html = '<div class="tosup-leaderboard-grid">';

  platforms.forEach((p, i) => {
    const rank = i + 1;
    const color = tosupScoreColor(p.tosup_score);
    const typeLabel = p.type === 'social_media' ? 'Social' : 'Creator';
    const typeBadgeClass = p.type === 'social_media' ? 'badge--privacy' : 'badge--financial';

    const icon = tosupPlatformIcon(p.platform);
    html += `
      <a href="#/tosup/${p.slug}" class="tosup-rank-card card">
        <div class="tosup-rank-number">#${rank}</div>
        ${icon}
        <div class="tosup-rank-info">
          <div class="tosup-rank-name">${escapeHtml(p.platform)}</div>
          <div class="tosup-rank-bar-row">
            <div class="tosup-rank-bar">
              <div class="tosup-rank-bar-fill" style="width:${p.tosup_score}%;background:${color};"></div>
            </div>
            <span class="tosup-rank-score" style="color:${color}">${p.tosup_score}</span>
          </div>
          <div class="tosup-rank-meta">
            <span class="badge ${typeBadgeClass}">${typeLabel}</span>
            ${p.gap_count > 0 ? `<span class="badge badge--risk-medium" title="${p.gap_count} gap flag${p.gap_count > 1 ? 's' : ''} found">\u26a0 ${p.gap_count} gap${p.gap_count > 1 ? 's' : ''}</span>` : ''}
          </div>
        </div>
      </a>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

function renderTosUpHeatmap(container, data, activeTheme) {
  const { platforms, themes, category_labels } = data;

  // Determine which themes/categories to show
  let themeEntries;
  if (activeTheme === 'All') {
    themeEntries = Object.entries(themes);
  } else {
    themeEntries = [[activeTheme, themes[activeTheme]]];
  }

  let html = '<div class="table-wrapper"><table class="tosup-table">';

  // Header row: Category | platform1 | platform2 | ...
  html += '<thead><tr><th class="tosup-category-label">Category</th>';
  for (const p of platforms) {
    html += `<th class="tosup-platform-header"><a href="#/tosup/${p.slug}" class="tosup-platform-link">${escapeHtml(p.platform)}</a></th>`;
  }
  html += '</tr></thead><tbody>';

  for (const [themeName, categoryKeys] of themeEntries) {
    // Theme group header
    html += `<tr class="tosup-theme-row"><td colspan="${platforms.length + 1}" class="tosup-theme-label">${escapeHtml(themeName)}</td></tr>`;

    for (const catKey of categoryKeys) {
      const label = category_labels[catKey] || catKey;
      html += `<tr><td class="tosup-category-label">${escapeHtml(label)}</td>`;

      for (const p of platforms) {
        const cat = p.scores[catKey];
        if (!cat || cat.score === null) {
          html += '<td class="tosup-cell tosup-score-null" title="N/A">&#8212;</td>';
        } else {
          const gapIcon = cat.gap_flag ? '<span class="tosup-gap-icon" title="Gap flag">\u26a0</span>' : '';
          html += `<td class="tosup-cell ${tosupCellClass(cat.score)}" data-platform="${escapeHtml(p.platform)}" data-category="${catKey}" title="${escapeHtml(p.platform)}: ${cat.score}/5${cat.gap_flag ? ' (Gap Flag)' : ''}">${cat.score}${gapIcon}</td>`;
        }
      }

      html += '</tr>';
    }
  }

  html += '</tbody></table></div>';

  // Evidence panel placeholder
  html += '<div id="tosupEvidencePanel" class="tosup-evidence-panel"></div>';

  container.innerHTML = html;

  // Attach click handlers to cells
  container.querySelectorAll('.tosup-cell[data-platform]').forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.addEventListener('click', () => {
      const platformName = cell.dataset.platform;
      const category = cell.dataset.category;
      showEvidencePanel(data, platformName, category);
    });
  });
}

function renderTosUpLegend(container) {
  const scores = [
    { val: 1, label: '1 - Worst', cls: 'tosup-score-1' },
    { val: 2, label: '2 - Poor', cls: 'tosup-score-2' },
    { val: 3, label: '3 - Fair', cls: 'tosup-score-3' },
    { val: 4, label: '4 - Good', cls: 'tosup-score-4' },
    { val: 5, label: '5 - Best', cls: 'tosup-score-5' },
  ];

  let html = '<div class="tosup-legend">';
  html += '<span class="tosup-legend-label">Score Scale:</span>';
  for (const s of scores) {
    html += `<span class="tosup-legend-item"><span class="tosup-legend-swatch ${s.cls}"></span>${s.label}</span>`;
  }
  html += '<span class="tosup-legend-item"><span class="tosup-legend-swatch tosup-legend-gap">\u26a0</span>Gap Flag</span>';
  html += '</div>';

  container.innerHTML = html;
}

function showEvidencePanel(data, platformName, category) {
  const panel = document.getElementById('tosupEvidencePanel');
  if (!panel) return;

  const platform = data.platforms.find(p => p.platform === platformName);
  if (!platform) return;

  const cat = platform.scores[category];
  if (!cat) return;

  const label = data.category_labels[category] || category;
  const scoreColor = cat.score !== null ? tosupCellColor(cat.score) : '#666';

  let html = `
    <div class="tosup-evidence-card card">
      <div class="tosup-evidence-header">
        <div>
          <strong>${escapeHtml(platformName)}</strong> &mdash; ${escapeHtml(label)}
        </div>
        <button class="btn btn--ghost btn--sm tosup-evidence-close" aria-label="Close">&times;</button>
      </div>
      <div class="tosup-evidence-score">
        <span class="tosup-evidence-score-badge" style="background:${scoreColor};color:#000;padding:2px 10px;border-radius:var(--radius-full);font-weight:700;">
          ${cat.score !== null ? cat.score + '/5' : 'N/A'}
        </span>
        ${cat.gap_flag ? '<span class="badge badge--risk-medium">\u26a0 Gap Flag</span>' : ''}
      </div>
      ${cat.gap_note ? `<div class="tosup-evidence-gap-note"><strong>Gap Note:</strong> ${escapeHtml(cat.gap_note)}</div>` : ''}
      ${cat.evidence ? `<blockquote class="tosup-evidence-quote">${escapeHtml(cat.evidence)}</blockquote>` : ''}
    </div>
  `;

  panel.innerHTML = html;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  panel.querySelector('.tosup-evidence-close').addEventListener('click', () => {
    panel.style.display = 'none';
    panel.innerHTML = '';
  });
}
