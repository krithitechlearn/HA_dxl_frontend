/**
 * RoomListPage.
 * Accessible by ADMIN, USER, and GUEST. Create/Edit/Delete only for ADMIN.
 * @see US-003, API-010 to API-014
 */
import { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import { usePagination } from '../../../hooks/usePagination';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';
import { useAuthStore } from '../../../store/authStore';
import { RoomCard } from '../components/RoomCard';
import { RoomForm } from '../components/RoomForm';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import type { RoomResponse } from '../types/room.types';
import type { RoomFormValues } from '../../../utils/validationSchemas';
import { ROOM_MESSAGES } from '../../../messages';

export default function RoomListPage() {
  const { page, size, setPage, setSize } = usePagination();
  const { data, isLoading, error, createRoom, updateRoom, deleteRoom } = useRooms(page, size);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const confirmDialog = useConfirmDialog();

  const handleCreate = async (
    values: RoomFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    setIsSaving(true);
    const success = await createRoom(values, setError);
    setIsSaving(false);
    if (success) setShowCreateForm(false);
    return success;
  };

  const handleUpdate = async (
    values: RoomFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    if (!editingRoom) return false;
    setIsSaving(true);
    const success = await updateRoom(editingRoom.id, values, setError);
    setIsSaving(false);
    if (success) setEditingRoom(null);
    return success;
  };

  const handleDelete = (room: RoomResponse) => {
    confirmDialog.open(async () => {
      await deleteRoom(room.id);
    });
  };

  return (
    <div>
      <PageHeader
        title={ROOM_MESSAGES.pageTitle}
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              {ROOM_MESSAGES.createRoom}
            </button>
          ) : undefined
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
              message={ROOM_MESSAGES.noRooms}
              actionLabel={isAdmin ? ROOM_MESSAGES.createRoom : undefined}
              onAction={isAdmin ? () => setShowCreateForm(true) : undefined}
            />
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {data.content.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onEdit={setEditingRoom}
                    onDelete={handleDelete}
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

      {/* Create Room Modal */}
      {showCreateForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-room-title"
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
            <h2 id="create-room-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              {ROOM_MESSAGES.createRoom}
            </h2>
            <RoomForm
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-room-title"
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
            <h2 id="edit-room-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              {ROOM_MESSAGES.editRoom}
            </h2>
            <RoomForm
              room={editingRoom}
              onSave={handleUpdate}
              onCancel={() => setEditingRoom(null)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={ROOM_MESSAGES.deleteRoom}
        message={ROOM_MESSAGES.deleteConfirm}
        confirmLabel="Delete"
        onConfirm={confirmDialog.confirm}
        onCancel={confirmDialog.close}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
}
