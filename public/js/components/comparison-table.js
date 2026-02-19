function renderComparisonTable(container, selectedPlatforms, scorecardData) {
  if (!selectedPlatforms || selectedPlatforms.length < 2) {
    container.innerHTML = '<p class="text-muted text-center">Select at least 2 platforms to compare.</p>';
    return;
  }

  const { themes, category_labels } = scorecardData;

  // Sort selected platforms by overall score (descending) for upset detection
  const ranked = [...selectedPlatforms].sort((a, b) => b.tosup_score - a.tosup_score);

  let html = '<div class="table-wrapper"><table class="table compare-tosup-table">';

  // Header row with platform icons
  html += '<thead><tr><th class="tosup-category-label">Category</th>';
  for (const p of selectedPlatforms) {
    const icon = tosupPlatformIcon(p.platform);
    html += `<th class="compare-tosup-header">${icon}<div class="compare-tosup-header-name">${escapeHtml(p.platform)}</div><div class="compare-tosup-header-score">${p.tosup_score}</div></th>`;
  }
  html += '</tr></thead><tbody>';

  // Rows grouped by theme
  for (const [themeName, categoryKeys] of Object.entries(themes)) {
    html += `<tr class="tosup-theme-row"><td colspan="${selectedPlatforms.length + 1}" class="tosup-theme-label">${escapeHtml(themeName)}</td></tr>`;

    for (const catKey of categoryKeys) {
      const label = category_labels[catKey] || catKey;
      html += `<tr><td class="tosup-category-label">${escapeHtml(label)}</td>`;

      // Compute scores for upset detection
      const scores = selectedPlatforms.map(p => {
        const cat = p.scores[catKey];
        return cat ? cat.score : null;
      });

      for (let idx = 0; idx < selectedPlatforms.length; idx++) {
        const p = selectedPlatforms[idx];
        const cat = p.scores[catKey];

        if (!cat || cat.score === null) {
          html += '<td class="tosup-cell tosup-score-null compare-tosup-cell" title="N/A">&#8212;</td>';
          continue;
        }

        const cellClass = tosupCellClass(cat.score);
        const isUpset = detectUpset(p, cat.score, ranked, catKey);
        const upsetMark = isUpset ? '<span class="compare-upset-arrow" title="Upset! Lower-ranked platform beats a higher-ranked one here">&#x2191;</span>' : '';
        const upsetClass = isUpset ? ' compare-upset' : '';
        const gapIcon = cat.gap_flag ? '<span class="tosup-gap-icon" title="Gap flag">&#x26a0;</span>' : '';

        html += `<td class="tosup-cell ${cellClass} compare-tosup-cell${upsetClass}" data-platform="${escapeHtml(p.platform)}" data-category="${catKey}" title="${escapeHtml(p.platform)}: ${cat.score}/5${cat.gap_flag ? ' (Gap Flag)' : ''}${isUpset ? ' — Upset!' : ''}">${cat.score}${gapIcon}${upsetMark}</td>`;
      }

      html += '</tr>';
    }
  }

  html += '</tbody></table></div>';
  html += '<div id="tosupEvidencePanel" class="tosup-evidence-panel"></div>';

  container.innerHTML = html;

  // Click handler for evidence
  container.querySelectorAll('.compare-tosup-cell[data-platform]').forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.addEventListener('click', () => {
      showEvidencePanel(scorecardData, cell.dataset.platform, cell.dataset.category);
    });
  });
}

function detectUpset(platform, score, ranked, catKey) {
  if (score === null) return false;
  // Find this platform's overall rank position
  const myRank = ranked.findIndex(p => p.slug === platform.slug);
  // Check if any higher-ranked platform (lower index) has a lower score in this category
  for (let i = 0; i < myRank; i++) {
    const higherPlatform = ranked[i];
    const higherCat = higherPlatform.scores[catKey];
    if (higherCat && higherCat.score !== null && score > higherCat.score) {
      return true;
    }
  }
  return false;
}
