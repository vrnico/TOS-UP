async function renderArticlePage(container, { slug }) {
  renderLoading(container);

  try {
    const article = await API.getArticle(slug);
    Store.set('currentArticle', article);

    const headings = extractHeadings(article.content);

    container.innerHTML = `
      <div class="container page fade-in">
        <div class="article-header">
          <div class="article-category mb-sm">
            <span class="badge badge--category">${escapeHtml(article.category)}</span>
            ${article.is_flagship ? '<span class="badge badge--risk-high" style="margin-left:4px;">Flagship</span>' : ''}
          </div>
          <h1 class="article-title-main">${escapeHtml(article.title)}</h1>
          ${article.subtitle ? `<p class="article-subtitle">${escapeHtml(article.subtitle)}</p>` : ''}
          <div class="article-info">
            <span>${article.read_time} min read</span>
            <span>${escapeHtml(article.author || 'ToS-Up')}</span>
          </div>
        </div>

        <div class="layout-sidebar">
          <div class="sidebar">
            <div class="toc-sidebar">
              <h3>Contents</h3>
              ${headings.map(h => `<a class="toc-link" href="#" onclick="document.getElementById('${h.id}')?.scrollIntoView({behavior:'smooth'});return false;">${escapeHtml(h.text)}</a>`).join('')}
            </div>
          </div>
          <div>
            <div class="markdown-content" id="articleContent"></div>
            <div id="articleComments" style="margin-top:var(--space-xl);"></div>
          </div>
        </div>
      </div>
    `;

    $('#articleContent', container).innerHTML = renderMarkdown(article.content);

    // Comments section
    renderCommentSection($('#articleComments', container), 'article', article.id);

  } catch (err) {
    renderError(container, err.message);
  }
}
