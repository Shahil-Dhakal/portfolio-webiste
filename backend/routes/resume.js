// import express from 'express';
// import ResumeEntry from '../models/ResumeEntry.js';

// const router = express.Router();

// // GET /api/resume — returns { experience: [...], education: [...] }
// router.get('/', async (req, res) => {
//   try {
//     const entries = await ResumeEntry.find().sort('order');
//     const grouped = {
//       experience: entries.filter((e) => e.section === 'experience'),
//       education: entries.filter((e) => e.section === 'education')
//     };
//     res.json(grouped);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch resume' });
//   }
// });

// export default router;
