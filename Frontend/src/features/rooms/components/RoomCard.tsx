/**
 * RoomCard component.
 * Displays a room with its details and action buttons.
 * @see US-003
 */
import type { RoomResponse } from '../types/room.types';
import { useAuthStore } from '../../../store/authStore';

interface RoomCardProps {
  room: RoomResponse;
  onEdit: (room: RoomResponse) => void;
  onDelete: (room: RoomResponse) => void;
}

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <article
      className="card"
      aria-label={`Room: ${room.name}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{room.name}</h3>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => onEdit(room)}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
              aria-label={`Edit room ${room.name}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(room)}
              className="btn-danger"
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
              aria-label={`Delete room ${room.name}`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {room.description && (
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{room.description}</p>
      )}
      {room.floorLevel && (
        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Floor: {room.floorLevel}</p>
      )}
    </article>
  );
}
