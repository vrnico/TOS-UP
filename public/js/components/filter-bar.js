function renderFilterBar(container, { categories = [], onFilter }) {
  const bar = createElement('div', { className: 'filter-bar' });

  // Category filter
  const catGroup = createElement('div', { className: 'filter-group' });
  const allCats = ['all', ...categories];
  for (const cat of allCats) {
    const btn = createElement('button', {
      className: `filter-btn ${Store.get('filters').category === cat ? 'active' : ''}`,
      textContent: cat === 'all' ? 'All' : cat,
      'data-filter': 'category',
      'data-value': cat,
    });
    catGroup.appendChild(btn);
  }
  bar.appendChild(catGroup);

  // Risk filter
  const riskGroup = createElement('div', { className: 'filter-group' });
  const risks = ['all', 'critical', 'high', 'medium', 'low'];
  for (const risk of risks) {
    const btn = createElement('button', {
      className: `filter-btn ${Store.get('filters').risk === risk ? 'active' : ''}`,
      textContent: risk === 'all' ? 'All Risk' : risk.charAt(0).toUpperCase() + risk.slice(1),
      'data-filter': 'risk',
      'data-value': risk,
    });
    riskGroup.appendChild(btn);
  }
  bar.appendChild(riskGroup);

  // Sort dropdown
  const sortSelect = createElement('select', {
    className: 'filter-btn',
    style: 'padding:6px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-full);color:var(--text-secondary);font-size:var(--text-xs);cursor:pointer;',
  });
  sortSelect.innerHTML = `
    <option value="risk-desc">Highest Risk</option>
    <option value="risk-asc">Lowest Risk</option>
    <option value="name-asc">A-Z</option>
    <option value="name-desc">Z-A</option>
    <option value="words-desc">Most Words</option>
  `;
  sortSelect.value = Store.get('filters').sort;
  bar.appendChild(sortSelect);

  container.appendChild(bar);

  // Event delegation
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn[data-filter]');
    if (!btn) return;
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    const filters = { ...Store.get('filters'), [filter]: value };
    Store.set('filters', filters);
    // Update active states
    const group = btn.parentElement;
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (onFilter) onFilter(filters);
  });

  sortSelect.addEventListener('change', () => {
    const filters = { ...Store.get('filters'), sort: sortSelect.value };
    Store.set('filters', filters);
    if (onFilter) onFilter(filters);
  });
}
