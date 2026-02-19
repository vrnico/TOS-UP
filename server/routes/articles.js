const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/articles - list all articles
router.get('/', (req, res) => {
  try {
    const articles = db.all(
      'SELECT id, slug, title, subtitle, author, category, summary, read_time, is_flagship, sort_order FROM articles ORDER BY sort_order'
    );
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/:slug - single article
router.get('/:slug', (req, res) => {
  try {
    const article = db.get('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
