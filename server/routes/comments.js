const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { requireAuth } = require('../lib/auth');

// GET /api/comments?target_type=company&target_id=5
router.get('/', (req, res) => {
  const { target_type, target_id } = req.query;
  if (!target_type || !target_id) {
    return res.status(400).json({ error: 'target_type and target_id required' });
  }

  const comments = db.all(`
    SELECT c.*, u.username, u.display_name, u.avatar_url, u.role
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.target_type = ? AND c.target_id = ?
    ORDER BY c.created_at ASC
  `, [target_type, Number(target_id)]);

  // Build threaded structure
  const map = {};
  const roots = [];
  for (const c of comments) {
    c.replies = [];
    map[c.id] = c;
  }
  for (const c of comments) {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(c);
    } else {
      roots.push(c);
    }
  }

  res.json(roots);
});

// POST /api/comments
router.post('/', requireAuth, (req, res) => {
  const { target_type, target_id, content, parent_id } = req.body;
  if (!target_type || !target_id || !content?.trim()) {
    return res.status(400).json({ error: 'target_type, target_id, and content required' });
  }

  // Validate parent exists and belongs to same target
  if (parent_id) {
    const parent = db.get('SELECT * FROM comments WHERE id = ? AND target_type = ? AND target_id = ?',
      [parent_id, target_type, target_id]);
    if (!parent) return res.status(400).json({ error: 'Invalid parent comment' });
  }

  const result = db.run(`
    INSERT INTO comments (user_id, target_type, target_id, content, parent_id)
    VALUES (?, ?, ?, ?, ?)
  `, [req.user.id, target_type, Number(target_id), content.trim(), parent_id || null]);

  const comment = db.get(`
    SELECT c.*, u.username, u.display_name, u.avatar_url, u.role
    FROM comments c JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `, [result.lastInsertRowid]);

  comment.replies = [];
  res.status(201).json(comment);
});

// PUT /api/comments/:id
router.put('/:id', requireAuth, (req, res) => {
  const comment = db.get('SELECT * FROM comments WHERE id = ?', [req.params.id]);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: 'Content required' });

  db.run("UPDATE comments SET content = ?, updated_at = datetime('now') WHERE id = ?",
    [content.trim(), req.params.id]);

  res.json({ ok: true });
});

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, (req, res) => {
  const comment = db.get('SELECT * FROM comments WHERE id = ?', [req.params.id]);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Delete replies first, then the comment
  db.run('DELETE FROM comments WHERE parent_id = ?', [req.params.id]);
  db.run('DELETE FROM comments WHERE id = ?', [req.params.id]);

  res.json({ ok: true });
});

module.exports = router;
