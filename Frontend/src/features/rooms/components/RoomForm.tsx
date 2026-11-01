/**
 * RoomForm component.
 * Handles create and edit room operations.
 * @see US-003, API-010, API-013
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema, type RoomFormValues } from '../../../utils/validationSchemas';
import type { RoomResponse } from '../types/room.types';
import { ROOM_MESSAGES, COMMON_MESSAGES } from '../../../messages';

interface RoomFormProps {
  room?: RoomResponse;
  onSave: (
    values: RoomFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RoomForm({ room, onSave, onCancel, isLoading = false }: RoomFormProps) {
  const isEdit = !!room;
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: { name: room?.name ?? '', description: room?.description ?? '', floorLevel: room?.floorLevel ?? '' },
  });

  useEffect(() => {
    if (room) {
      reset({ name: room.name, description: room.description ?? '', floorLevel: room.floorLevel ?? '' });
    }
  }, [room, reset]);

  const handleFormSubmit = async (values: RoomFormValues) => {
    await onSave(values, setError as (field: string, err: { type: string; message: string }) => void);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate aria-label={isEdit ? 'Edit room form' : 'Create room form'}>
      <div className="form-group">
        <label htmlFor="room-name" className="form-label">Room Name</label>
        <input
          id="room-name"
          type="text"
          className={`form-input${errors.name ? ' error' : ''}`}
          aria-describedby={errors.name ? 'room-name-error' : undefined}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p id="room-name-error" className="form-error" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="room-description" className="form-label">Description (optional)</label>
        <textarea
          id="room-description"
          rows={3}
          className="form-input"
          {...register('description')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="room-floor" className="form-label">Floor Level (optional)</label>
        <input
          id="room-floor"
          type="text"
          className="form-input"
          {...register('floorLevel')}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          {COMMON_MESSAGES.cancel}
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? COMMON_MESSAGES.saving : (isEdit ? COMMON_MESSAGES.save : ROOM_MESSAGES.createRoom)}
        </button>
      </div>
    </form>
  );
}
