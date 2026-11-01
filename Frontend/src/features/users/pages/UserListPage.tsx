/**
 * UserListPage.
 * ADMIN-only page for managing users.
 * @see US-002, API-004, API-005, API-007, API-008, API-009
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { usePagination } from '../../../hooks/usePagination';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import type { UserResponse } from '../types/user.types';
import type { UserCreateFormValues, UserUpdateFormValues, ChangePasswordFormValues } from '../../../utils/validationSchemas';
import { USER_MESSAGES } from '../../../messages';

export default function UserListPage() {
  const { page, size, setPage, setSize } = usePagination();
  const { data, isLoading, error, createUser, updateUser, deactivateUser, changePassword } = useUsers(page, size);
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [passwordUser, setPasswordUser] = useState<UserResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const confirmDialog = useConfirmDialog();

  const handleCreate = async (
    values: UserCreateFormValues | UserUpdateFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    setIsSaving(true);
    const success = await createUser(values as UserCreateFormValues, setError);
    setIsSaving(false);
    if (success) setShowCreateForm(false);
    return success;
  };

  const handleUpdate = async (
    values: UserCreateFormValues | UserUpdateFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    if (!editingUser) return false;
    setIsSaving(true);
    const success = await updateUser(editingUser.id, values as UserUpdateFormValues, setError);
    setIsSaving(false);
    if (success) setEditingUser(null);
    return success;
  };

  const handleDeactivate = (user: UserResponse) => {
    confirmDialog.open(async () => {
      await deactivateUser(user.id);
    });
  };

  const handleChangePassword = async (
    id: string,
    values: ChangePasswordFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    return changePassword(id, values, setError);
  };

  return (
    <div>
      <PageHeader
        title={USER_MESSAGES.pageTitle}
        actions={
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            {USER_MESSAGES.createUser}
          </button>
        }
      />

      {isLoading && <LoadingSpinner />}
      {error && (
        <div role="alert" style={{ color: '#991b1b', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {data.content.length === 0 ? (
            <EmptyState
              message={USER_MESSAGES.noUsers}
              actionLabel={USER_MESSAGES.createUser}
              onAction={() => setShowCreateForm(true)}
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <UserTable
                users={data.content}
                onEdit={setEditingUser}
                onDeactivate={handleDeactivate}
                onChangePassword={setPasswordUser}
                onViewDetail={(user) => navigate(`/users/${user.id}`)}
              />
              <div style={{ padding: '0 1rem' }}>
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  pageSize={data.size}
                  totalElements={data.totalElements}
                  onPageChange={setPage}
                  onPageSizeChange={setSize}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Create User Modal */}
      {showCreateForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-user-title"
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
          <div className="card" style={{ width: '100%', maxWidth: '28rem' }}>
            <h2 id="create-user-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              {USER_MESSAGES.createUser}
            </h2>
            <UserForm
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
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
          <div className="card" style={{ width: '100%', maxWidth: '28rem' }}>
            <h2 id="edit-user-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              {USER_MESSAGES.editUser}
            </h2>
            <UserForm
              user={editingUser}
              onSave={handleUpdate}
              onCancel={() => setEditingUser(null)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        user={passwordUser}
        onSave={handleChangePassword}
        onClose={() => setPasswordUser(null)}
      />

      {/* Confirm Deactivate Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={USER_MESSAGES.deactivateUser}
        message={USER_MESSAGES.deactivateConfirm}
        confirmLabel="Deactivate"
        onConfirm={confirmDialog.confirm}
        onCancel={confirmDialog.close}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
}
