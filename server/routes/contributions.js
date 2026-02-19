const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { requireAuth, requireRole } = require('../lib/auth');

// GET /api/contributions - list (own for members, all for admins)
router.get('/', requireAuth, (req, res) => {
  let contributions;
  if (req.user.role === 'admin' || req.user.role === 'moderator') {
    contributions = db.all(`
      SELECT c.*, u.username, u.avatar_url
      FROM contributions c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
  } else {
    contributions = db.all(`
      SELECT c.*, u.username, u.avatar_url
      FROM contributions c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [req.user.id]);
  }
  res.json(contributions);
});

// POST /api/contributions - submit a new company analysis
router.post('/', requireAuth, (req, res) => {
  const { company_slug, company_name, data } = req.body;
  if (!company_slug || !company_name || !data) {
    return res.status(400).json({ error: 'company_slug, company_name, and data required' });
  }

  const result = db.run(`
    INSERT INTO contributions (user_id, company_slug, company_name, data)
    VALUES (?, ?, ?, ?)
  `, [req.user.id, company_slug, company_name, typeof data === 'string' ? data : JSON.stringify(data)]);

  res.status(201).json({ id: Number(result.lastInsertRowid), status: 'pending' });
});

// PUT /api/contributions/:id/review - admin review
router.put('/:id/review', requireRole('admin', 'moderator'), (req, res) => {
  const { status, reviewer_notes } = req.body;
  if (!['approved', 'rejected', 'needs_revision'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved, rejected, or needs_revision' });
  }

  const contribution = db.get('SELECT * FROM contributions WHERE id = ?', [req.params.id]);
  if (!contribution) return res.status(404).json({ error: 'Not found' });

  db.run(`
    UPDATE contributions SET status = ?, reviewer_notes = ?, reviewed_by = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [status, reviewer_notes || null, req.user.id, req.params.id]);

  res.json({ ok: true, status });
});

module.exports = router;
