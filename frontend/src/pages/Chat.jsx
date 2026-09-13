import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, sendChatMessage } from '../api.js';

const AVATAR_FALLBACK =
  'https://ui-avatars.com/api/?name=Alex+Carter&size=160&background=1a1a2e&color=c8a96e&bold=true&font-size=0.4';

function handleAvatarError(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = AVATAR_FALLBACK;
}

export default function Chat() {
  const [profile, setProfile] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]); // { role: 'user' | 'assistant', content }
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    document.title = 'Chat with Shahil | Software Engineer';
    getProfile()
      .then((data) => {
        setProfile(data);
        // Seed the window with the same sample exchange as before — it's
        // real content, and doubles as the first turn of actual context.
        setMessages([
          { role: 'user', content: data.chatFirstUserMessage },
          { role: 'assistant', content: data.chatFirstBotMessage }
        ]);
      })
      .catch((err) => console.error('Failed to load profile', err));
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setError(null);
    const historyForRequest = messages; // conversation so far, before this new message
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInputValue('');
    setIsSending(true);

    try {
      const { reply } = await sendChatMessage(trimmed, historyForRequest);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  if (!profile) return null;

  return (
    <div className="chat-page">
      <div className="chat-page-topbar">
        <Link to="/" className="btn btn-outline chat-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          BACK
        </Link>
      </div>

      <main className="chat-page-main">
        <div className="chat-card">
          <div className="chat-card-header">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="chat-card-avatar"
              onError={handleAvatarError}
            />
            <span className="chat-card-name">{profile.name}</span>
          </div>

          <h1 className="chat-heading">Ask me anything</h1>
          <p className="chat-sub">{profile.chatTagline}</p>

          <div className="chat-window" aria-live="polite" ref={chatWindowRef}>
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <div className="chat-msg-user" key={i}>{msg.content}</div>
              ) : (
                <div className="chat-msg-bot" key={i}>
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="chat-avatar"
                    aria-hidden="true"
                    onError={handleAvatarError}
                  />
                  <span className="chat-bubble-bot">{msg.content}</span>
                </div>
              )
            )}

            {isSending && (
              <div className="chat-msg-bot">
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="chat-avatar"
                  aria-hidden="true"
                  onError={handleAvatarError}
                />
                <span className="chat-bubble-bot">...</span>
              </div>
            )}
          </div>

          {error && <p className="chat-sub" style={{ color: '#a02020' }}>{error}</p>}

          <div className="chat-suggestions">
            {profile.chatSuggestions?.map((suggestion) => (
              <button
                type="button"
                className="chat-chip"
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                disabled={isSending}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything..."
              aria-label="Type your message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
            />
            <button type="submit" className="chat-send" aria-label="Send message" disabled={isSending}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </form>

          <p className="chat-disclaimer">{profile.chatDisclaimer}</p>
        </div>
      </main>
    </div>
  );
}