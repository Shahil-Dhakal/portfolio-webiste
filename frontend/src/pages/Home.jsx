import { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import SocialIcons from '../components/SocialIcons.jsx';

const AVATAR_FALLBACK =
  'https://ui-avatars.com/api/?name=Shahil+Dhakal&size=160&background=1a1a2e&color=c8a96e&bold=true&font-size=0.4';

function handleAvatarError(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = AVATAR_FALLBACK;
}

export default function Home() {
  const { profile } = useOutletContext();

  useEffect(() => {
    document.title = 'Shahil Dhakal | Software Engineer';
  }, []);

  if (!profile) return null;

  return (
    <main className="hero">
      <div className="hero-left">
        <div className="profile-card">
          <div className="profile-img-wrapper">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="profile-img"
              onError={handleAvatarError}
            />
          </div>
          <h2 className="profile-name">
            {profile.name.split(' ').map((part, i) => (
              <span key={i}>
                {part}
                {i < profile.name.split(' ').length - 1 && <br />}
              </span>
            ))}
          </h2>
          <div className="profile-divider"></div>
          <p className="profile-role">{profile.role}</p>
          <div className="profile-socials">
            <SocialIcons socials={profile.socials} linkClassName="social-link" />
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-text">
          <h1 className="hero-heading">{profile.heroHeading}</h1>
          <p className="hero-sub">{profile.heroSub}</p>
          <div className="hero-cta">
            {/* <Link to="/resume" className="btn btn-primary">RESUME</Link> */}
            <Link to="/projects" className="btn btn-primary">PROJECTS</Link>
            <Link to="/chat" className="btn btn-outline">CHAT WITH MY ASSISTANT</Link>
          </div>
          {profile.heroBody?.map((paragraph, i) => (
            <p className="hero-body" key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
