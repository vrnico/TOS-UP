const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/companies - list all companies
router.get('/', (req, res) => {
  const { category, risk, sort, limit } = req.query;

  let sql = `
    SELECT c.*,
      (SELECT COUNT(*) FROM company_red_flags WHERE company_id = c.id) as flag_count
    FROM companies c
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'all') {
    sql += ' AND c.category = ?';
    params.push(category);
  }

  if (risk && risk !== 'all') {
    sql += ' AND c.overall_risk = ?';
    params.push(risk);
  }

  // Sort
  if (sort === 'risk-asc') sql += ' ORDER BY c.risk_score ASC';
  else if (sort === 'name-asc') sql += ' ORDER BY c.name ASC';
  else if (sort === 'name-desc') sql += ' ORDER BY c.name DESC';
  else if (sort === 'words-desc') sql += ' ORDER BY c.word_count DESC';
  else sql += ' ORDER BY c.risk_score DESC';

  if (limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  try {
    const companies = db.all(sql, params);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/companies/:slug - single company with all details
router.get('/:slug', (req, res) => {
  try {
    const company = db.get('SELECT * FROM companies WHERE slug = ?', [req.params.slug]);
    if (!company) return res.status(404).json({ error: 'Company not found' });

    // Get flags with definitions
    const flags = db.all(`
      SELECT rd.*, crf.evidence, crf.notes
      FROM company_red_flags crf
      JOIN red_flag_definitions rd ON rd.id = crf.flag_id
      WHERE crf.company_id = ?
      ORDER BY rd.category, rd.name
    `, [company.id]);

    // Get TOS sections
    const sections = db.all(
      'SELECT * FROM tos_sections WHERE company_id = ? ORDER BY section_order',
      [company.id]
    );

    res.json({ ...company, flags, sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
