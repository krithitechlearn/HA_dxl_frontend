/**
 * TriggerConfigForm component.
 * Renders trigger-specific configuration fields based on trigger type.
 * @see US-009, LLD 7.3
 */
import type { TriggerType } from '../types/automation.types';

interface TriggerConfigFormProps {
  triggerType: TriggerType;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function TriggerConfigForm({ triggerType, config, onChange }: TriggerConfigFormProps) {
  const handleChange = (key: string, value: string) => {
    onChange({ ...config, [key]: value });
  };

  if (triggerType === 'SCHEDULE') {
    return (
      <div className="form-group">
        <label htmlFor="trigger-cron" className="form-label">
          Cron Expression
        </label>
        <input
          id="trigger-cron"
          type="text"
          className="form-input"
          placeholder="e.g. 0 8 * * * (every day at 8am)"
          value={(config.cron as string) ?? ''}
          onChange={(e) => handleChange('cron', e.target.value)}
        />
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Standard cron format: second minute hour day month weekday
        </p>
      </div>
    );
  }

  if (triggerType === 'DEVICE_STATE') {
    return (
      <>
        <div className="form-group">
          <label htmlFor="trigger-device-id" className="form-label">
            Device ID
          </label>
          <input
            id="trigger-device-id"
            type="text"
            className="form-input"
            placeholder="Device UUID"
            value={(config.deviceId as string) ?? ''}
            onChange={(e) => handleChange('deviceId', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="trigger-state" className="form-label">
            Expected State
          </label>
          <input
            id="trigger-state"
            type="text"
            className="form-input"
            placeholder="e.g. ONLINE"
            value={(config.state as string) ?? ''}
            onChange={(e) => handleChange('state', e.target.value)}
          />
        </div>
      </>
    );
  }

  if (triggerType === 'MANUAL' || triggerType === 'SUNRISE' || triggerType === 'SUNSET') {
    return (
      <p style={{ fontSize: '0.875rem', color: '#6b7280', padding: '0.5rem 0' }}>
        No additional configuration required for {triggerType} trigger.
      </p>
    );
  }

  return null;
}
