// import express from 'express';
// import ResumeEntry from '../../models/ResumeEntry.js';
// import requireAuth from '../../middleware/auth.js';

// const router = express.Router();

// router.use(requireAuth);

// // GET /api/admin/resume — flat list (unlike the public grouped response),
// // easier for the dashboard table to work with.
// router.get('/', async (req, res) => {
//   const entries = await ResumeEntry.find().sort('order');
//   res.json(entries);
// });

// // POST /api/admin/resume
// router.post('/', async (req, res) => {
//   try {
//     const entry = await ResumeEntry.create(req.body);
//     res.status(201).json(entry);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to create resume entry' });
//   }
// });

// // PUT /api/admin/resume/:id
// router.put('/:id', async (req, res) => {
//   try {
//     const entry = await ResumeEntry.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (!entry) return res.status(404).json({ error: 'Resume entry not found' });
//     res.json(entry);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to update resume entry' });
//   }
// });

// // DELETE /api/admin/resume/:id
// router.delete('/:id', async (req, res) => {
//   const entry = await ResumeEntry.findByIdAndDelete(req.params.id);
//   if (!entry) return res.status(404).json({ error: 'Resume entry not found' });
//   res.json({ ok: true });
// });

// export default router;
