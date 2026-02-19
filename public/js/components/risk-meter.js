function renderRiskMeter(container, score, { size = 'default' } = {}) {
  const risk = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const color = riskColor(risk);
  const label = risk.toUpperCase() + ' RISK';

  const el = createElement('div', { className: 'risk-meter-large' });
  el.innerHTML = `
    <div style="text-align:center;margin-bottom:var(--space-md);">
      <div style="font-size:var(--text-4xl);font-weight:var(--font-extrabold);color:${color};">${score}</div>
      <div style="font-size:var(--text-sm);font-weight:var(--font-bold);color:${color};text-transform:uppercase;">${label}</div>
    </div>
    <div class="risk-meter-bar" style="height:12px;">
      <div class="risk-meter-fill" style="width:${score}%;background:${color};"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:var(--space-xs);font-size:var(--text-xs);color:var(--text-muted);">
      <span>Low</span>
      <span>Medium</span>
      <span>High</span>
    </div>
  `;
  container.appendChild(el);
}
