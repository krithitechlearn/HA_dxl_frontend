/**
 * AutomationListPage.
 * Lists all automation rules with create/edit/delete/toggle/trigger actions.
 * Accessible by ADMIN and USER.
 * @see US-009, US-010, API-027 to API-033
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutomations } from '../hooks/useAutomations';
import { usePagination } from '../../../hooks/usePagination';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';
import { AutomationRuleCard } from '../components/AutomationRuleCard';
import { AutomationRuleForm } from '../components/AutomationRuleForm';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import type { AutomationRuleResponse } from '../types/automation.types';
import type { AutomationRuleFormValues } from '../../../utils/validationSchemas';
import { AUTOMATION_MESSAGES } from '../../../messages';

export default function AutomationListPage() {
  const { page, size, setPage, setSize } = usePagination();
  const { data, isLoading, error, createRule, updateRule, deleteRule, toggleRule, triggerRule } =
    useAutomations(page, size);
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRuleResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const confirmDialog = useConfirmDialog();

  const handleCreate = async (
    values: AutomationRuleFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    setIsSaving(true);
    const success = await createRule(
      {
        name: values.name,
        description: values.description,
        triggerType: values.triggerType,
        triggerConfig: values.triggerConfig,
        isEnabled: values.isEnabled ?? true,
        actions: values.actions,
      },
      setError,
    );
    setIsSaving(false);
    if (success) setShowCreateForm(false);
    return success;
  };

  const handleUpdate = async (
    values: AutomationRuleFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    if (!editingRule) return false;
    setIsSaving(true);
    const success = await updateRule(
      editingRule.id,
      {
        name: values.name,
        description: values.description,
        triggerType: values.triggerType,
        triggerConfig: values.triggerConfig,
        isEnabled: values.isEnabled ?? true,
        actions: values.actions,
        version: editingRule.version,
      },
      setError,
    );
    setIsSaving(false);
    if (success) setEditingRule(null);
    return success;
  };

  const handleDelete = (rule: AutomationRuleResponse) => {
    confirmDialog.open(async () => {
      await deleteRule(rule.id);
    });
  };

  const handleToggle = async (rule: AutomationRuleResponse, enabled: boolean) => {
    await toggleRule(rule.id, enabled);
  };

  const handleTrigger = async (rule: AutomationRuleResponse) => {
    await triggerRule(rule.id);
  };

  return (
    <div>
      <PageHeader
        title={AUTOMATION_MESSAGES.pageTitle}
        actions={
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            {AUTOMATION_MESSAGES.createRule}
          </button>
        }
      />

      {isLoading && <LoadingSpinner />}
      {error && (
        <div
          role="alert"
          style={{
            color: '#991b1b',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.375rem',
          }}
        >
          {error}
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {data.content.length === 0 ? (
            <EmptyState
              message={AUTOMATION_MESSAGES.noRules}
              actionLabel={AUTOMATION_MESSAGES.createRule}
              onAction={() => setShowCreateForm(true)}
            />
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {data.content.map((rule) => (
                  <AutomationRuleCard
                    key={rule.id}
                    rule={rule}
                    onEdit={setEditingRule}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onTrigger={handleTrigger}
                    onViewDetail={(r) => navigate(`/automations/${r.id}`)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={data.number}
                totalPages={data.totalPages}
                pageSize={data.size}
                totalElements={data.totalElements}
                onPageChange={setPage}
                onPageSizeChange={setSize}
              />
            </>
          )}
        </>
      )}

      {/* Create Rule Modal */}
      {showCreateForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-rule-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2
              id="create-rule-title"
              style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}
            >
              {AUTOMATION_MESSAGES.createRule}
            </h2>
            <AutomationRuleForm
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {/* Edit Rule Modal */}
      {editingRule && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-rule-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2
              id="edit-rule-title"
              style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}
            >
              {AUTOMATION_MESSAGES.editRule}
            </h2>
            <AutomationRuleForm
              rule={editingRule}
              onSave={handleUpdate}
              onCancel={() => setEditingRule(null)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={AUTOMATION_MESSAGES.deleteRule}
        message={AUTOMATION_MESSAGES.deleteConfirm}
        confirmLabel="Delete"
        onConfirm={confirmDialog.confirm}
        onCancel={confirmDialog.close}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
}
