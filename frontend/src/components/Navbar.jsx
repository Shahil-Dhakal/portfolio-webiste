import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'ABOUT ME' },
  // { to: '/resume', label: 'RESUME' },
  { to: '/projects', label: 'PROJECTS' },
  { to: '/writings', label: 'WRITINGS' },
  { to: '/contact', label: 'CONTACT' }
];

const isActivePath = (pathname, to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

export default function Navbar({ profile }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu whenever the route changes (mirrors the
  // "close on link tap" behaviour from main.js)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Navbar shadow on scroll — same threshold as main.js
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className="navbar"
        style={{ boxShadow: scrolled ? '0 2px 16px rgba(15,25,35,0.10)' : 'none' }}
      >
        <div className="nav-brand">
          <span className="brand-square"></span>
          <span className="brand-name">{profile?.name}</span>
          <span className="brand-divider">/</span>
          <span className="brand-role">{profile?.role}</span>
        </div>

        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link${isActivePath(pathname, item.to) ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`mobile-link${isActivePath(pathname, item.to) ? ' active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
