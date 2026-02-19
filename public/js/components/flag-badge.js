function renderFlagBadge(flag) {
  const severityClass = flag.severity === 'warning' ? 'flag-badge--warning' : '';
  const el = createElement('div', { className: `flag-badge ${severityClass}` });
  el.innerHTML = `
    <div style="flex:1;">
      <div class="flag-name">${escapeHtml(flag.name)}</div>
      <div class="flag-desc">${escapeHtml(flag.description)}</div>
      ${flag.evidence ? `<div class="flag-evidence">"${escapeHtml(flag.evidence)}"</div>` : ''}
      <div style="margin-top:var(--space-sm);">
        <span class="badge ${categoryClass(flag.category)}">${escapeHtml(flag.category)}</span>
      </div>
    </div>
  `;
  return el;
}

function renderFlagList(container, flags) {
  if (!flags || flags.length === 0) {
    container.innerHTML = '<p class="text-muted">No red flags identified.</p>';
    return;
  }

  // Group by category
  const grouped = {};
  for (const flag of flags) {
    const cat = flag.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(flag);
  }

  for (const [category, catFlags] of Object.entries(grouped)) {
    const section = createElement('div', { className: 'mb-lg' });
    section.innerHTML = `<h3 style="font-size:var(--text-base);color:var(--text-secondary);margin-bottom:var(--space-md);">${escapeHtml(category)}</h3>`;
    const list = createElement('div', { className: 'flex-col gap-sm' });
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = 'var(--space-sm)';
    for (const flag of catFlags) {
      list.appendChild(renderFlagBadge(flag));
    }
    section.appendChild(list);
    container.appendChild(section);
  }
}
