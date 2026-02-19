// TODO: Resources are hardcoded for MVP — could later become a DB-backed admin panel
const LIBRARY_RESOURCES = [
  {
    title: 'Terms of Service; Didn\'t Read',
    url: 'https://tosdr.org',
    description: 'A project that rates and labels website terms of service and privacy policies, from very good to very bad.',
    category: 'Digital Rights',
    source: 'ToS;DR'
  },
  {
    title: 'The Age of Surveillance Capitalism',
    url: 'https://shoshanazuboff.com/book/about/',
    description: 'Shoshana Zuboff\'s groundbreaking book on how tech companies exploit personal data for profit.',
    category: 'Surveillance Capitalism',
    source: 'Shoshana Zuboff'
  },
  {
    title: 'Electronic Frontier Foundation',
    url: 'https://www.eff.org',
    description: 'The leading nonprofit defending digital privacy, free speech, and innovation.',
    category: 'Digital Rights',
    source: 'EFF'
  },
  {
    title: 'AI Training on Your Data',
    url: 'https://www.eff.org/deeplinks',
    description: 'How platforms are using your content to train AI models — and what your TOS says about it.',
    category: 'AI & Data',
    source: 'EFF Deeplinks'
  },
  {
    title: 'The Black Box Society',
    url: 'https://www.hup.harvard.edu/books/9780674970847',
    description: 'Frank Pasquale explores how secret algorithms and data brokers control our lives.',
    category: 'Surveillance Capitalism',
    source: 'Harvard University Press'
  },
  {
    title: 'Code Is Law',
    url: 'https://harvardmagazine.com/2000/01/code-is-law-html',
    description: 'Lawrence Lessig\'s foundational essay on how software architecture regulates behavior online.',
    category: 'Legal',
    source: 'Harvard Magazine'
  },
  {
    title: 'Data & Society Research Institute',
    url: 'https://datasociety.net',
    description: 'Independent research on the social implications of data-centric technologies and automation.',
    category: 'AI & Data',
    source: 'Data & Society'
  },
  {
    title: 'Creative Commons',
    url: 'https://creativecommons.org',
    description: 'Understanding content licensing and how it contrasts with the IP grabs hidden in platform TOS.',
    category: 'Creator Economy',
    source: 'Creative Commons'
  },
  {
    title: 'Fight for the Future',
    url: 'https://www.fightforthefuture.org',
    description: 'Digital rights group fighting for a future where technology is a force for liberation.',
    category: 'Digital Rights',
    source: 'FFTF'
  },
  {
    title: 'Access Now',
    url: 'https://www.accessnow.org',
    description: 'Defending and extending the digital rights of users at risk around the world.',
    category: 'Legal',
    source: 'Access Now'
  },
  {
    title: 'The Creator Economy Trap',
    url: 'https://www.theatlantic.com/technology/',
    description: 'How platforms use TOS to own creator content while shifting all risk to the individual.',
    category: 'Creator Economy',
    source: 'The Atlantic'
  },
  {
    title: 'AI Now Institute',
    url: 'https://ainowinstitute.org',
    description: 'Research institute examining the social implications of artificial intelligence.',
    category: 'AI & Data',
    source: 'AI Now'
  }
];

const LIBRARY_CATEGORIES = ['All', 'Digital Rights', 'Surveillance Capitalism', 'AI & Data', 'Legal', 'Creator Economy'];

async function renderLibraryPage(container) {
  container.innerHTML = `
    <div class="container page fade-in">
      <div class="section-header">
        <h1 class="section-title">Library</h1>
        <p class="section-subtitle">Curated resources on digital rights, surveillance capitalism, and the politics of Terms of Service.</p>
      </div>
      <div class="library-filter-tabs" id="libraryFilterTabs"></div>
      <div class="library-resource-grid" id="libraryGrid"></div>
    </div>
  `;

  const tabs = $('#libraryFilterTabs', container);
  const grid = $('#libraryGrid', container);

  // Render filter tabs
  let activeCategory = 'All';
  tabs.innerHTML = LIBRARY_CATEGORIES.map(cat =>
    `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
  ).join('');

  function renderResources(category) {
    const filtered = category === 'All'
      ? LIBRARY_RESOURCES
      : LIBRARY_RESOURCES.filter(r => r.category === category);

    grid.innerHTML = filtered.map(r => `
      <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="library-resource-card card">
        <div class="library-resource-category">
          <span class="badge badge--category">${escapeHtml(r.category)}</span>
        </div>
        <h3 class="library-resource-title">${escapeHtml(r.title)} <span class="library-external-icon">&#x2197;</span></h3>
        <p class="library-resource-desc">${escapeHtml(r.description)}</p>
        <div class="library-resource-source">${escapeHtml(r.source)}</div>
      </a>
    `).join('');
  }

  renderResources('All');

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    tabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderResources(activeCategory);
  });
}
