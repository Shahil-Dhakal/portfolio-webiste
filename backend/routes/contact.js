import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ error: 'First name and email are required.' });
    }

    const saved = await ContactMessage.create({ firstName, lastName, email, subject, message });
    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
