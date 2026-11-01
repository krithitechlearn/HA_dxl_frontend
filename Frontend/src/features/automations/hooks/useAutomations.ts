/**
 * useAutomations hook.
 * Manages automation rule CRUD, toggle, manual trigger, and execution logs.
 * @see US-009, US-010, API-027 to API-034
 */
import { useState, useEffect, useCallback } from 'react';
import * as automationService from '../../../services/automationService';
import type {
  AutomationRuleResponse,
  AutomationRuleCreateRequest,
  AutomationRuleUpdateRequest,
  AutomationExecutionLogResponse,
} from '../types/automation.types';
import type { PagedResponse } from '../../../types/api.types';
import { useNotificationStore } from '../../../store/notificationStore';
import { getErrorMessage, mapFieldErrorsToForm, getFieldErrors } from '../../../utils/errorUtils';
import { AUTOMATION_MESSAGES } from '../../../messages';

export function useAutomations(page: number, size: number) {
  const [data, setData] = useState<PagedResponse<AutomationRuleResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await automationService.getAutomationRules({ page, size, sort: 'createdAt,desc' });
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  const createRule = async (
    request: AutomationRuleCreateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await automationService.createAutomationRule(request);
      addNotification('success', AUTOMATION_MESSAGES.ruleCreated);
      void fetchRules();
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setFormError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  const updateRule = async (
    id: string,
    request: AutomationRuleUpdateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await automationService.updateAutomationRule(id, request);
      addNotification('success', AUTOMATION_MESSAGES.ruleUpdated);
      void fetchRules();
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setFormError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      await automationService.deleteAutomationRule(id);
      addNotification('success', AUTOMATION_MESSAGES.ruleDeleted);
      void fetchRules();
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  const toggleRule = async (id: string, enabled: boolean): Promise<boolean> => {
    try {
      await automationService.toggleAutomationRule(id, { enabled });
      addNotification('success', enabled ? AUTOMATION_MESSAGES.ruleEnabled : AUTOMATION_MESSAGES.ruleDisabled);
      void fetchRules();
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  const triggerRule = async (id: string): Promise<AutomationExecutionLogResponse | null> => {
    try {
      const result = await automationService.triggerAutomationRule(id);
      addNotification('success', AUTOMATION_MESSAGES.triggerSuccess);
      return result;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return null;
    }
  };

  return { data, isLoading, error, refetch: fetchRules, createRule, updateRule, deleteRule, toggleRule, triggerRule };
}

export function useAutomationById(id: string) {
  const [rule, setRule] = useState<AutomationRuleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    automationService.getAutomationRuleById(id)
      .then((data) => { if (!cancelled) setRule(data); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { rule, isLoading, error };
}

export function useExecutionLogs(ruleId: string, page: number, size: number) {
  const [data, setData] = useState<PagedResponse<AutomationExecutionLogResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await automationService.getAutomationExecutionLogs(ruleId, { page, size, sort: 'executedAt,desc' });
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [ruleId, page, size]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return { data, isLoading, error, refetch: fetchLogs };
}
