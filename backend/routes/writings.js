import express from 'express';
import Writing from '../models/Writing.js';

const router = express.Router();

// GET /api/writings/:category — collection list for one category
router.get('/:category', async (req, res) => {
  const writings = await Writing.find({ category: req.params.category })
    .sort('order')
    .select('title excerpt category createdAt'); // no full content in the list view
  res.json(writings);
});

// GET /api/writings/:category/:id — a single piece, full content
router.get('/:category/:id', async (req, res) => {
  const writing = await Writing.findOne({ _id: req.params.id, category: req.params.category });
  if (!writing) return res.status(404).json({ error: 'Not found' });
  res.json(writing);
});

export default router;