/**
 * ExecutionLogTable component.
 * Displays paginated automation execution logs.
 * @see US-010, API-034
 */
import type { AutomationExecutionLogResponse } from '../types/automation.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Pagination } from '../../../components/common/Pagination';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../../utils/dateUtils';
import type { PagedResponse } from '../../../types/api.types';

interface ExecutionLogTableProps {
  data: PagedResponse<AutomationExecutionLogResponse> | null;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ExecutionLogTable({
  data,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ExecutionLogTableProps) {
  if (isLoading) return <p style={{ color: '#6b7280', padding: '1rem' }}>Loading execution logs…</p>;
  if (!data || data.content.length === 0) {
    return <EmptyState message="No execution logs found for this rule." />;
  }

  return (
    <div className="card" style={{ padding: 0 }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, padding: '1rem 1rem 0' }}>Execution Logs</h3>
      <div style={{ overflowX: 'auto' }}>
        <table aria-label="Automation execution logs">
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Trigger Detail</th>
              <th scope="col">Error</th>
              <th scope="col">Executed At</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((log) => (
              <tr key={log.id}>
                <td><StatusBadge status={log.status} variant="automation" /></td>
                <td>{log.triggerDetail ?? '—'}</td>
                <td style={{ color: '#ef4444', fontSize: '0.8rem' }}>{log.errorMessage ?? '—'}</td>
                <td>{formatDateTime(log.executedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '0 1rem' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          pageSize={pageSize}
          totalElements={data.totalElements}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
