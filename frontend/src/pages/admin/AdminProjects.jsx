import { useEffect, useState } from 'react';
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminUploadImage
} from '../../api.js';

const emptyForm = { name: '', role: '', description: '', imageVariant: 'dark', imageUrl: '' };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const loadProjects = () => adminGetProjects().then(setProjects);

  useEffect(() => {
    document.title = 'Admin | Projects';
    loadProjects();
  }, []);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name || '',
      role: project.role || '',
      description: project.description || '',
      imageVariant: project.imageVariant || 'dark',
      imageUrl: project.imageUrl || ''
    });
    setStatus(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const { url } = await adminUploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (editingId) {
        await adminUpdateProject(editingId, form);
        setStatus({ type: 'ok', message: 'Project updated.' });
      } else {
        await adminCreateProject({ ...form, order: projects.length });
        setStatus({ type: 'ok', message: 'Project added.' });
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to save project' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    await adminDeleteProject(id);
    if (editingId === id) resetForm();
    await loadProjects();
  };

  return (
    <div>
      <h1 className="admin-page-title">Projects</h1>
      <p className="admin-page-sub">Add, edit, or remove entries shown on the Projects page.</p>

      <form onSubmit={handleSubmit} className="admin-card">
        <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>
          {editingId ? 'Edit project' : 'Add a project'}
        </h2>

        <div className="admin-form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="p-name">Name</label>
            <input id="p-name" className="form-input" value={form.name} onChange={setField('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-role">Role</label>
            <input id="p-role" className="form-input" value={form.role} onChange={setField('role')} />
          </div>
          <div className="form-group form-group--full">
            <label className="form-label" htmlFor="p-desc">Description</label>
            <textarea
              id="p-desc"
              className="form-input form-textarea"
              rows={3}
              value={form.description}
              onChange={setField('description')}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-variant">Fallback color (used if no image is uploaded)</label>
            <select id="p-variant" className="form-input" value={form.imageVariant} onChange={setField('imageVariant')}>
              <option value="dark">Dark</option>
              <option value="warm">Warm</option>
              <option value="slate">Slate</option>
              <option value="green">Green</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="admin-inline-hint">Uploading...</p>}
            {form.imageUrl && <img src={form.imageUrl} alt="" className="admin-thumb" style={{ marginTop: '0.5rem' }} />}
          </div>
        </div>

        <div className="admin-save-row">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update project' : 'Add project'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
          )}
          {status && (
            <span className={`admin-status${status.type === 'error' ? ' admin-status--error' : ''}`}>
              {status.message}
            </span>
          )}
        </div>
      </form>

      <div className="admin-card">
        <div className="admin-list-header">
          <h2 className="section-heading">All projects ({projects.length})</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt="" className="admin-thumb" />
                  ) : (
                    <div className={`admin-thumb project-image--${project.imageVariant}`} />
                  )}
                </td>
                <td>{project.name}</td>
                <td>{project.role}</td>
                <td>
                  <div className="admin-row-actions">
                    <button className="btn btn-outline admin-btn-small" onClick={() => startEdit(project)}>Edit</button>
                    <button
                      className="btn admin-btn-danger admin-btn-small"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={4}>No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
