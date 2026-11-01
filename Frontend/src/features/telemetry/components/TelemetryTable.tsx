/**
 * TelemetryTable component.
 * Renders a paginated table of telemetry readings.
 * @see US-007, API-026
 */
import type { TelemetryResponse } from '../types/telemetry.types';
import { Pagination } from '../../../components/common/Pagination';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../../utils/dateUtils';
import type { PagedResponse } from '../../../types/api.types';
import { TELEMETRY_MESSAGES } from '../../../messages';

interface TelemetryTableProps {
  data: PagedResponse<TelemetryResponse> | null;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TelemetryTable({
  data,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TelemetryTableProps) {
  if (!data || data.content.length === 0) {
    return <EmptyState message={TELEMETRY_MESSAGES.noData} />;
  }

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <table aria-label="Telemetry data">
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Value</th>
              <th scope="col">Unit</th>
              <th scope="col">Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((item) => (
              <tr key={item.id}>
                <td>{item.metricName}</td>
                <td>{item.metricValue}</td>
                <td>{item.unit ?? '—'}</td>
                <td>{formatDateTime(item.recordedAt)}</td>
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
