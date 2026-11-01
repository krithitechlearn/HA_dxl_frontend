/**
 * DeviceForm component.
 * Handles create and edit device operations.
 * @see US-003, US-004, API-015, API-018
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  deviceCreateSchema,
  deviceUpdateSchema,
  type DeviceCreateFormValues,
  type DeviceUpdateFormValues,
} from '../../../utils/validationSchemas';
import type { DeviceResponse } from '../types/device.types';
import type { RoomResponse } from '../../rooms/types/room.types';
import { DEVICE_MESSAGES, COMMON_MESSAGES } from '../../../messages';

interface DeviceFormProps {
  device?: DeviceResponse;
  rooms: RoomResponse[];
  onSave: (
    values: DeviceCreateFormValues | DeviceUpdateFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DEVICE_TYPES = ['LIGHT', 'THERMOSTAT', 'LOCK', 'SENSOR', 'SWITCH', 'CAMERA'] as const;

export function DeviceForm({ device, rooms, onSave, onCancel, isLoading = false }: DeviceFormProps) {
  const isEdit = !!device;

  const createForm = useForm<DeviceCreateFormValues>({
    resolver: zodResolver(deviceCreateSchema),
    defaultValues: { name: '', deviceType: 'LIGHT', manufacturer: '', modelNumber: '', firmwareVersion: '', roomId: '', assignedUserId: '' },
  });

  const editForm = useForm<DeviceUpdateFormValues>({
    resolver: zodResolver(deviceUpdateSchema),
    defaultValues: {
      name: device?.name ?? '',
      deviceType: device?.deviceType ?? 'LIGHT',
      manufacturer: device?.manufacturer ?? '',
      modelNumber: device?.modelNumber ?? '',
      firmwareVersion: device?.firmwareVersion ?? '',
      roomId: device?.roomId ?? '',
      assignedUserId: device?.assignedUserId ?? '',
      version: device?.version ?? 0,
    },
  });

  const form = isEdit ? editForm : createForm;
  const { register, handleSubmit, formState: { errors }, setError, reset } = form;

  useEffect(() => {
    if (device) {
      editForm.reset({
        name: device.name,
        deviceType: device.deviceType,
        manufacturer: device.manufacturer ?? '',
        modelNumber: device.modelNumber ?? '',
        firmwareVersion: device.firmwareVersion ?? '',
        roomId: device.roomId ?? '',
        assignedUserId: device.assignedUserId ?? '',
        version: device.version,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  const handleFormSubmit = async (values: DeviceCreateFormValues | DeviceUpdateFormValues) => {
    await onSave(values, setError as (field: string, err: { type: string; message: string }) => void);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate aria-label={isEdit ? 'Edit device form' : 'Register device form'}>
      <div className="form-group">
        <label htmlFor="device-name" className="form-label">Device Name</label>
        <input
          id="device-name"
          type="text"
          className={`form-input${errors.name ? ' error' : ''}`}
          aria-describedby={errors.name ? 'device-name-error' : undefined}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p id="device-name-error" className="form-error" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="device-type" className="form-label">Device Type</label>
        <select
          id="device-type"
          className={`form-input${errors.deviceType ? ' error' : ''}`}
          aria-describedby={errors.deviceType ? 'device-type-error' : undefined}
          aria-invalid={!!errors.deviceType}
          {...register('deviceType')}
        >
          {DEVICE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.deviceType && (
          <p id="device-type-error" className="form-error" role="alert">{errors.deviceType.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="device-room" className="form-label">Room (optional)</label>
        <select
          id="device-room"
          className="form-input"
          {...register('roomId')}
        >
          <option value="">-- No Room --</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="device-manufacturer" className="form-label">Manufacturer (optional)</label>
        <input id="device-manufacturer" type="text" className="form-input" {...register('manufacturer')} />
      </div>

      <div className="form-group">
        <label htmlFor="device-model" className="form-label">Model Number (optional)</label>
        <input id="device-model" type="text" className="form-input" {...register('modelNumber')} />
      </div>

      <div className="form-group">
        <label htmlFor="device-firmware" className="form-label">Firmware Version (optional)</label>
        <input id="device-firmware" type="text" className="form-input" {...register('firmwareVersion')} />
      </div>

      {isEdit && (
        <input type="hidden" {...register('version' as keyof DeviceUpdateFormValues)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          {COMMON_MESSAGES.cancel}
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? COMMON_MESSAGES.saving : (isEdit ? COMMON_MESSAGES.save : DEVICE_MESSAGES.createDevice)}
        </button>
      </div>
    </form>
  );
}
