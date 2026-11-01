/**
 * AutomationDetailPage.
 * Shows details for a single automation rule including execution logs.
 * @see US-009, US-010, API-029, API-034
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useAutomationById, useExecutionLogs } from '../hooks/useAutomations';
import { usePagination } from '../../../hooks/usePagination';
import { ExecutionLogTable } from '../components/ExecutionLogTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDateTime } from '../../../utils/dateUtils';

export default function AutomationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rule, isLoading, error } = useAutomationById(id ?? '');
  const { page, size, setPage, setSize } = usePagination();
  const { data: logData, isLoading: logLoading } = useExecutionLogs(id ?? '', page, size);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div
        role="alert"
        style={{
          color: '#991b1b',
          padding: '1rem',
          backgroundColor: '#fee2e2',
          borderRadius: '0.375rem',
        }}
      >
        {error}
      </div>
    );
  }
  if (!rule) return null;

  return (
    <div>
      <PageHeader
        title={rule.name}
        subtitle={`Trigger: ${rule.triggerType}`}
        actions={
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Back
          </button>
        }
      />

      <div className="card" style={{ marginBottom: '1rem' }}>
        <dl style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem 1rem' }}>
          <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Status</dt>
          <dd>
            <StatusBadge
              status={rule.isEnabled ? 'ENABLED' : 'DISABLED'}
            />
          </dd>
          <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Trigger</dt>
          <dd style={{ fontSize: '0.875rem' }}>{rule.triggerType}</dd>
          <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Actions</dt>
          <dd style={{ fontSize: '0.875rem' }}>{rule.actions.length}</dd>
          <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Last Triggered</dt>
          <dd style={{ fontSize: '0.875rem' }}>{formatDateTime(rule.lastTriggeredAt)}</dd>
          <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Created</dt>
          <dd style={{ fontSize: '0.875rem' }}>{formatDateTime(rule.createdAt)}</dd>
        </dl>
      </div>

      <ExecutionLogTable
        data={logData}
        isLoading={logLoading}
        currentPage={page}
        pageSize={size}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />
    </div>
  );
}
