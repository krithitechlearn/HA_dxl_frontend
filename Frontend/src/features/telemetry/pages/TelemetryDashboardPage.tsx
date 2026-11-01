/**
 * TelemetryDashboardPage.
 * Shows telemetry chart and table for a specific device.
 * Accessible by ADMIN and USER.
 * @see US-007, US-008, API-026
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelemetry } from '../hooks/useTelemetry';
import { usePagination } from '../../../hooks/usePagination';
import { useDeviceById } from '../../devices/hooks/useDevices';
import { TelemetryChart } from '../components/TelemetryChart';
import { TelemetryTable } from '../components/TelemetryTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { subtractDays, toISOString } from '../../../utils/dateUtils';
import { TELEMETRY_MESSAGES } from '../../../messages';

export default function TelemetryDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { device } = useDeviceById(id ?? '');

  const [from, setFrom] = useState(() => toISOString(subtractDays(new Date(), 7)).slice(0, 16));
  const [to, setTo] = useState(() => toISOString(new Date()).slice(0, 16));
  const [metricName, setMetricName] = useState('');

  const { page, size, setPage, setSize } = usePagination();

  const { data, isLoading, error } = useTelemetry(id ?? '', {
    from: from ? new Date(from).toISOString() : undefined,
    to: to ? new Date(to).toISOString() : undefined,
    metricName: metricName || undefined,
    page,
    size,
  });

  return (
    <div>
      <PageHeader
        title={TELEMETRY_MESSAGES.pageTitle}
        subtitle={device ? `Device: ${device.name}` : undefined}
        actions={
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Back
          </button>
        }
      />

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label htmlFor="telemetry-from" className="form-label">From</label>
            <input
              id="telemetry-from"
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
          <div>
            <label htmlFor="telemetry-to" className="form-label">To</label>
            <input
              id="telemetry-to"
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
          <div>
            <label htmlFor="telemetry-metric" className="form-label">Metric Name</label>
            <input
              id="telemetry-metric"
              type="text"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              placeholder="e.g. temperature"
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner label={TELEMETRY_MESSAGES.loadingData} />}
      {error && (
        <div role="alert" style={{ color: '#991b1b', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && data && data.content.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Chart</h3>
          <TelemetryChart
            data={data.content}
            metricName={metricName || 'Value'}
          />
        </div>
      )}

      {!isLoading && !error && (
        <TelemetryTable
          data={data}
          currentPage={page}
          pageSize={size}
          onPageChange={setPage}
          onPageSizeChange={setSize}
        />
      )}
    </div>
  );
}
