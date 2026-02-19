const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/search?q=query
router.get('/', (req, res) => {
  const query = req.query.q;
  if (!query || query.length < 2) {
    return res.json([]);
  }

  // Sanitize for FTS5
  const ftsQuery = query.replace(/[^\w\s]/g, '').trim() + '*';

  try {
    const results = [];

    // Search companies
    try {
      const companies = db.all(
        `SELECT c.slug, c.name, c.summary
         FROM companies_fts fts
         JOIN companies c ON c.id = fts.rowid
         WHERE companies_fts MATCH ?
         LIMIT 5`,
        [ftsQuery]
      );
      for (const c of companies) {
        results.push({ type: 'company', slug: c.slug, title: c.name, excerpt: c.summary?.substring(0, 100) });
      }
    } catch (e) { /* FTS might not be populated */ }

    // Search articles
    try {
      const articles = db.all(
        `SELECT a.slug, a.title, a.summary
         FROM articles_fts fts
         JOIN articles a ON a.id = fts.rowid
         WHERE articles_fts MATCH ?
         LIMIT 5`,
        [ftsQuery]
      );
      for (const a of articles) {
        results.push({ type: 'article', slug: a.slug, title: a.title, excerpt: a.summary?.substring(0, 100) });
      }
    } catch (e) { /* FTS might not be populated */ }

    // Search glossary
    try {
      const terms = db.all(
        `SELECT g.term, g.definition
         FROM glossary_fts fts
         JOIN glossary g ON g.id = fts.rowid
         WHERE glossary_fts MATCH ?
         LIMIT 5`,
        [ftsQuery]
      );
      for (const t of terms) {
        results.push({ type: 'glossary', slug: '', title: t.term, excerpt: t.definition?.substring(0, 100) });
      }
    } catch (e) { /* FTS might not be populated */ }

    // Fallback: LIKE search if FTS returned nothing
    if (results.length === 0) {
      const likeQuery = `%${query}%`;
      const companies = db.all(
        'SELECT slug, name, summary FROM companies WHERE name LIKE ? OR summary LIKE ? LIMIT 5',
        [likeQuery, likeQuery]
      );
      for (const c of companies) {
        results.push({ type: 'company', slug: c.slug, title: c.name, excerpt: c.summary?.substring(0, 100) });
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
