function renderArticleCard(article) {
  const card = createElement('div', {
    className: 'card article-card fade-in',
    onClick: () => Router.navigate(`/learn/${article.slug}`),
  });

  card.innerHTML = `
    <div class="article-category">
      <span class="badge badge--category">${escapeHtml(article.category)}</span>
      ${article.is_flagship ? '<span class="badge badge--risk-high" style="margin-left:4px;">Flagship</span>' : ''}
    </div>
    <div class="article-title">${escapeHtml(article.title)}</div>
    <div class="article-summary">${escapeHtml(article.summary)}</div>
    <div class="card-footer">
      <div class="article-meta">
        <span>${article.read_time} min read</span>
      </div>
    </div>
  `;

  return card;
}
