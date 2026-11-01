/**
 * Automation feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for automation endpoints API-027 to API-034.
 */

export type TriggerType = 'SCHEDULE' | 'DEVICE_STATE' | 'SUNRISE' | 'SUNSET' | 'MANUAL';
export type ActionType =
  | 'TURN_ON'
  | 'TURN_OFF'
  | 'SET_TEMPERATURE'
  | 'LOCK'
  | 'UNLOCK'
  | 'SET_BRIGHTNESS'
  | 'SET_COLOR';
export type AutomationExecutionStatus = 'SUCCESS' | 'PARTIAL_FAILURE' | 'FAILURE';

export interface AutomationActionRequest {
  targetDeviceId: string;
  actionType: ActionType;
  actionPayload?: Record<string, unknown>;
  executionOrder: number;
}

export interface AutomationActionResponse {
  id: string;
  automationRuleId: string;
  targetDeviceId: string;
  actionType: ActionType;
  actionPayload: Record<string, unknown>;
  executionOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRuleResponse {
  id: string;
  name: string;
  description?: string;
  ownerUserId: string;
  triggerType: TriggerType;
  triggerConfig: Record<string, unknown>;
  isEnabled: boolean;
  version: number;
  lastTriggeredAt?: string;
  actions: AutomationActionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRuleCreateRequest {
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig: Record<string, unknown>;
  isEnabled?: boolean;
  actions: AutomationActionRequest[];
}

export interface AutomationRuleUpdateRequest {
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig: Record<string, unknown>;
  isEnabled?: boolean;
  actions: AutomationActionRequest[];
  version: number;
}

export interface AutomationToggleRequest {
  enabled: boolean;
}

export interface AutomationExecutionLogResponse {
  id: string;
  automationRuleId: string;
  status: AutomationExecutionStatus;
  triggerDetail?: string;
  errorMessage?: string;
  executedAt: string;
}
