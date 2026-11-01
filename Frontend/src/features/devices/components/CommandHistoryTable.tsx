/**
 * CommandHistoryTable component.
 * Displays paginated command history for a device.
 * @see US-006, API-024
 */
import type { DeviceCommandResponse } from '../types/device.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Pagination } from '../../../components/common/Pagination';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../../utils/dateUtils';
import type { PagedResponse } from '../../../types/api.types';

interface CommandHistoryTableProps {
  data: PagedResponse<DeviceCommandResponse> | null;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function CommandHistoryTable({
  data,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: CommandHistoryTableProps) {
  if (isLoading) return <p style={{ color: '#6b7280', padding: '1rem' }}>Loading command history…</p>;

  if (!data || data.content.length === 0) {
    return <EmptyState message="No commands have been issued to this device yet." />;
  }

  return (
    <section aria-labelledby="command-history-title" className="card" style={{ padding: 0 }}>
      <h3
        id="command-history-title"
        style={{ fontSize: '1rem', fontWeight: 600, padding: '1rem 1rem 0' }}
      >
        Command History
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table aria-label="Command history">
          <thead>
            <tr>
              <th scope="col">Command</th>
              <th scope="col">Status</th>
              <th scope="col">Issued At</th>
              <th scope="col">Completed At</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((cmd) => (
              <tr key={cmd.id}>
                <td>{cmd.commandType.replace(/_/g, ' ')}</td>
                <td><StatusBadge status={cmd.status} variant="command" /></td>
                <td>{formatDateTime(cmd.issuedAt)}</td>
                <td>{formatDateTime(cmd.completedAt)}</td>
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
    </section>
  );
}
