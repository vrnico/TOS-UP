const express = require('express');
const router = express.Router();
const { analyzeOverlap, compareOverlap } = require('../lib/overlap-analyzer');
const db = require('../lib/db');

// POST /api/overlap/analyze - Analyze a single ToS for overlap risk patterns
router.post('/analyze', (req, res) => {
  const { text, product_name } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const result = analyzeOverlap(text, product_name || 'Unknown Product');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/overlap/compare - Compare two ToS documents for cross-product overlap
router.post('/compare', (req, res) => {
  const { product_a, product_b } = req.body;

  if (!product_a?.text || !product_b?.text) {
    return res.status(400).json({
      error: 'Provide product_a and product_b, each with { name, text, parentCompany? }'
    });
  }

  try {
    const result = compareOverlap(product_a, product_b);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/overlap/siblings?parent=Alphabet+Inc - Find companies under the same parent
router.get('/siblings', (req, res) => {
  const { parent } = req.query;
  if (!parent) {
    return res.status(400).json({ error: 'Provide ?parent=Company+Name' });
  }

  try {
    const siblings = db.all(
      'SELECT slug, name, parent_company, risk_score, overall_risk FROM companies WHERE parent_company = ?',
      [parent]
    );
    res.json(siblings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/overlap/parents - List all parent companies that have multiple products
router.get('/parents', (_req, res) => {
  try {
    const parents = db.all(`
      SELECT parent_company, COUNT(*) as product_count, GROUP_CONCAT(name) as products
      FROM companies
      WHERE parent_company IS NOT NULL AND parent_company != ''
      GROUP BY parent_company
      HAVING COUNT(*) >= 2
      ORDER BY product_count DESC
    `);
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
