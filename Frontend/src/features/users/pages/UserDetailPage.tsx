/**
 * UserDetailPage.
 * Shows details for a single user. Accessible by ADMIN or the user themselves.
 * @see US-002, API-006
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useUserById } from '../hooks/useUsers';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDateTime } from '../../../utils/dateUtils';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading, error } = useUserById(id ?? '');

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div role="alert" style={{ color: '#991b1b', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
        {error}
      </div>
    );
  }
  if (!user) return null;

  return (
    <div>
      <PageHeader
        title={user.username}
        actions={
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Back
          </button>
        }
      />
      <div className="card">
        <dl style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem 1rem' }}>
          <dt style={{ fontWeight: 600, color: '#374151' }}>Username</dt>
          <dd>{user.username}</dd>
          <dt style={{ fontWeight: 600, color: '#374151' }}>Email</dt>
          <dd>{user.email}</dd>
          <dt style={{ fontWeight: 600, color: '#374151' }}>Role</dt>
          <dd><StatusBadge status={user.role} /></dd>
          <dt style={{ fontWeight: 600, color: '#374151' }}>Status</dt>
          <dd><StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} /></dd>
          <dt style={{ fontWeight: 600, color: '#374151' }}>Created</dt>
          <dd>{formatDateTime(user.createdAt)}</dd>
          <dt style={{ fontWeight: 600, color: '#374151' }}>Updated</dt>
          <dd>{formatDateTime(user.updatedAt)}</dd>
        </dl>
      </div>
    </div>
  );
}
