/**
 * Application router.
 * Implements the route map from LLD 7.2 with lazy-loaded pages,
 * protected routes, and role-based access control.
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { RoleRoute } from './RoleRoute';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const UserListPage = lazy(() => import('../features/users/pages/UserListPage'));
const UserDetailPage = lazy(() => import('../features/users/pages/UserDetailPage'));
const RoomListPage = lazy(() => import('../features/rooms/pages/RoomListPage'));
const DeviceListPage = lazy(() => import('../features/devices/pages/DeviceListPage'));
const DeviceDetailPage = lazy(() => import('../features/devices/pages/DeviceDetailPage'));
const TelemetryDashboardPage = lazy(
  () => import('../features/telemetry/pages/TelemetryDashboardPage'),
);
const AutomationListPage = lazy(
  () => import('../features/automations/pages/AutomationListPage'),
);
const AutomationDetailPage = lazy(
  () => import('../features/automations/pages/AutomationDetailPage'),
);
const AuditLogPage = lazy(() => import('../features/audit/pages/AuditLogPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const ForbiddenPage = lazy(() => import('./ForbiddenPage'));

const PageFallback = () => <LoadingSpinner label="Loading page…" />;

export function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              {/* Redirect root to /devices */}
              <Route path="/" element={<Navigate to="/devices" replace />} />

              {/* Devices - ADMIN, USER, GUEST */}
              <Route
                element={
                  <RoleRoute allowedRoles={['ADMIN', 'USER', 'GUEST']} />
                }
              >
                <Route path="/devices" element={<DeviceListPage />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />
              </Route>

              {/* Telemetry - ADMIN, USER */}
              <Route element={<RoleRoute allowedRoles={['ADMIN', 'USER']} />}>
                <Route
                  path="/devices/:id/telemetry"
                  element={<TelemetryDashboardPage />}
                />
              </Route>

              {/* Rooms - ADMIN, USER, GUEST */}
              <Route
                element={
                  <RoleRoute allowedRoles={['ADMIN', 'USER', 'GUEST']} />
                }
              >
                <Route path="/rooms" element={<RoomListPage />} />
              </Route>

              {/* Automations - ADMIN, USER */}
              <Route element={<RoleRoute allowedRoles={['ADMIN', 'USER']} />}>
                <Route path="/automations" element={<AutomationListPage />} />
                <Route path="/automations/:id" element={<AutomationDetailPage />} />
              </Route>

              {/* Users - ADMIN only */}
              <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
              </Route>

              {/* Audit Logs - ADMIN only */}
              <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                <Route path="/audit-logs" element={<AuditLogPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
