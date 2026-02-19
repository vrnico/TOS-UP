const express = require('express');
const router = express.Router();
const { analyzeTOS } = require('../lib/analyzer');

// POST /api/analyze
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const result = analyzeTOS(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
