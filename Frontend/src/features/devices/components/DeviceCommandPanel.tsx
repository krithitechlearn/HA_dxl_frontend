/**
 * DeviceCommandPanel component.
 * Renders the command form for issuing commands to a device.
 * Validates command compatibility client-side.
 * @see US-006, API-023
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deviceCommandSchema, type DeviceCommandFormValues } from '../../../utils/validationSchemas';
import type { DeviceType, CommandType } from '../types/device.types';
import { COMMON_MESSAGES } from '../../../messages';

// Command compatibility map per LLD 6.5
const COMPATIBLE_COMMANDS: Record<DeviceType, CommandType[]> = {
  LIGHT: ['TURN_ON', 'TURN_OFF', 'SET_BRIGHTNESS', 'SET_COLOR'],
  THERMOSTAT: ['TURN_ON', 'TURN_OFF', 'SET_TEMPERATURE'],
  LOCK: ['LOCK', 'UNLOCK'],
  SENSOR: ['TURN_ON', 'TURN_OFF'],
  SWITCH: ['TURN_ON', 'TURN_OFF'],
  CAMERA: ['TURN_ON', 'TURN_OFF'],
};

interface DeviceCommandPanelProps {
  deviceId: string;
  deviceType: DeviceType;
  deviceStatus: string;
  onIssueCommand: (values: DeviceCommandFormValues) => Promise<boolean>;
}

export function DeviceCommandPanel({
  deviceType,
  deviceStatus,
  onIssueCommand,
}: DeviceCommandPanelProps) {
  const compatibleCommands = COMPATIBLE_COMMANDS[deviceType] ?? [];
  const isMaintenanceMode = deviceStatus === 'MAINTENANCE';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeviceCommandFormValues>({
    resolver: zodResolver(deviceCommandSchema),
    defaultValues: { commandType: compatibleCommands[0] },
  });

  const handleFormSubmit = async (values: DeviceCommandFormValues) => {
    const success = await onIssueCommand(values);
    if (success) reset({ commandType: compatibleCommands[0] });
  };

  return (
    <section aria-labelledby="command-panel-title" className="card">
      <h3 id="command-panel-title" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Issue Command
      </h3>

      {isMaintenanceMode && (
        <div
          role="alert"
          style={{
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          This device is in maintenance mode and cannot receive commands.
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate aria-label="Issue device command form">
        <div className="form-group">
          <label htmlFor="command-type" className="form-label">Command Type</label>
          <select
            id="command-type"
            className={`form-input${errors.commandType ? ' error' : ''}`}
            aria-describedby={errors.commandType ? 'command-type-error' : undefined}
            aria-invalid={!!errors.commandType}
            disabled={isMaintenanceMode}
            {...register('commandType')}
          >
            {compatibleCommands.map((cmd) => (
              <option key={cmd} value={cmd}>{cmd.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {errors.commandType && (
            <p id="command-type-error" className="form-error" role="alert">{errors.commandType.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || isMaintenanceMode}
          style={{ marginTop: '0.5rem' }}
        >
          {isSubmitting ? 'Sending…' : 'Send Command'}
        </button>
      </form>
    </section>
  );
}
