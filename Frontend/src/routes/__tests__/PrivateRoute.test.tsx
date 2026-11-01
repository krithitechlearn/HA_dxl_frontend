/**
 * PrivateRoute tests.
 * @see LLD 7.2, Section 9
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute';
import { useAuthStore } from '../../store/authStore';

// Mock Layout to avoid sidebar/navbar rendering complexity
jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Navbar to avoid logout complexity
jest.mock('../../components/common/Navbar', () => ({
  Navbar: () => <nav>Navbar</nav>,
}));

describe('PrivateRoute [US-001]', () => {
  it('should redirect unauthenticated users to /login', () => {
    // Set unauthenticated state
    useAuthStore.setState({ user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/devices']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<PrivateRoute />}>
            <Route path="/devices" element={<div>Devices Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Devices Page')).not.toBeInTheDocument();
  });

  it('should render protected content for authenticated users', () => {
    useAuthStore.setState({
      user: { id: '1', username: 'admin', email: 'admin@test.com', role: 'ADMIN' },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/devices']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<PrivateRoute />}>
            <Route path="/devices" element={<div>Devices Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Devices Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
