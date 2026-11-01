/**
 * AuditLogPage.
 * ADMIN-only page for viewing and filtering audit logs.
 * @see US-011, API-035, API-036
 */
import { useState } from 'react';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { usePagination } from '../../../hooks/usePagination';
import { AuditLogTable } from '../components/AuditLogTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { AUDIT_MESSAGES } from '../../../messages';

export default function AuditLogPage() {
  const { page, size, setPage, setSize } = usePagination();
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [actor, setActor] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, isLoading, error } = useAuditLogs({
    entityType: entityType || undefined,
    entityId: entityId || undefined,
    actor: actor || undefined,
    from: from ? new Date(from).toISOString() : undefined,
    to: to ? new Date(to).toISOString() : undefined,
    page,
    size,
    sort: 'occurredAt,desc',
  });

  return (
    <div>
      <PageHeader title={AUDIT_MESSAGES.pageTitle} />

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label htmlFor="audit-entity-type" className="form-label">Entity Type</label>
            <input
              id="audit-entity-type"
              type="text"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              placeholder="e.g. DEVICE"
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
          <div>
            <label htmlFor="audit-entity-id" className="form-label">Entity ID</label>
            <input
              id="audit-entity-id"
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="UUID"
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
          <div>
            <label htmlFor="audit-actor" className="form-label">Actor</label>
            <input
              id="audit-actor"
              type="text"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              placeholder="Username"
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
          <div>
            <label htmlFor="audit-from" className="form-label">From</label>
            <input
              id="audit-from"
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
          <div>
            <label htmlFor="audit-to" className="form-label">To</label>
            <input
              id="audit-to"
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && (
        <div
          role="alert"
          style={{
            color: '#991b1b',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <AuditLogTable
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
