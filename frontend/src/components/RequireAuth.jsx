import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../api.js';

export default function RequireAuth() {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/shahil" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
