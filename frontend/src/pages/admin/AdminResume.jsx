// import { useEffect, useState } from 'react';
// import {
//   adminGetResume,
//   adminCreateResumeEntry,
//   adminUpdateResumeEntry,
//   adminDeleteResumeEntry
// } from '../../api.js';

// const emptyForm = {
//   section: 'experience',
//   dateRange: '',
//   position: '',
//   company: '',
//   location: '',
//   descriptionsText: ''
// };

// export default function AdminResume() {
//   const [entries, setEntries] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [status, setStatus] = useState(null);

//   const loadEntries = () => adminGetResume().then(setEntries);

//   useEffect(() => {
//     document.title = 'Admin | Resume';
//     loadEntries();
//   }, []);

//   const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

//   const startEdit = (entry) => {
//     setEditingId(entry._id);
//     setForm({
//       section: entry.section,
//       dateRange: entry.dateRange || '',
//       position: entry.position || '',
//       company: entry.company || '',
//       location: entry.location || '',
//       descriptionsText: (entry.descriptions || []).join('\n')
//     });
//     setStatus(null);
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setForm(emptyForm);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setStatus(null);
//     const payload = {
//       section: form.section,
//       dateRange: form.dateRange,
//       position: form.position,
//       company: form.company,
//       location: form.location,
//       descriptions: form.descriptionsText.split('\n').map((d) => d.trim()).filter(Boolean)
//     };
//     try {
//       if (editingId) {
//         await adminUpdateResumeEntry(editingId, payload);
//         setStatus({ type: 'ok', message: 'Entry updated.' });
//       } else {
//         await adminCreateResumeEntry({ ...payload, order: entries.length });
//         setStatus({ type: 'ok', message: 'Entry added.' });
//       }
//       resetForm();
//       await loadEntries();
//     } catch (err) {
//       setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to save entry' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this resume entry? This cannot be undone.')) return;
//     await adminDeleteResumeEntry(id);
//     if (editingId === id) resetForm();
//     await loadEntries();
//   };

//   return (
//     <div>
//       <h1 className="admin-page-title">Resume</h1>
//       <p className="admin-page-sub">Add, edit, or remove experience and education entries.</p>

//       <form onSubmit={handleSubmit} className="admin-card">
//         <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>
//           {editingId ? 'Edit entry' : 'Add an entry'}
//         </h2>

//         <div className="admin-form-grid">
//           <div className="form-group">
//             <label className="form-label" htmlFor="r-section">Section</label>
//             <select id="r-section" className="form-input" value={form.section} onChange={setField('section')}>
//               <option value="experience">Experience</option>
//               <option value="education">Education</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="r-date">Date range</label>
//             <input id="r-date" className="form-input" value={form.dateRange} onChange={setField('dateRange')} placeholder="2021 – 2026" />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="r-position">Position</label>
//             <input id="r-position" className="form-input" value={form.position} onChange={setField('position')} />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="r-company">Company / institution</label>
//             <input id="r-company" className="form-input" value={form.company} onChange={setField('company')} />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="r-location">Location</label>
//             <input id="r-location" className="form-input" value={form.location} onChange={setField('location')} />
//           </div>
//           <div className="form-group form-group--full">
//             <label className="form-label" htmlFor="r-desc">Description (one bullet per line)</label>
//             <textarea
//               id="r-desc"
//               className="form-input form-textarea"
//               rows={4}
//               value={form.descriptionsText}
//               onChange={setField('descriptionsText')}
//             />
//           </div>
//         </div>

//         <div className="admin-save-row">
//           <button type="submit" className="btn btn-primary" disabled={saving}>
//             {saving ? 'Saving...' : editingId ? 'Update entry' : 'Add entry'}
//           </button>
//           {editingId && (
//             <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
//           )}
//           {status && (
//             <span className={`admin-status${status.type === 'error' ? ' admin-status--error' : ''}`}>
//               {status.message}
//             </span>
//           )}
//         </div>
//       </form>

//       <div className="admin-card">
//         <div className="admin-list-header">
//           <h2 className="section-heading">All entries ({entries.length})</h2>
//         </div>
//         <table className="admin-table">
//           <thead>
//             <tr>
//               <th>Section</th>
//               <th>Position</th>
//               <th>Company</th>
//               <th>Dates</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {entries.map((entry) => (
//               <tr key={entry._id}>
//                 <td style={{ textTransform: 'capitalize' }}>{entry.section}</td>
//                 <td>{entry.position}</td>
//                 <td>{entry.company}</td>
//                 <td>{entry.dateRange}</td>
//                 <td>
//                   <div className="admin-row-actions">
//                     <button className="btn btn-outline admin-btn-small" onClick={() => startEdit(entry)}>Edit</button>
//                     <button
//                       className="btn admin-btn-danger admin-btn-small"
//                       onClick={() => handleDelete(entry._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {entries.length === 0 && (
//               <tr><td colSpan={5}>No resume entries yet.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
