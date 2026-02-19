const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/glossary
router.get('/', (req, res) => {
  try {
    const terms = db.all('SELECT * FROM glossary ORDER BY term');
    res.json(terms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
