const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/stats
router.get('/', (req, res) => {
  try {
    const companyCount = db.get('SELECT COUNT(*) as count FROM companies');
    const flagCount = db.get('SELECT COUNT(*) as count FROM red_flag_definitions');
    const totalWords = db.get('SELECT SUM(word_count) as total FROM companies');
    const articleCount = db.get('SELECT COUNT(*) as count FROM articles');
    const avgRisk = db.get('SELECT AVG(risk_score) as avg FROM companies');
    const highestRisk = db.get('SELECT name, risk_score FROM companies ORDER BY risk_score DESC LIMIT 1');

    res.json({
      company_count: companyCount?.count || 0,
      flag_count: flagCount?.count || 0,
      total_words: totalWords?.total || 0,
      article_count: articleCount?.count || 0,
      avg_risk: Math.round(avgRisk?.avg || 0),
      highest_risk: highestRisk || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
