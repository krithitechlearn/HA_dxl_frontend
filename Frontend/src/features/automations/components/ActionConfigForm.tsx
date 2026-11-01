/**
 * ActionConfigForm component.
 * Renders a list of automation actions with add/remove functionality.
 * @see US-009, LLD 7.3
 */
import type { AutomationActionRequest, ActionType } from '../types/automation.types';

interface ActionConfigFormProps {
  actions: AutomationActionRequest[];
  onChange: (actions: AutomationActionRequest[]) => void;
  error?: string;
}

const ACTION_TYPES: ActionType[] = [
  'TURN_ON',
  'TURN_OFF',
  'SET_TEMPERATURE',
  'LOCK',
  'UNLOCK',
  'SET_BRIGHTNESS',
  'SET_COLOR',
];

export function ActionConfigForm({ actions, onChange, error }: ActionConfigFormProps) {
  const addAction = () => {
    onChange([
      ...actions,
      {
        targetDeviceId: '',
        actionType: 'TURN_ON',
        executionOrder: actions.length + 1,
      },
    ]);
  };

  const removeAction = (index: number) => {
    const updated = actions.filter((_, i) => i !== index).map((a, i) => ({
      ...a,
      executionOrder: i + 1,
    }));
    onChange(updated);
  };

  const updateAction = (index: number, field: keyof AutomationActionRequest, value: string | number) => {
    const updated = actions.map((a, i) =>
      i === index ? { ...a, [field]: value } : a,
    );
    onChange(updated);
  };

  return (
    <fieldset style={{ border: 'none', padding: 0 }}>
      <legend style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
        Actions
      </legend>

      {error && (
        <p className="form-error" role="alert" style={{ marginBottom: '0.5rem' }}>{error}</p>
      )}

      {actions.map((action, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
              Action {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeAction(index)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
              aria-label={`Remove action ${index + 1}`}
            >
              Remove
            </button>
          </div>

          <div className="form-group">
            <label htmlFor={`action-device-${index}`} className="form-label" style={{ fontSize: '0.8rem' }}>
              Target Device ID
            </label>
            <input
              id={`action-device-${index}`}
              type="text"
              className="form-input"
              placeholder="Device UUID"
              value={action.targetDeviceId}
              onChange={(e) => updateAction(index, 'targetDeviceId', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`action-type-${index}`} className="form-label" style={{ fontSize: '0.8rem' }}>
              Action Type
            </label>
            <select
              id={`action-type-${index}`}
              className="form-input"
              value={action.actionType}
              onChange={(e) => updateAction(index, 'actionType', e.target.value as ActionType)}
            >
              {ACTION_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAction}
        className="btn-secondary"
        style={{ fontSize: '0.875rem' }}
      >
        + Add Action
      </button>
    </fieldset>
  );
}
