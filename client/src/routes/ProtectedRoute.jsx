import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/** Blocks unauthenticated users. Wrap protected route trees with this. */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // could render a splash/spinner here
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

/** Blocks users whose role isn't in `roles`. Use nested inside ProtectedRoute. */
export function RoleRoute({ roles }) {
  const { hasRole } = useAuth();
  if (!hasRole(...roles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
