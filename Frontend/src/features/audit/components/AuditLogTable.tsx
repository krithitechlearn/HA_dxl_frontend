/**
 * AuditLogTable component.
 * Renders a paginated table of audit log entries.
 * @see US-011, API-035
 */
import type { AuditLogResponse } from '../types/audit.types';
import { Pagination } from '../../../components/common/Pagination';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../../utils/dateUtils';
import type { PagedResponse } from '../../../types/api.types';
import { AUDIT_MESSAGES } from '../../../messages';

interface AuditLogTableProps {
  data: PagedResponse<AuditLogResponse> | null;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function AuditLogTable({
  data,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: AuditLogTableProps) {
  if (!data || data.content.length === 0) {
    return <EmptyState message={AUDIT_MESSAGES.noLogs} />;
  }

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <table aria-label="Audit logs">
          <thead>
            <tr>
              <th scope="col">Actor</th>
              <th scope="col">Action</th>
              <th scope="col">Entity Type</th>
              <th scope="col">Entity ID</th>
              <th scope="col">IP Address</th>
              <th scope="col">Occurred At</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((log) => (
              <tr key={log.id}>
                <td style={{ fontWeight: 500 }}>{log.actorUsername}</td>
                <td>{log.action}</td>
                <td>{log.entityType}</td>
                <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {log.entityId.substring(0, 8)}…
                </td>
                <td>{log.ipAddress ?? '—'}</td>
                <td>{formatDateTime(log.occurredAt)}</td>
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
