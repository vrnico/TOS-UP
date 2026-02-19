function renderCompanyCard(company) {
  const card = createElement('div', {
    className: 'card company-card fade-in',
    onClick: () => Router.navigate(`/company/${company.slug}`),
  });

  card.innerHTML = `
    <div class="card-header">
      <div>
        <div class="company-name">${escapeHtml(company.name)}</div>
        ${company.parent_company ? `<div class="company-parent">${escapeHtml(company.parent_company)}</div>` : ''}
      </div>
      <span class="badge ${riskClass(company.overall_risk)}">${company.overall_risk} risk</span>
    </div>
    <div class="company-meta">
      <span class="badge badge--category">${escapeHtml(company.category)}</span>
    </div>
    <div class="company-summary">${escapeHtml(company.summary)}</div>
    <div class="card-footer">
      <div class="company-stats">
        <span>${formatNumber(company.word_count)} words</span>
        <span>${company.estimated_read_time || '?'} min read</span>
        <span>${company.flag_count || 0} flags</span>
      </div>
      ${renderRiskMeterInline(company.risk_score)}
    </div>
  `;

  return card;
}

function renderRiskMeterInline(score) {
  const color = score >= 70 ? 'var(--risk-high)' : score >= 40 ? 'var(--risk-medium)' : 'var(--risk-low)';
  return `
    <div class="risk-meter" style="width:100px;">
      <div class="risk-meter-bar">
        <div class="risk-meter-fill" style="width:${score}%;background:${color};"></div>
      </div>
      <span class="risk-meter-label" style="color:${color};">${score}</span>
    </div>
  `;
}
