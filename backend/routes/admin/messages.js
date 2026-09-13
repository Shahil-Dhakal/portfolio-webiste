import express from 'express';
import ContactMessage from '../../models/ContactMessage.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/admin/messages — newest first
router.get('/', async (req, res) => {
  const messages = await ContactMessage.find().sort('-createdAt');
  res.json(messages);
});

// DELETE /api/admin/messages/:id — optional cleanup once you've read one
router.delete('/:id', async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json({ ok: true });
});

export default router;