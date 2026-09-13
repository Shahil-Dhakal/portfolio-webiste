import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// GET /api/profile — everything the Navbar, Footer, Home and Chat pages need
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ error: 'Profile not seeded yet' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
