import express from 'express';
import Writing from '../../models/Writing.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/admin/writings — flat list, all categories, full content included
router.get('/', async (req, res) => {
  const writings = await Writing.find().sort({ category: 1, order: 1 });
  res.json(writings);
});

// POST /api/admin/writings
router.post('/', async (req, res) => {
  try {
    const writing = await Writing.create(req.body);
    res.status(201).json(writing);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create writing' });
  }
});

// PUT /api/admin/writings/:id
router.put('/:id', async (req, res) => {
  try {
    const writing = await Writing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!writing) return res.status(404).json({ error: 'Writing not found' });
    res.json(writing);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update writing' });
  }
});

// DELETE /api/admin/writings/:id
router.delete('/:id', async (req, res) => {
  const writing = await Writing.findByIdAndDelete(req.params.id);
  if (!writing) return res.status(404).json({ error: 'Writing not found' });
  res.json({ ok: true });
});

export default router;