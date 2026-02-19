async function renderLearnPage(container) {
  container.innerHTML = `
    <div class="container container--narrow page fade-in">
      <div class="learn-landing">
        <h1 class="section-title">Continue Learning</h1>
        <p class="learn-description">
          ToS-Up is built by <strong>themultiverse.school</strong>, a learning program that teaches
          critical technology literacy through hands-on web development. Explore how code, data,
          and platform power shape our digital lives.
        </p>
        <ul class="learn-highlights">
          <li>Build real tools that analyze and decode Terms of Service</li>
          <li>Learn full-stack web development with HTML, CSS, JavaScript, and Node.js</li>
          <li>Develop a critical lens on surveillance capitalism, digital rights, and platform power</li>
        </ul>
        <a href="https://themultiverse.school" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg learn-cta">
          Visit themultiverse.school &rarr;
        </a>
      </div>
    </div>
  `;
}
