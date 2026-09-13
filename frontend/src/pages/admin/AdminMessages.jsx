import { useEffect, useState } from 'react';
import { adminGetMessages, adminDeleteMessage } from '../../api.js';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString();
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = () => adminGetMessages().then(setMessages).finally(() => setLoading(false));

  useEffect(() => {
    document.title = 'Admin | Messages';
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await adminDeleteMessage(id);
    await loadMessages();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="admin-page-title">Messages</h1>
      <p className="admin-page-sub">Everything submitted through the Contact page.</p>

      <div className="admin-card">
        <div className="admin-list-header">
          <h2 className="section-heading">All messages ({messages.length})</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{[msg.firstName, msg.lastName].filter(Boolean).join(' ')}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td style={{ maxWidth: '320px', whiteSpace: 'pre-wrap' }}>{msg.message}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(msg.createdAt)}</td>
                <td>
                  <button
                    className="btn admin-btn-danger admin-btn-small"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr><td colSpan={6}>No messages yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}