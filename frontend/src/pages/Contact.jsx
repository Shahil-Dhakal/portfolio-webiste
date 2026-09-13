import { useEffect, useState } from 'react';
import { sendContactMessage } from '../api.js';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Shahil Dhakal | Contact';
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSend = async () => {
    if (!form.firstName.trim() || !form.email.trim()) {
      alert('Please fill in at least your name and email.');
      return;
    }

    try {
      await sendContactMessage(form);
      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Something went wrong sending your message. Please try again.');
    }
  };

  return (
    <main className="page-main contact-main">
      <div className="page-hero">
        <h1 className="page-title">
          <span className="title-square"></span>Let&apos;s talk
        </h1>
      </div>

      <div className="contact-container">
        <div className="contact-form-card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                className="form-input"
                required
                value={form.firstName}
                onChange={handleChange('firstName')}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                className="form-input"
                required
                value={form.lastName}
                onChange={handleChange('lastName')}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              className="form-input"
              required
              value={form.email}
              onChange={handleChange('email')}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              className="form-input"
              value={form.subject}
              onChange={handleChange('subject')}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="form-input form-textarea"
              rows={4}
              value={form.message}
              onChange={handleChange('message')}
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
          <p className="form-success" style={{ display: showSuccess ? 'block' : 'none' }}>
            Thank you for reaching out. I&apos;ll get in touch soon.
          </p>
        </div>
      </div>
    </main>
  );
}
