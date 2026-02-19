const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/compare?companies=slug1&companies=slug2
router.get('/', (req, res) => {
  let slugs = req.query.companies;
  if (!slugs) return res.status(400).json({ error: 'Provide ?companies=slug1&companies=slug2' });
  if (!Array.isArray(slugs)) slugs = [slugs];
  if (slugs.length < 2) return res.status(400).json({ error: 'Need at least 2 companies' });

  try {
    // Get companies
    const placeholders = slugs.map(() => '?').join(',');
    const companies = db.all(
      `SELECT * FROM companies WHERE slug IN (${placeholders})`,
      slugs
    );

    if (companies.length < 2) {
      return res.status(404).json({ error: 'Some companies not found' });
    }

    // Get all flag definitions
    const flags = db.all('SELECT * FROM red_flag_definitions ORDER BY category, name');

    // For each flag, check which companies have it
    for (const flag of flags) {
      flag.company_flags = {};
      for (const company of companies) {
        const has = db.get(
          'SELECT id FROM company_red_flags WHERE company_id = ? AND flag_id = ?',
          [company.id, flag.id]
        );
        if (has) flag.company_flags[company.slug] = true;
      }
    }

    res.json({ companies, flags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
