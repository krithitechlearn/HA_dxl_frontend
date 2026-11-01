/**
 * UserTable component.
 * Renders a paginated list of users with action buttons.
 * @see US-002
 */
import type { UserResponse } from '../types/user.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDateTime } from '../../../utils/dateUtils';
import { useAuthStore } from '../../../store/authStore';

interface UserTableProps {
  users: UserResponse[];
  onEdit: (user: UserResponse) => void;
  onDeactivate: (user: UserResponse) => void;
  onChangePassword: (user: UserResponse) => void;
  onViewDetail: (user: UserResponse) => void;
}

export function UserTable({
  users,
  onEdit,
  onDeactivate,
  onChangePassword,
  onViewDetail,
}: UserTableProps) {
  const currentUser = useAuthStore((s) => s.user);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table aria-label="Users list">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <button
                  type="button"
                  onClick={() => onViewDetail(user)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  {user.username}
                </button>
              </td>
              <td>{user.email}</td>
              <td>
                <StatusBadge status={user.role} />
              </td>
              <td>
                <StatusBadge
                  status={user.isActive ? 'ACTIVE' : 'INACTIVE'}
                />
              </td>
              <td>{formatDateTime(user.createdAt)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
                    aria-label={`Edit ${user.username}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangePassword(user)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
                    aria-label={`Change password for ${user.username}`}
                  >
                    Password
                  </button>
                  {currentUser?.role === 'ADMIN' && user.isActive && (
                    <button
                      type="button"
                      onClick={() => onDeactivate(user)}
                      className="btn-danger"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
                      aria-label={`Deactivate ${user.username}`}
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
