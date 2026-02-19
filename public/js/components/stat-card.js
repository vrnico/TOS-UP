function renderStatCard(number, label) {
  const card = createElement('div', { className: 'stat-card' });
  card.innerHTML = `
    <div class="stat-number">${number}</div>
    <div class="stat-label">${escapeHtml(label)}</div>
  `;
  return card;
}
