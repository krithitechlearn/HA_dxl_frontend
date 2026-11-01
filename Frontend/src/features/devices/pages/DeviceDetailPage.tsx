/**
 * DeviceDetailPage.
 * Shows full device details, command panel, command history, and access management.
 * @see US-004, US-005, US-006, API-017, API-023, API-024
 */
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeviceById } from '../hooks/useDevices';
import { useDeviceCommands } from '../hooks/useDeviceCommands';
import { usePagination } from '../../../hooks/usePagination';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';
import { useAuthStore } from '../../../store/authStore';
import { DeviceStatusBadge } from '../components/DeviceStatusBadge';
import { DeviceCommandPanel } from '../components/DeviceCommandPanel';
import { CommandHistoryTable } from '../components/CommandHistoryTable';
import { DeviceAccessModal } from '../components/DeviceAccessModal';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { formatDateTime } from '../../../utils/dateUtils';
import { DEVICE_MESSAGES } from '../../../messages';
import type { DeviceCommandFormValues, DeviceAccessFormValues } from '../../../utils/validationSchemas';
import * as deviceService from '../../../services/deviceService';
import * as userService from '../../../services/userService';
import { useNotificationStore } from '../../../store/notificationStore';
import { getErrorMessage } from '../../../utils/errorUtils';
import { useState as useStateInner } from 'react';
import type { UserResponse } from '../../users/types/user.types';

export default function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const addNotification = useNotificationStore((s) => s.addNotification);

  const { device, isLoading, error, refetch } = useDeviceById(id ?? '');
  const { page, size, setPage, setSize } = usePagination();
  const { data: commandData, isLoading: cmdLoading, issueCommand } = useDeviceCommands(
    id ?? '',
    page,
    size,
  );

  const confirmDialog = useConfirmDialog();
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [users, setUsers] = useStateInner<UserResponse[]>([]);

  const handleOpenAccessModal = async () => {
    try {
      const result = await userService.getUsers({ page: 0, size: 100 });
      setUsers(result.content);
      setShowAccessModal(true);
    } catch (err) {
      addNotification('error', getErrorMessage(err));
    }
  };

  const handleIssueCommand = async (values: DeviceCommandFormValues): Promise<boolean> => {
    return issueCommand(values);
  };

  const handleDeactivate = () => {
    if (!device) return;
    confirmDialog.open(async () => {
      await deviceService.deactivateDevice(device.id);
      addNotification('success', DEVICE_MESSAGES.deviceDeactivated);
      navigate('/devices');
    });
  };

  const handleGrantAccess = async (values: DeviceAccessFormValues): Promise<boolean> => {
    if (!device) return false;
    try {
      await deviceService.grantDeviceAccess(device.id, values);
      addNotification('success', DEVICE_MESSAGES.accessGranted);
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  const handleRevokeAccess = async (userId: string): Promise<boolean> => {
    if (!device) return false;
    try {
      await deviceService.revokeDeviceAccess(device.id, userId);
      addNotification('success', DEVICE_MESSAGES.accessRevoked);
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div role="alert" style={{ color: '#991b1b', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
        {error}
      </div>
    );
  }
  if (!device) return null;

  return (
    <div>
      <PageHeader
        title={device.name}
        subtitle={`${device.deviceType} • ${device.manufacturer ?? ''}`}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/devices/${device.id}/telemetry`}
              className="btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              View Telemetry
            </Link>
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={handleOpenAccessModal}
                  className="btn-secondary"
                >
                  Manage Access
                </button>
                {device.isActive && (
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    className="btn-danger"
                  >
                    Deactivate
                  </button>
                )}
              </>
            )}
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Back
            </button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Device Info */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Device Information</h3>
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem 1rem' }}>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Status</dt>
            <dd><DeviceStatusBadge status={device.status} /></dd>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Type</dt>
            <dd style={{ fontSize: '0.875rem' }}>{device.deviceType}</dd>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Room</dt>
            <dd style={{ fontSize: '0.875rem' }}>{device.roomName ?? '—'}</dd>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Model</dt>
            <dd style={{ fontSize: '0.875rem' }}>{device.modelNumber ?? '—'}</dd>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Firmware</dt>
            <dd style={{ fontSize: '0.875rem' }}>{device.firmwareVersion ?? '—'}</dd>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Last Seen</dt>
            <dd style={{ fontSize: '0.875rem' }}>{formatDateTime(device.lastSeenAt)}</dd>
            <dt style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Active</dt>
            <dd style={{ fontSize: '0.875rem' }}>{device.isActive ? 'Yes' : 'No'}</dd>
          </dl>
        </div>

        {/* Command Panel */}
        <DeviceCommandPanel
          deviceId={device.id}
          deviceType={device.deviceType}
          deviceStatus={device.status}
          onIssueCommand={handleIssueCommand}
        />
      </div>

      {/* Command History */}
      <CommandHistoryTable
        data={commandData}
        isLoading={cmdLoading}
        currentPage={page}
        pageSize={size}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      {/* Device Access Modal */}
      <DeviceAccessModal
        isOpen={showAccessModal}
        deviceId={device.id}
        users={users}
        onGrant={handleGrantAccess}
        onRevoke={handleRevokeAccess}
        onClose={() => setShowAccessModal(false)}
      />

      {/* Deactivate Confirm Dialog */}
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
