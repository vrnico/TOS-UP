async function renderAboutPage(container) {
  container.innerHTML = `
    <div class="container container--narrow page fade-in">
      <h1 class="section-title mb-lg">About ToS-Up</h1>

      <div class="about-section">
        <h2>What is ToS-Up?</h2>
        <p>
          ToS-Up is like Rotten Tomatoes for Terms of Service. We scored 12 major platforms
          across 15 categories on a 1&ndash;5 scale so you can see at a glance who actually
          respects your rights &mdash; and who doesn't.
        </p>
        <p>
          Each platform receives a TOS-Up Score (0&ndash;100) based on its category scores.
          Gap flags highlight areas where a platform's practices diverge from its stated terms,
          surfacing hidden risks that a simple score might miss.
        </p>
      </div>

      <div class="about-section">
        <h2>Methodology</h2>
        <p>
          Our scoring covers 15 categories grouped into 5 themes:
        </p>
        <div class="flex gap-sm flex-wrap mb-md">
          <span class="badge badge--privacy">Data &amp; Privacy</span>
          <span class="badge badge--legal">Legal Rights</span>
          <span class="badge badge--content">Content &amp; IP</span>
          <span class="badge badge--financial">Platform Power</span>
          <span class="badge badge--account">Accountability</span>
        </div>
        <p>
          Each category is scored 1 (worst) to 5 (best) based on analysis of publicly available
          Terms of Service documents. Scores are combined into an overall TOS-Up Score
          (0&ndash;100). Gap flags are raised when a platform's real-world practices diverge from
          what their TOS states &mdash; for example, claiming data portability but making it
          nearly impossible in practice.
        </p>
        <p>
          This is an educational tool, not legal advice.
        </p>
      </div>

      <div class="about-section">
        <h2>Built by themultiverse.school</h2>
        <p>
          ToS-Up is built by <a href="https://themultiverse.school" target="_blank" rel="noopener noreferrer">themultiverse.school</a>,
          a learning program that teaches critical technology literacy through hands-on
          web development. Students learn to build real tools while developing a critical lens
          on how platforms, algorithms, and Terms of Service shape our digital lives.
        </p>
      </div>

      <div class="about-section">
        <h2>Glossary</h2>
        <div id="glossaryList" class="glossary-list"></div>
      </div>
    </div>
  `;

  // Load glossary
  try {
    const glossary = await API.getGlossary();
    const list = $('#glossaryList', container);
    if (glossary && glossary.length > 0) {
      for (const item of glossary) {
        list.innerHTML += `
          <div class="glossary-item">
            <div class="glossary-term">${escapeHtml(item.term)}</div>
            <div class="glossary-definition">${escapeHtml(item.definition)}</div>
          </div>
        `;
      }
    } else {
      list.innerHTML = '<p class="text-muted">Glossary coming soon.</p>';
    }
  } catch (err) {
    $('#glossaryList', container).innerHTML = '<p class="text-muted">Glossary coming soon.</p>';
  }
}
