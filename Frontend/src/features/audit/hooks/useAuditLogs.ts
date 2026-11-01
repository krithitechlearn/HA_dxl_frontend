/**
 * useAuditLogs hook.
 * Fetches audit log entries with filtering.
 * @see US-011, API-035, API-036
 */
import { useState, useEffect, useCallback } from 'react';
import * as auditService from '../../../services/auditService';
import type { AuditLogResponse, AuditLogQueryParams } from '../types/audit.types';
import type { PagedResponse } from '../../../types/api.types';
import { getErrorMessage } from '../../../utils/errorUtils';

export function useAuditLogs(params: AuditLogQueryParams) {
  const [data, setData] = useState<PagedResponse<AuditLogResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await auditService.getAuditLogs(params);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.entityType, params.entityId, params.actor, params.from, params.to, params.page, params.size]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return { data, isLoading, error, refetch: fetchLogs };
}
