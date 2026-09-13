import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../api.js';

const NAV_ITEMS = [
  { to: '/shahil/dashboard/about', label: 'About & Contact' },
  { to: '/shahil/dashboard/projects', label: 'Projects' },
  // { to: '/shahil/dashboard/resume', label: 'Resume' },
  { to: '/shahil/dashboard/writings', label: 'Writings' },
  { to: '/shahil/dashboard/messages', label: 'Messages' }
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/shahil', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Admin</div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>Log out</button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
