function renderSearchBar(container, { placeholder = 'Search companies, articles, terms...', onSearch } = {}) {
  const wrapper = createElement('div', { className: 'search-bar' });
  wrapper.innerHTML = `
    <span class="search-icon">&#128269;</span>
    <input type="text" placeholder="${placeholder}" id="searchInput">
    <div class="search-results-dropdown" id="searchDropdown"></div>
  `;
  container.appendChild(wrapper);

  const input = wrapper.querySelector('#searchInput');
  const dropdown = wrapper.querySelector('#searchDropdown');

  const doSearch = debounce(async (query) => {
    if (query.length < 2) {
      dropdown.classList.remove('active');
      return;
    }
    try {
      const results = await API.search(query);
      if (results.length === 0) {
        dropdown.innerHTML = '<div class="search-result-item"><span class="text-muted">No results found</span></div>';
      } else {
        dropdown.innerHTML = results.map(r => `
          <div class="search-result-item" data-type="${r.type}" data-slug="${r.slug}">
            <div class="search-result-type">${r.type}</div>
            <div class="search-result-title">${escapeHtml(r.title)}</div>
            <div class="search-result-excerpt">${escapeHtml(r.excerpt || '')}</div>
          </div>
        `).join('');
      }
      dropdown.classList.add('active');
    } catch (err) {
      dropdown.classList.remove('active');
    }
  }, 250);

  input.addEventListener('input', () => doSearch(input.value.trim()));

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (!item) return;
    const type = item.dataset.type;
    const slug = item.dataset.slug;
    dropdown.classList.remove('active');
    input.value = '';
    if (type === 'company') Router.navigate(`/company/${slug}`);
    else if (type === 'article') Router.navigate(`/learn/${slug}`);
    else if (type === 'glossary') Router.navigate('/about');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) dropdown.classList.remove('active');
  });

  return wrapper;
}
