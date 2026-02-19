// API fetch wrapper
const API = {
  base: '/api',

  async fetch(endpoint, options = {}) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`API error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Companies
  getCompanies(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.fetch(`/companies${qs ? '?' + qs : ''}`);
  },

  getCompany(slug) {
    return this.fetch(`/companies/${slug}`);
  },

  // Analysis
  analyze(text) {
    return this.fetch('/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // Articles
  getArticles() {
    return this.fetch('/articles');
  },

  getArticle(slug) {
    return this.fetch(`/articles/${slug}`);
  },

  // Compare
  compare(slugs) {
    const qs = slugs.map(s => `companies=${s}`).join('&');
    return this.fetch(`/compare?${qs}`);
  },

  // Scorecard
  getScorecard() {
    return this.fetch('/scorecard');
  },

  // Search
  search(query) {
    return this.fetch(`/search?q=${encodeURIComponent(query)}`);
  },

  // Stats
  getStats() {
    return this.fetch('/stats');
  },

  // Glossary
  getGlossary() {
    return this.fetch('/glossary');
  },

  // Auth
  getMe() {
    return this.fetch('/auth/me');
  },

  getLoginUrl() {
    return this.fetch('/auth/login');
  },

  logout() {
    return this.fetch('/auth/logout', { method: 'POST' });
  },

  // Comments
  getComments(targetType, targetId) {
    return this.fetch(`/comments?target_type=${targetType}&target_id=${targetId}`);
  },

  postComment(targetType, targetId, content, parentId = null) {
    return this.fetch('/comments', {
      method: 'POST',
      body: JSON.stringify({ target_type: targetType, target_id: targetId, content, parent_id: parentId }),
    });
  },

  deleteComment(id) {
    return this.fetch(`/comments/${id}`, { method: 'DELETE' });
  },

  // Contributions
  getContributions() {
    return this.fetch('/contributions');
  },

  submitContribution(companySlug, companyName, data) {
    return this.fetch('/contributions', {
      method: 'POST',
      body: JSON.stringify({ company_slug: companySlug, company_name: companyName, data }),
    });
  },

  reviewContribution(id, status, reviewerNotes) {
    return this.fetch(`/contributions/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewer_notes: reviewerNotes }),
    });
  },

  // Votes
  getVotes(companyId) {
    return this.fetch(`/votes?company_id=${companyId}`);
  },

  castVote(companyId, flagId, vote) {
    return this.fetch('/votes', {
      method: 'POST',
      body: JSON.stringify({ company_id: companyId, flag_id: flagId, vote }),
    });
  },
};
