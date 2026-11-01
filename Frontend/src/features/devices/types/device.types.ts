/**
 * Device feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for device endpoints API-015 to API-024.
 */

export type DeviceType = 'LIGHT' | 'THERMOSTAT' | 'LOCK' | 'SENSOR' | 'SWITCH' | 'CAMERA';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'ERROR' | 'MAINTENANCE';
export type CommandType =
  | 'TURN_ON'
  | 'TURN_OFF'
  | 'SET_TEMPERATURE'
  | 'LOCK'
  | 'UNLOCK'
  | 'SET_BRIGHTNESS'
  | 'SET_COLOR';
export type CommandStatus = 'PENDING' | 'SENT' | 'ACKNOWLEDGED' | 'FAILED';
export type AccessLevel = 'READ' | 'CONTROL';

export interface DeviceResponse {
  id: string;
  name: string;
  deviceType: DeviceType;
  status: DeviceStatus;
  manufacturer?: string;
  modelNumber?: string;
  firmwareVersion?: string;
  attributes: Record<string, unknown>;
  roomId?: string;
  roomName?: string;
  assignedUserId?: string;
  version: number;
  isActive: boolean;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCreateRequest {
  name: string;
  deviceType: DeviceType;
  manufacturer?: string;
  modelNumber?: string;
  firmwareVersion?: string;
  roomId?: string;
  assignedUserId?: string;
}

export interface DeviceUpdateRequest {
  name: string;
  deviceType: DeviceType;
  manufacturer?: string;
  modelNumber?: string;
  firmwareVersion?: string;
  roomId?: string;
  assignedUserId?: string;
  version: number;
}

export interface DeviceCommandRequest {
  commandType: CommandType;
  commandPayload?: Record<string, unknown>;
}

export interface DeviceCommandResponse {
  id: string;
  deviceId: string;
  issuedByUserId: string;
  commandType: CommandType;
  commandPayload: Record<string, unknown>;
  status: CommandStatus;
  errorMessage?: string;
  issuedAt: string;
  completedAt?: string;
}

export interface DeviceAccessRequest {
  userId: string;
  accessLevel: AccessLevel;
}

export interface AssignRoomRequest {
  roomId: string;
}

export interface DeviceFilterParams {
  roomId?: string;
  status?: DeviceStatus;
  type?: DeviceType;
  page?: number;
  size?: number;
  sort?: string;
}
