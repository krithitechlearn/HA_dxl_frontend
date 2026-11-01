/**
 * Sidebar navigation component.
 * Role-based menu items per LLD 7.2 and Section 9.
 */
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  label: string;
  path: string;
  roles: Array<'ADMIN' | 'USER' | 'GUEST'>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Devices', path: '/devices', roles: ['ADMIN', 'USER', 'GUEST'] },
  { label: 'Rooms', path: '/rooms', roles: ['ADMIN', 'USER', 'GUEST'] },
  { label: 'Automations', path: '/automations', roles: ['ADMIN', 'USER'] },
  { label: 'Users', path: '/users', roles: ['ADMIN'] },
  { label: 'Audit Logs', path: '/audit-logs', roles: ['ADMIN'] },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  const visibleItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <aside
      aria-label="Main navigation"
      style={{
        width: '14rem',
        minHeight: '100vh',
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        padding: '1rem 0',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '0 1rem 1.5rem',
          borderBottom: '1px solid #374151',
          marginBottom: '1rem',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#f9fafb' }}>
          HA DXL
        </span>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {visibleItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.625rem 1rem',
                  color: isActive ? '#60a5fa' : '#d1d5db',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#374151' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                })}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
