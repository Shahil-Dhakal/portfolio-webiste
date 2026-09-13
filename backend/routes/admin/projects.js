import express from 'express';
import Project from '../../models/Project.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/admin/projects — same data as the public route, but auth'd,
// so the dashboard can reuse one client for reads + writes.
router.get('/', async (req, res) => {
  const projects = await Project.find().sort('order');
  res.json(projects);
});

// POST /api/admin/projects
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create project' });
  }
});

// PUT /api/admin/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/:id', async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ ok: true });
});

export default router;
