import SocialIcons from './SocialIcons.jsx';

export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <p className="footer-copy">&copy; {profile?.footerYear} by {profile?.name}.</p>
      <div className="footer-contact">
        <div className="footer-group">
          <span className="footer-label">Call</span>
          <span className="footer-value">{profile?.contact?.phone}</span>
        </div>
        <div className="footer-group">
          <span className="footer-label">Write</span>
          <span className="footer-value">{profile?.contact?.email}</span>
        </div>
        <div className="footer-group">
          <span className="footer-label">Follow</span>
          <div className="footer-socials">
            <SocialIcons socials={profile?.socials} />
          </div>
        </div>
      </div>
    </footer>
  );
}
