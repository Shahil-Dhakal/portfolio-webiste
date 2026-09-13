import { useEffect, useState } from 'react';
import { getProfile, adminUpdateProfile, adminUploadImage } from '../../api.js';

const emptyForm = {
  name: '',
  role: '',
  avatarUrl: '',
  heroHeading: '',
  heroSub: '',
  heroBodyText: '',
  chatTagline: '',
  chatFirstUserMessage: '',
  chatFirstBotMessage: '',
  chatSuggestionsText: '',
  chatDisclaimer: '',
  socials: { facebook: '', twitter: '', linkedin: '', instagram: '' },
  contact: { phone: '', email: '' }
};

export default function AdminAbout() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'ok'|'error', message }
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.title = 'Admin | About & Contact';
    getProfile()
      .then((profile) => {
        setForm({
          name: profile.name || '',
          role: profile.role || '',
          avatarUrl: profile.avatarUrl || '',
          heroHeading: profile.heroHeading || '',
          heroSub: profile.heroSub || '',
          heroBodyText: (profile.heroBody || []).join('\n\n'),
          chatTagline: profile.chatTagline || '',
          chatFirstUserMessage: profile.chatFirstUserMessage || '',
          chatFirstBotMessage: profile.chatFirstBotMessage || '',
          chatSuggestionsText: (profile.chatSuggestions || []).join(', '),
          chatDisclaimer: profile.chatDisclaimer || '',
          socials: { ...emptyForm.socials, ...profile.socials },
          contact: { ...emptyForm.contact, ...profile.contact }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setSocial = (field) => (e) =>
    setForm((prev) => ({ ...prev, socials: { ...prev.socials, [field]: e.target.value } }));
  const setContact = (field) => (e) =>
    setForm((prev) => ({ ...prev, contact: { ...prev.contact, [field]: e.target.value } }));

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const { url } = await adminUploadImage(file);
      setForm((prev) => ({ ...prev, avatarUrl: url }));
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
      await adminUpdateProfile({
        name: form.name,
        role: form.role,
        avatarUrl: form.avatarUrl,
        heroHeading: form.heroHeading,
        heroSub: form.heroSub,
        heroBody: form.heroBodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        chatTagline: form.chatTagline,
        chatFirstUserMessage: form.chatFirstUserMessage,
        chatFirstBotMessage: form.chatFirstBotMessage,
        chatSuggestions: form.chatSuggestionsText.split(',').map((s) => s.trim()).filter(Boolean),
        chatDisclaimer: form.chatDisclaimer,
        socials: form.socials,
        contact: form.contact
      });
      setStatus({ type: 'ok', message: 'Saved. Refresh the site to see it live.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="admin-page-title">About &amp; Contact</h1>
      <p className="admin-page-sub">Everything shown on the About page, chat page, and footer.</p>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>Identity</h2>

          {form.avatarUrl && (
            <img src={form.avatarUrl} alt="Current avatar" className="admin-avatar-preview" />
          )}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Avatar image</label>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            {uploading && <p className="admin-inline-hint">Uploading...</p>}
          </div>

          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" className="form-input" value={form.name} onChange={setField('name')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Role / title</label>
              <input id="role" className="form-input" value={form.role} onChange={setField('role')} />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>Hero section</h2>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="heroHeading">Heading</label>
              <input id="heroHeading" className="form-input" value={form.heroHeading} onChange={setField('heroHeading')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="heroSub">Subheading</label>
              <input id="heroSub" className="form-input" value={form.heroSub} onChange={setField('heroSub')} />
            </div>
            <div className="form-group form-group--full admin-textarea-list">
              <label className="form-label" htmlFor="heroBodyText">About paragraphs (blank line between paragraphs)</label>
              <textarea
                id="heroBodyText"
                className="form-input form-textarea"
                rows={6}
                value={form.heroBodyText}
                onChange={setField('heroBodyText')}
              />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>Chat page</h2>
          <div className="admin-form-grid">
            <div className="form-group form-group--full">
              <label className="form-label" htmlFor="chatTagline">Tagline</label>
              <input id="chatTagline" className="form-input" value={form.chatTagline} onChange={setField('chatTagline')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="chatFirstUserMessage">Sample user message</label>
              <input id="chatFirstUserMessage" className="form-input" value={form.chatFirstUserMessage} onChange={setField('chatFirstUserMessage')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="chatFirstBotMessage">Sample bot reply</label>
              <input id="chatFirstBotMessage" className="form-input" value={form.chatFirstBotMessage} onChange={setField('chatFirstBotMessage')} />
            </div>
            <div className="form-group form-group--full">
              <label className="form-label" htmlFor="chatSuggestionsText">Suggestion chips (comma separated)</label>
              <input id="chatSuggestionsText" className="form-input" value={form.chatSuggestionsText} onChange={setField('chatSuggestionsText')} />
            </div>
            <div className="form-group form-group--full">
              <label className="form-label" htmlFor="chatDisclaimer">Disclaimer</label>
              <input id="chatDisclaimer" className="form-input" value={form.chatDisclaimer} onChange={setField('chatDisclaimer')} />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>Contact &amp; socials</h2>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input id="phone" className="form-input" value={form.contact.phone} onChange={setContact('phone')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" className="form-input" value={form.contact.email} onChange={setContact('email')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="facebook">Facebook URL</label>
              <input id="facebook" className="form-input" value={form.socials.facebook} onChange={setSocial('facebook')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="twitter">Twitter URL</label>
              <input id="twitter" className="form-input" value={form.socials.twitter} onChange={setSocial('twitter')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="linkedin">LinkedIn URL</label>
              <input id="linkedin" className="form-input" value={form.socials.linkedin} onChange={setSocial('linkedin')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="instagram">Instagram URL</label>
              <input id="instagram" className="form-input" value={form.socials.instagram} onChange={setSocial('instagram')} />
            </div>
          </div>
        </div>

        <div className="admin-save-row">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {status && (
            <span className={`admin-status${status.type === 'error' ? ' admin-status--error' : ''}`}>
              {status.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
