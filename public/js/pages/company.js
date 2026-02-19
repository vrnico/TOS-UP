async function renderCompanyPage(container, { slug }) {
  renderLoading(container);

  try {
    const company = await API.getCompany(slug);
    Store.set('currentCompany', company);

    container.innerHTML = `
      <div class="container page fade-in">
        <div class="company-hero">
          <div class="company-hero-header">
            <div>
              <div class="company-hero-title">${escapeHtml(company.name)}</div>
              <div class="company-hero-meta">
                <span class="badge badge--category">${escapeHtml(company.category)}</span>
                <span class="badge ${riskClass(company.overall_risk)}">${company.overall_risk} risk</span>
                ${company.parent_company ? `<span class="text-muted">${escapeHtml(company.parent_company)}</span>` : ''}
              </div>
            </div>
          </div>
          <p class="text-secondary" style="max-width:700px;line-height:1.8;">${escapeHtml(company.summary)}</p>
        </div>

        <div class="layout-sidebar--right">
          <div class="company-article">
            <div id="companyAnalysis" class="markdown-content"></div>

            ${company.flags && company.flags.length > 0 ? '<h2 id="red-flags">Red Flags</h2>' : ''}
            <div id="companyFlags"></div>

            ${company.sections && company.sections.length > 0 ? '<h2 id="tos-sections">TOS Section Breakdown</h2>' : ''}
            <div id="companySections"></div>

            <div id="companyComments" style="margin-top:var(--space-xl);"></div>
          </div>
          <div class="sidebar" id="companySidebar"></div>
        </div>
      </div>
    `;

    // Render analysis markdown
    const analysisEl = $('#companyAnalysis', container);
    if (company.detailed_analysis) {
      analysisEl.innerHTML = renderMarkdown(company.detailed_analysis);
    }

    // Render flags with voting
    if (company.flags && company.flags.length > 0) {
      const flagsEl = $('#companyFlags', container);
      let votesData = { votes: {}, userVotes: {} };
      try { votesData = await API.getVotes(company.id); } catch {}
      Store.set('currentVotes', votesData);

      for (const flag of company.flags) {
        const card = createElement('div', { className: 'card mb-sm flag-card' });
        card.style.cursor = 'default';
        const severity = flag.severity || 'high';
        card.innerHTML = `
          <div class="card-header" style="justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:var(--space-xs);">
              <span class="flag-badge flag-badge--${severity}">${escapeHtml(flag.name)}</span>
              <span class="text-muted text-xs">${escapeHtml(flag.category)}</span>
            </div>
            <div class="flag-vote-area" data-flag="${flag.id}"></div>
          </div>
          <div class="card-body">
            ${flag.evidence ? `<p class="text-secondary">${escapeHtml(flag.evidence)}</p>` : ''}
            ${flag.description ? `<p class="text-muted text-xs" style="margin-top:var(--space-xs);">${escapeHtml(flag.description)}</p>` : ''}
          </div>
        `;
        flagsEl.appendChild(card);

        // Add vote buttons
        const voteArea = card.querySelector('.flag-vote-area');
        const tally = votesData.votes[flag.id] || { agrees: 0, disagrees: 0 };
        const userVote = votesData.userVotes[flag.id] || 0;
        renderVoteButtons(voteArea, company.id, flag.id, tally, userVote);
      }
    }

    // Render TOS sections
    if (company.sections && company.sections.length > 0) {
      const sectionsEl = $('#companySections', container);
      for (const section of company.sections) {
        const id = slugify(section.title);
        const riskBadge = section.risk_level !== 'low'
          ? `<span class="badge ${riskClass(section.risk_level)}">${section.risk_level}</span>` : '';
        sectionsEl.innerHTML += `
          <div class="card mb-md" id="${id}" style="cursor:default;">
            <div class="card-header">
              <h3 class="card-title">${escapeHtml(section.title)}</h3>
              ${riskBadge}
            </div>
            <div class="card-body">
              <p><strong>Plain English:</strong> ${escapeHtml(section.plain_english)}</p>
              ${section.original_text ? `<p style="margin-top:var(--space-sm);font-size:var(--text-xs);color:var(--text-muted);font-style:italic;">"${escapeHtml(section.original_text.substring(0, 200))}..."</p>` : ''}
            </div>
          </div>
        `;
      }
    }

    // Sidebar
    renderCompanySidebar($('#companySidebar', container), company);

    // Comments section
    renderCommentSection($('#companyComments', container), 'company', company.id);

  } catch (err) {
    renderError(container, err.message);
  }
}
