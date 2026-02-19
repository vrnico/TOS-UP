function renderCompanySidebar(container, company) {
  // Info card
  const infoCard = createElement('div', { className: 'company-sidebar-card' });
  infoCard.innerHTML = `
    <h3>Company Info</h3>
    <div class="info-row"><span class="info-label">Industry</span><span>${escapeHtml(company.industry)}</span></div>
    <div class="info-row"><span class="info-label">Category</span><span>${escapeHtml(company.category)}</span></div>
    ${company.parent_company ? `<div class="info-row"><span class="info-label">Parent</span><span>${escapeHtml(company.parent_company)}</span></div>` : ''}
    ${company.founded_year ? `<div class="info-row"><span class="info-label">Founded</span><span>${company.founded_year}</span></div>` : ''}
    ${company.headquarters ? `<div class="info-row"><span class="info-label">HQ</span><span>${escapeHtml(company.headquarters)}</span></div>` : ''}
    <div class="info-row"><span class="info-label">TOS Words</span><span>${formatNumber(company.word_count)}</span></div>
    <div class="info-row"><span class="info-label">Read Time</span><span>${company.estimated_read_time} min</span></div>
    ${company.tos_last_updated ? `<div class="info-row"><span class="info-label">TOS Updated</span><span>${company.tos_last_updated}</span></div>` : ''}
  `;
  container.appendChild(infoCard);

  // Risk score card
  const riskCard = createElement('div', { className: 'company-sidebar-card' });
  riskCard.innerHTML = '<h3>Risk Score</h3>';
  renderRiskMeter(riskCard, company.risk_score);
  container.appendChild(riskCard);

  // TOC card (from analysis sections)
  if (company.sections && company.sections.length > 0) {
    const tocCard = createElement('div', { className: 'company-sidebar-card' });
    tocCard.innerHTML = `<h3>Sections</h3>`;
    for (const section of company.sections) {
      const id = slugify(section.title);
      tocCard.innerHTML += `<a class="sidebar-item" href="#" onclick="document.getElementById('${id}')?.scrollIntoView({behavior:'smooth'});return false;">${escapeHtml(section.title)}</a>`;
    }
    container.appendChild(tocCard);
  }
}
