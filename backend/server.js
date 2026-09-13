import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import projectRoutes from './routes/projects.js';
// import resumeRoutes from './routes/resume.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import writingRoutes from './routes/writings.js';
import adminWritingRoutes from './routes/admin/writings.js';
import adminProfileRoutes from './routes/admin/profile.js';
import adminProjectRoutes from './routes/admin/projects.js';
// import adminResumeRoutes from './routes/admin/resume.js';
import adminMessagesRoutes from './routes/admin/messages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);

// Uploaded images (avatar, project screenshots)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public, read-only routes used by the site itself
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/resume', resumeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/writings', writingRoutes);

// Auth
app.use('/api/auth', authRoutes);

// Admin-only routes (all protected by JWT inside each router)
app.use('/api/admin/profile', adminProfileRoutes);
app.use('/api/admin/projects', adminProjectRoutes);
// app.use('/api/admin/resume', adminResumeRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/messages', adminMessagesRoutes);
app.use('/api/admin/writings', adminWritingRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
