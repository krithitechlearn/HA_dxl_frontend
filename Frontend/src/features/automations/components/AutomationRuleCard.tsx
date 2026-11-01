/**
 * AutomationRuleCard component.
 * Displays an automation rule with enable/disable toggle and action buttons.
 * @see US-009, US-010
 */
import type { AutomationRuleResponse } from '../types/automation.types';
import { formatDateTime } from '../../../utils/dateUtils';
import { useAuthStore } from '../../../store/authStore';

interface AutomationRuleCardProps {
  rule: AutomationRuleResponse;
  onEdit: (rule: AutomationRuleResponse) => void;
  onDelete: (rule: AutomationRuleResponse) => void;
  onToggle: (rule: AutomationRuleResponse, enabled: boolean) => void;
  onTrigger: (rule: AutomationRuleResponse) => void;
  onViewDetail: (rule: AutomationRuleResponse) => void;
}

export function AutomationRuleCard({
  rule,
  onEdit,
  onDelete,
  onToggle,
  onTrigger,
  onViewDetail,
}: AutomationRuleCardProps) {
  const user = useAuthStore((s) => s.user);
  const canModify = user?.role === 'ADMIN' || user?.id === rule.ownerUserId;

  return (
    <article
      className="card"
      aria-label={`Automation rule: ${rule.name}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button
            type="button"
            onClick={() => onViewDetail(rule)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: 0,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {rule.name}
          </button>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Trigger: {rule.triggerType}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label
            htmlFor={`toggle-${rule.id}`}
            style={{ fontSize: '0.8rem', color: '#374151', cursor: 'pointer' }}
          >
            {rule.isEnabled ? 'Enabled' : 'Disabled'}
          </label>
          <input
            id={`toggle-${rule.id}`}
            type="checkbox"
            checked={rule.isEnabled}
            onChange={(e) => onToggle(rule, e.target.checked)}
            aria-label={`Toggle ${rule.name}`}
            disabled={!canModify}
          />
        </div>
      </div>

      {rule.description && (
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{rule.description}</p>
      )}

      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
        Last triggered: {formatDateTime(rule.lastTriggeredAt)}
      </p>

      {canModify && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={() => onTrigger(rule)}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
            disabled={!rule.isEnabled}
            aria-label={`Trigger rule ${rule.name}`}
          >
            Trigger Now
          </button>
          <button
            type="button"
            onClick={() => onEdit(rule)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
            aria-label={`Edit rule ${rule.name}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(rule)}
            className="btn-danger"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
            aria-label={`Delete rule ${rule.name}`}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
