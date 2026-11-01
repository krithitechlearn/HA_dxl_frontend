/**
 * Central messages module.
 * All user-facing strings, validation messages, and error code mappings live here.
 * Placeholder text is marked with [PLACEHOLDER] for review.
 */

export const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Please check the form for errors and try again.',
  AUTHENTICATION_FAILED: 'Invalid username or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to perform this action.',
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'A record with this information already exists.',
  OPTIMISTIC_LOCK_CONFLICT:
    'This record was updated by another user. Please refresh and try again.',
  BUSINESS_RULE_VIOLATION: 'This operation is not allowed due to a business rule.',
  COMMAND_NOT_COMPATIBLE: 'This command is not compatible with the selected device type.',
  DEVICE_NOT_COMMANDABLE: 'This device is currently in maintenance mode and cannot receive commands.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
};

export const AUTH_MESSAGES = {
  loginTitle: 'Sign In',
  loginSubtitle: 'Home Automation Platform', // [PLACEHOLDER]
  usernameLabel: 'Username',
  passwordLabel: 'Password',
  loginButton: 'Sign In',
  loggingIn: 'Signing in…',
  logoutSuccess: 'You have been signed out.',
};

export const USER_MESSAGES = {
  pageTitle: 'User Management',
  createUser: 'Create User',
  editUser: 'Edit User',
  deactivateUser: 'Deactivate User',
  deactivateConfirm: 'Are you sure you want to deactivate this user? This action cannot be undone.',
  changePassword: 'Change Password',
  userCreated: 'User created successfully.',
  userUpdated: 'User updated successfully.',
  userDeactivated: 'User deactivated successfully.',
  passwordChanged: 'Password changed successfully.',
  noUsers: 'No users found.',
};

export const ROOM_MESSAGES = {
  pageTitle: 'Rooms',
  createRoom: 'Create Room',
  editRoom: 'Edit Room',
  deleteRoom: 'Delete Room',
  deleteConfirm: 'Are you sure you want to delete this room? Devices in this room will be unassigned.',
  roomCreated: 'Room created successfully.',
  roomUpdated: 'Room updated successfully.',
  roomDeleted: 'Room deleted successfully.',
  noRooms: 'No rooms found.',
};

export const DEVICE_MESSAGES = {
  pageTitle: 'Devices',
  createDevice: 'Register Device',
  editDevice: 'Edit Device',
  deactivateDevice: 'Deactivate Device',
  deactivateConfirm: 'Are you sure you want to deactivate this device?',
  deviceCreated: 'Device registered successfully.',
  deviceUpdated: 'Device updated successfully.',
  deviceDeactivated: 'Device deactivated successfully.',
  noDevices: 'No devices found.',
  commandIssued: 'Command issued successfully.',
  accessGranted: 'Device access granted successfully.',
  accessRevoked: 'Device access revoked successfully.',
};

export const TELEMETRY_MESSAGES = {
  pageTitle: 'Telemetry Dashboard',
  noData: 'No telemetry data available for the selected period.',
  loadingData: 'Loading telemetry data…',
};

export const AUTOMATION_MESSAGES = {
  pageTitle: 'Automation Rules',
  createRule: 'Create Automation Rule',
  editRule: 'Edit Automation Rule',
  deleteRule: 'Delete Automation Rule',
  deleteConfirm: 'Are you sure you want to delete this automation rule?',
  ruleCreated: 'Automation rule created successfully.',
  ruleUpdated: 'Automation rule updated successfully.',
  ruleDeleted: 'Automation rule deleted successfully.',
  ruleEnabled: 'Automation rule enabled.',
  ruleDisabled: 'Automation rule disabled.',
  triggerSuccess: 'Automation rule triggered successfully.',
  noRules: 'No automation rules found.',
};

export const AUDIT_MESSAGES = {
  pageTitle: 'Audit Logs',
  noLogs: 'No audit log entries found.',
};

export const COMMON_MESSAGES = {
  loading: 'Loading…',
  error: 'Something went wrong.',
  retry: 'Retry',
  cancel: 'Cancel',
  confirm: 'Confirm',
  save: 'Save',
  saving: 'Saving…',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  close: 'Close',
  search: 'Search',
  filter: 'Filter',
  refresh: 'Refresh',
  notFound: 'Page Not Found',
  notFoundMessage: 'The page you are looking for does not exist.',
  goHome: 'Go to Home',
  forbidden: 'Access Denied',
  forbiddenMessage: 'You do not have permission to view this page.',
  pageSize: 'Page size',
  previous: 'Previous',
  next: 'Next',
};

export const VALIDATION_MESSAGES = {
  required: 'This field is required.',
  usernameMin: 'Username must be at least 3 characters.',
  usernameMax: 'Username must be at most 50 characters.',
  usernamePattern: 'Username may only contain letters, numbers, and underscores.',
  emailInvalid: 'Please enter a valid email address.',
  emailMax: 'Email must be at most 255 characters.',
  passwordMin: 'Password must be at least 8 characters.',
  passwordPattern:
    'Password must contain at least 1 uppercase letter, 1 digit, and 1 special character.',
  roleInvalid: 'Please select a valid role.',
  roomNameMin: 'Room name must be at least 1 character.',
  roomNameMax: 'Room name must be at most 100 characters.',
  deviceNameMin: 'Device name must be at least 1 character.',
  deviceNameMax: 'Device name must be at most 100 characters.',
  deviceTypeRequired: 'Please select a device type.',
  automationNameMin: 'Rule name must be at least 1 character.',
  automationNameMax: 'Rule name must be at most 100 characters.',
  automationActionsMin: 'At least one action is required.',
  triggerTypeRequired: 'Please select a trigger type.',
  metricValueRequired: 'Metric value is required.',
  recordedAtRequired: 'Recorded at timestamp is required.',
  recordedAtFuture: 'Recorded at cannot be in the future.',
  currentPasswordRequired: 'Current password is required.',
  newPasswordRequired: 'New password is required.',
  confirmPasswordRequired: 'Please confirm your new password.',
  passwordsMustMatch: 'Passwords do not match.',
};
