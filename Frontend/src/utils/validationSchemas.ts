/**
 * Zod validation schemas for all forms.
 * Mirrors LLD 6.5 validation rules and uses messages from messages.ts.
 */
import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../messages';

// --- Auth ---
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, VALIDATION_MESSAGES.usernameMin)
    .max(50, VALIDATION_MESSAGES.usernameMax)
    .regex(/^[a-zA-Z0-9_]+$/, VALIDATION_MESSAGES.usernamePattern),
  password: z.string().min(1, VALIDATION_MESSAGES.required),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// --- User ---
const passwordSchema = z
  .string()
  .min(8, VALIDATION_MESSAGES.passwordMin)
  .regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    VALIDATION_MESSAGES.passwordPattern,
  );

export const userCreateSchema = z.object({
  username: z
    .string()
    .min(3, VALIDATION_MESSAGES.usernameMin)
    .max(50, VALIDATION_MESSAGES.usernameMax)
    .regex(/^[a-zA-Z0-9_]+$/, VALIDATION_MESSAGES.usernamePattern),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.emailInvalid)
    .max(255, VALIDATION_MESSAGES.emailMax),
  password: passwordSchema,
  role: z.enum(['ADMIN', 'USER', 'GUEST'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.roleInvalid }),
  }),
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(3, VALIDATION_MESSAGES.usernameMin)
    .max(50, VALIDATION_MESSAGES.usernameMax)
    .regex(/^[a-zA-Z0-9_]+$/, VALIDATION_MESSAGES.usernamePattern),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.emailInvalid)
    .max(255, VALIDATION_MESSAGES.emailMax),
  role: z.enum(['ADMIN', 'USER', 'GUEST'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.roleInvalid }),
  }),
});

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, VALIDATION_MESSAGES.currentPasswordRequired),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, VALIDATION_MESSAGES.confirmPasswordRequired),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.passwordsMustMatch,
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// --- Room ---
export const roomSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.roomNameMin)
    .max(100, VALIDATION_MESSAGES.roomNameMax),
  description: z.string().max(500).optional(),
  floorLevel: z.string().max(50).optional(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;

// --- Device ---
export const deviceCreateSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.deviceNameMin)
    .max(100, VALIDATION_MESSAGES.deviceNameMax),
  deviceType: z.enum(['LIGHT', 'THERMOSTAT', 'LOCK', 'SENSOR', 'SWITCH', 'CAMERA'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.deviceTypeRequired }),
  }),
  manufacturer: z.string().max(100).optional(),
  modelNumber: z.string().max(100).optional(),
  firmwareVersion: z.string().max(50).optional(),
  roomId: z.string().uuid().optional().or(z.literal('')),
  assignedUserId: z.string().uuid().optional().or(z.literal('')),
});

export type DeviceCreateFormValues = z.infer<typeof deviceCreateSchema>;

export const deviceUpdateSchema = deviceCreateSchema.extend({
  version: z.number().int().min(0),
});

export type DeviceUpdateFormValues = z.infer<typeof deviceUpdateSchema>;

// --- Device Command ---
export const deviceCommandSchema = z.object({
  commandType: z.enum(
    ['TURN_ON', 'TURN_OFF', 'SET_TEMPERATURE', 'LOCK', 'UNLOCK', 'SET_BRIGHTNESS', 'SET_COLOR'],
    { errorMap: () => ({ message: VALIDATION_MESSAGES.required }) },
  ),
  commandPayload: z.record(z.unknown()).optional(),
});

export type DeviceCommandFormValues = z.infer<typeof deviceCommandSchema>;

// --- Device Access ---
export const deviceAccessSchema = z.object({
  userId: z.string().uuid(VALIDATION_MESSAGES.required),
  accessLevel: z.enum(['READ', 'CONTROL'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.required }),
  }),
});

export type DeviceAccessFormValues = z.infer<typeof deviceAccessSchema>;

// --- Automation Rule ---
const automationActionSchema = z.object({
  targetDeviceId: z.string().uuid(VALIDATION_MESSAGES.required),
  actionType: z.enum(
    ['TURN_ON', 'TURN_OFF', 'SET_TEMPERATURE', 'LOCK', 'UNLOCK', 'SET_BRIGHTNESS', 'SET_COLOR'],
    { errorMap: () => ({ message: VALIDATION_MESSAGES.required }) },
  ),
  actionPayload: z.record(z.unknown()).optional(),
  executionOrder: z.number().int().min(1),
});

export const automationRuleSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.automationNameMin)
    .max(100, VALIDATION_MESSAGES.automationNameMax),
  description: z.string().max(500).optional(),
  triggerType: z.enum(['SCHEDULE', 'DEVICE_STATE', 'SUNRISE', 'SUNSET', 'MANUAL'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.triggerTypeRequired }),
  }),
  triggerConfig: z.record(z.unknown()),
  isEnabled: z.boolean().optional(),
  actions: z
    .array(automationActionSchema)
    .min(1, VALIDATION_MESSAGES.automationActionsMin),
});

export type AutomationRuleFormValues = z.infer<typeof automationRuleSchema>;
