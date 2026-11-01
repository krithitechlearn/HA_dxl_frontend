/**
 * Audit log feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for audit log endpoints API-035, API-036.
 */

export interface AuditLogResponse {
  id: string;
  actorUsername: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  ipAddress?: string;
  occurredAt: string;
}

export interface AuditLogQueryParams {
  entityType?: string;
  entityId?: string;
  actor?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  sort?: string;
}
