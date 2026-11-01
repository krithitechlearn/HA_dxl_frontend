/**
 * RoleRoute tests.
 * @see LLD 7.2, Section 9
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleRoute } from '../RoleRoute';
import { useAuthStore } from '../../store/authStore';

describe('RoleRoute [US-001]', () => {
  it('should redirect to /forbidden when user role is not allowed', () => {
    useAuthStore.setState({
      user: { id: '1', username: 'guest', email: 'guest@test.com', role: 'GUEST' },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/audit-logs']}>
        <Routes>
          <Route path="/forbidden" element={<div>Forbidden Page</div>} />
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/audit-logs" element={<div>Audit Logs</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
    expect(screen.queryByText('Audit Logs')).not.toBeInTheDocument();
  });

  it('should render content for allowed role', () => {
    useAuthStore.setState({
      user: { id: '1', username: 'admin', email: 'admin@test.com', role: 'ADMIN' },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/audit-logs']}>
        <Routes>
          <Route path="/forbidden" element={<div>Forbidden Page</div>} />
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/audit-logs" element={<div>Audit Logs</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    expect(screen.queryByText('Forbidden Page')).not.toBeInTheDocument();
  });
});
