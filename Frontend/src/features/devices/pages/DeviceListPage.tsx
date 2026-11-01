/**
 * DeviceListPage.
 * Lists all devices with filtering, pagination, and role-based actions.
 * @see US-004, US-005, API-015, API-016, API-019
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { usePagination } from '../../../hooks/usePagination';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';
import { useAuthStore } from '../../../store/authStore';
import { DeviceTable } from '../components/DeviceTable';
import { DeviceForm } from '../components/DeviceForm';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import type { DeviceResponse, DeviceStatus, DeviceType } from '../types/device.types';
import type { DeviceCreateFormValues, DeviceUpdateFormValues } from '../../../utils/validationSchemas';
import { DEVICE_MESSAGES } from '../../../messages';
import { useRooms } from '../../rooms/hooks/useRooms';

export default function DeviceListPage() {
  const { page, size, setPage, setSize } = usePagination();
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | ''>('');

  const { data, isLoading, error, createDevice, updateDevice, deactivateDevice } = useDevices({
    page,
    size,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const { data: roomsData } = useRooms(0, 100);
  const rooms = roomsData?.content ?? [];

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const confirmDialog = useConfirmDialog();

  const handleCreate = async (
    values: DeviceCreateFormValues | DeviceUpdateFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    setIsSaving(true);
    const success = await createDevice(values as DeviceCreateFormValues, setError);
    setIsSaving(false);
    if (success) setShowCreateForm(false);
    return success;
  };

  const handleUpdate = async (
    values: DeviceCreateFormValues | DeviceUpdateFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    if (!editingDevice) return false;
    setIsSaving(true);
    const success = await updateDevice(editingDevice.id, values as DeviceUpdateFormValues, setError);
    setIsSaving(false);
    if (success) setEditingDevice(null);
    return success;
  };

  const handleDeactivate = (device: DeviceResponse) => {
    confirmDialog.open(async () => {
      await deactivateDevice(device.id);
    });
  };

  return (
    <div>
      <PageHeader
        title={DEVICE_MESSAGES.pageTitle}
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              {DEVICE_MESSAGES.createDevice}
            </button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="status-filter" className="form-label">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DeviceStatus | '')}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="">All Statuses</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="ERROR">Error</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
        <div>
          <label htmlFor="type-filter" className="form-label">Type</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DeviceType | '')}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="">All Types</option>
            <option value="LIGHT">Light</option>
            <option value="THERMOSTAT">Thermostat</option>
            <option value="LOCK">Lock</option>
            <option value="SENSOR">Sensor</option>
            <option value="SWITCH">Switch</option>
            <option value="CAMERA">Camera</option>
          </select>
        </div>
      </div>

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
              message={DEVICE_MESSAGES.noDevices}
              actionLabel={isAdmin ? DEVICE_MESSAGES.createDevice : undefined}
              onAction={isAdmin ? () => setShowCreateForm(true) : undefined}
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <DeviceTable
                devices={data.content}
                onEdit={setEditingDevice}
                onDeactivate={handleDeactivate}
                onViewDetail={(d) => navigate(`/devices/${d.id}`)}
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

      {/* Create Device Modal */}
      {showCreateForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-device-title"
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
          <div className="card" style={{ width: '100%', maxWidth: '32rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 id="create-device-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              {DEVICE_MESSAGES.createDevice}
            </h2>
            <DeviceForm
              rooms={rooms}
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {/* Edit Device Modal */}
      {editingDevice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-device-title"
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
          <div className="card" style={{ width: '100%', maxWidth: '32rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 id="edit-device-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              {DEVICE_MESSAGES.editDevice}
            </h2>
            <DeviceForm
              device={editingDevice}
              rooms={rooms}
              onSave={handleUpdate}
              onCancel={() => setEditingDevice(null)}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={DEVICE_MESSAGES.deactivateDevice}
        message={DEVICE_MESSAGES.deactivateConfirm}
        confirmLabel="Deactivate"
        onConfirm={confirmDialog.confirm}
        onCancel={confirmDialog.close}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
}
