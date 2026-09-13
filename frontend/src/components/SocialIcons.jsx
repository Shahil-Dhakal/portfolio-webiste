export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

export function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  );
}

export function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Renders the 4-icon row used in both the profile card and the footer.
// `linkClassName` lets callers reuse either ".social-link" or plain footer <a> styling.
export default function SocialIcons({ socials = {}, linkClassName }) {
  const items = [
    { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, href: socials.facebook || '#' },
    { key: 'twitter', label: 'Twitter', Icon: TwitterIcon, href: socials.twitter || '#' },
    { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon, href: socials.linkedin || '#' },
    { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, href: socials.instagram || '#' }
  ];

  return (
    <>
      {items.map(({ key, label, Icon, href }) => (
        <a key={key} href={href} className={linkClassName} aria-label={label}>
          <Icon />
        </a>
      ))}
    </>
  );
}
