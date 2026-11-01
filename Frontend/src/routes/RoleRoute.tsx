/**
 * RoleRoute component.
 * Blocks access for unauthorized roles, shows ForbiddenPage.
 * @see LLD 7.2, Section 9
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../store/authStore';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
