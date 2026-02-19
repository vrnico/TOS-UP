const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { requireAuth } = require('../lib/auth');

// GET /api/votes?company_id=5 - get vote tallies for a company's flags
router.get('/', (req, res) => {
  const { company_id } = req.query;
  if (!company_id) return res.status(400).json({ error: 'company_id required' });

  const votes = db.all(`
    SELECT flag_id,
      SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) as agrees,
      SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) as disagrees
    FROM flag_votes
    WHERE company_id = ?
    GROUP BY flag_id
  `, [Number(company_id)]);

  // Also get current user's votes if logged in
  let userVotes = {};
  if (req.user) {
    const uv = db.all(
      'SELECT flag_id, vote FROM flag_votes WHERE user_id = ? AND company_id = ?',
      [req.user.id, Number(company_id)]
    );
    for (const v of uv) userVotes[v.flag_id] = v.vote;
  }

  const tally = {};
  for (const v of votes) {
    tally[v.flag_id] = { agrees: v.agrees, disagrees: v.disagrees };
  }

  res.json({ votes: tally, userVotes });
});

// POST /api/votes - cast or update a vote
router.post('/', requireAuth, (req, res) => {
  const { company_id, flag_id, vote } = req.body;
  if (!company_id || !flag_id || ![1, -1, 0].includes(vote)) {
    return res.status(400).json({ error: 'company_id, flag_id, and vote (1, -1, or 0) required' });
  }

  if (vote === 0) {
    // Remove vote
    db.run(
      'DELETE FROM flag_votes WHERE user_id = ? AND company_id = ? AND flag_id = ?',
      [req.user.id, company_id, flag_id]
    );
  } else {
    // Upsert vote
    const existing = db.get(
      'SELECT id FROM flag_votes WHERE user_id = ? AND company_id = ? AND flag_id = ?',
      [req.user.id, company_id, flag_id]
    );
    if (existing) {
      db.run('UPDATE flag_votes SET vote = ? WHERE id = ?', [vote, existing.id]);
    } else {
      db.run(
        'INSERT INTO flag_votes (user_id, company_id, flag_id, vote) VALUES (?, ?, ?, ?)',
        [req.user.id, company_id, flag_id, vote]
      );
    }
  }

  res.json({ ok: true });
});

module.exports = router;
