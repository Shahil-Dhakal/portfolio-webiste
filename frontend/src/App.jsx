import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
// import Resume from './pages/Resume.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Chat from './pages/Chat.jsx';
import Writings from './pages/Writings.jsx';
import WritingCategory from './pages/WritingCategory.jsx';
import WritingArticle from './pages/WritingArticle.jsx';
import AdminWritings from './pages/admin/AdminWritings.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Login from './pages/admin/Login.jsx';
import AdminAbout from './pages/admin/AdminAbout.jsx';
import AdminProjects from './pages/admin/AdminProjects.jsx';
// import AdminResume from './pages/admin/AdminResume.jsx';
import AdminMessages from './pages/admin/AdminMessages.jsx';

export default function App() {
  return (
    <Routes>
      {/* Chat page has its own standalone layout — no navbar/footer, matching chat.html */}
      <Route path="/chat" element={<Chat />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/resume" element={<Resume />} /> */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/writings" element={<Writings />} />
        <Route path="/writings/:category" element={<WritingCategory />} />
        <Route path="/writings/:category/:id" element={<WritingArticle />} />
      </Route>

      {/* Admin login lives at /shahil, not /admin or /login */}
      <Route path="/shahil" element={<Login />} />

      <Route path="/shahil/dashboard" element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="about" replace />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="projects" element={<AdminProjects />} />
          {/* <Route path="resume" element={<AdminResume />} />
          <Route path="resume" element={<AdminResume />} /> */}
          <Route path="messages" element={<AdminMessages />} />
          <Route path="writings" element={<AdminWritings />} />
        </Route>
      </Route>
    </Routes>
  );
}
