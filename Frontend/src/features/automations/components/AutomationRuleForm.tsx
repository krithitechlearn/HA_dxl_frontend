/**
 * AutomationRuleForm component.
 * Full CRUD form for automation rules with dynamic trigger and action configuration.
 * @see US-009, US-010, API-027, API-030
 */
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { automationRuleSchema, type AutomationRuleFormValues } from '../../../utils/validationSchemas';
import type { AutomationRuleResponse, TriggerType } from '../types/automation.types';
import { TriggerConfigForm } from './TriggerConfigForm';
import { ActionConfigForm } from './ActionConfigForm';
import { AUTOMATION_MESSAGES, COMMON_MESSAGES } from '../../../messages';

interface AutomationRuleFormProps {
  rule?: AutomationRuleResponse;
  onSave: (
    values: AutomationRuleFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TRIGGER_TYPES: TriggerType[] = ['SCHEDULE', 'DEVICE_STATE', 'SUNRISE', 'SUNSET', 'MANUAL'];

export function AutomationRuleForm({ rule, onSave, onCancel, isLoading = false }: AutomationRuleFormProps) {
  const isEdit = !!rule;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<AutomationRuleFormValues>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: {
      name: rule?.name ?? '',
      description: rule?.description ?? '',
      triggerType: rule?.triggerType ?? 'MANUAL',
      triggerConfig: rule?.triggerConfig ?? {},
      isEnabled: rule?.isEnabled ?? true,
      actions: rule?.actions.map((a) => ({
        targetDeviceId: a.targetDeviceId,
        actionType: a.actionType,
        actionPayload: a.actionPayload,
        executionOrder: a.executionOrder,
      })) ?? [],
    },
  });

  const triggerType = watch('triggerType');
  const actions = watch('actions');
  const triggerConfig = watch('triggerConfig');

  useEffect(() => {
    if (rule) {
      reset({
        name: rule.name,
        description: rule.description ?? '',
        triggerType: rule.triggerType,
        triggerConfig: rule.triggerConfig,
        isEnabled: rule.isEnabled,
        actions: rule.actions.map((a) => ({
          targetDeviceId: a.targetDeviceId,
          actionType: a.actionType,
          actionPayload: a.actionPayload,
          executionOrder: a.executionOrder,
        })),
      });
    }
  }, [rule, reset]);

  const handleFormSubmit = async (values: AutomationRuleFormValues) => {
    await onSave(values, setError as (field: string, err: { type: string; message: string }) => void);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      aria-label={isEdit ? 'Edit automation rule form' : 'Create automation rule form'}
    >
      <div className="form-group">
        <label htmlFor="rule-name" className="form-label">Rule Name</label>
        <input
          id="rule-name"
          type="text"
          className={`form-input${errors.name ? ' error' : ''}`}
          aria-describedby={errors.name ? 'rule-name-error' : undefined}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p id="rule-name-error" className="form-error" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rule-description" className="form-label">Description (optional)</label>
        <textarea
          id="rule-description"
          rows={2}
          className="form-input"
          {...register('description')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rule-trigger-type" className="form-label">Trigger Type</label>
        <select
          id="rule-trigger-type"
          className={`form-input${errors.triggerType ? ' error' : ''}`}
          aria-describedby={errors.triggerType ? 'rule-trigger-error' : undefined}
          aria-invalid={!!errors.triggerType}
          {...register('triggerType')}
        >
          {TRIGGER_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.triggerType && (
          <p id="rule-trigger-error" className="form-error" role="alert">{errors.triggerType.message}</p>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <TriggerConfigForm
          triggerType={triggerType}
          config={triggerConfig}
          onChange={(config) => setValue('triggerConfig', config)}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            {...register('isEnabled')}
          />
          <span className="form-label" style={{ margin: 0 }}>Enabled</span>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Controller
          name="actions"
          control={control}
          render={({ field }) => (
            <ActionConfigForm
              actions={field.value}
              onChange={field.onChange}
              error={errors.actions?.message}
            />
          )}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          {COMMON_MESSAGES.cancel}
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? COMMON_MESSAGES.saving : (isEdit ? COMMON_MESSAGES.save : AUTOMATION_MESSAGES.createRule)}
        </button>
      </div>
    </form>
  );
}
