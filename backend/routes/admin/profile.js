import express from 'express';
import Profile from '../../models/Profile.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// PUT /api/admin/profile — full or partial update of the one Profile doc
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    const profile = await Profile.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
