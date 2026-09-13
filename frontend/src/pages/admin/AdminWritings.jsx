import { useEffect, useState } from 'react';
import {
  adminGetWritings,
  adminCreateWriting,
  adminUpdateWriting,
  adminDeleteWriting
} from '../../api.js';
import { WRITING_CATEGORIES } from '../../writingCategories.js';

const emptyForm = { category: 'poems', title: '', excerpt: '', content: '' };

export default function AdminWritings() {
  const [writings, setWritings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const loadWritings = () => adminGetWritings().then(setWritings);

  useEffect(() => {
    document.title = 'Admin | Writings';
    loadWritings();
  }, []);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const startEdit = (writing) => {
    setEditingId(writing._id);
    setForm({
      category: writing.category,
      title: writing.title || '',
      excerpt: writing.excerpt || '',
      content: writing.content || ''
    });
    setStatus(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (editingId) {
        await adminUpdateWriting(editingId, form);
        setStatus({ type: 'ok', message: 'Writing updated.' });
      } else {
        await adminCreateWriting({ ...form, order: writings.length });
        setStatus({ type: 'ok', message: 'Writing added.' });
      }
      resetForm();
      await loadWritings();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to save writing' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this writing? This cannot be undone.')) return;
    await adminDeleteWriting(id);
    if (editingId === id) resetForm();
    await loadWritings();
  };

  const labelFor = (slug) => WRITING_CATEGORIES.find((c) => c.slug === slug)?.label || slug;

  return (
    <div>
      <h1 className="admin-page-title">Writings</h1>
      <p className="admin-page-sub">Add, edit, or remove poems, blogs, and stories.</p>

      <form onSubmit={handleSubmit} className="admin-card">
        <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>
          {editingId ? 'Edit writing' : 'Add a writing'}
        </h2>

        <div className="admin-form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="w-category">Category</label>
            <select id="w-category" className="form-input" value={form.category} onChange={setField('category')}>
              {WRITING_CATEGORIES.map((c) => (
                <option value={c.slug} key={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="w-title">Title</label>
            <input id="w-title" className="form-input" value={form.title} onChange={setField('title')} required />
          </div>
          <div className="form-group form-group--full">
            <label className="form-label" htmlFor="w-excerpt">Short excerpt (shown in the collection list)</label>
            <input id="w-excerpt" className="form-input" value={form.excerpt} onChange={setField('excerpt')} />
          </div>
          <div className="form-group form-group--full">
            <label className="form-label" htmlFor="w-content">Full content (blank line between paragraphs, or one line per verse)</label>
            <textarea
              id="w-content"
              className="form-input form-textarea"
              rows={10}
              value={form.content}
              onChange={setField('content')}
              required
            />
          </div>
        </div>

        <div className="admin-save-row">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update writing' : 'Add writing'}
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
          <h2 className="section-heading">All writings ({writings.length})</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Title</th>
              <th>Excerpt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {writings.map((writing) => (
              <tr key={writing._id}>
                <td>{labelFor(writing.category)}</td>
                <td>{writing.title}</td>
                <td>{writing.excerpt}</td>
                <td>
                  <div className="admin-row-actions">
                    <button className="btn btn-outline admin-btn-small" onClick={() => startEdit(writing)}>Edit</button>
                    <button
                      className="btn admin-btn-danger admin-btn-small"
                      onClick={() => handleDelete(writing._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {writings.length === 0 && (
              <tr><td colSpan={4}>No writings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}