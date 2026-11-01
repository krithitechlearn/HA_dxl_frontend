/**
 * useRooms hook.
 * Manages room list, create, update, and delete operations.
 * @see US-003, API-010 to API-014
 */
import { useState, useEffect, useCallback } from 'react';
import * as roomService from '../../../services/roomService';
import type { RoomResponse, RoomCreateRequest, RoomUpdateRequest } from '../types/room.types';
import type { PagedResponse } from '../../../types/api.types';
import { useNotificationStore } from '../../../store/notificationStore';
import { getErrorMessage, mapFieldErrorsToForm, getFieldErrors } from '../../../utils/errorUtils';
import { ROOM_MESSAGES } from '../../../messages';

export function useRooms(page: number, size: number) {
  const [data, setData] = useState<PagedResponse<RoomResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await roomService.getRooms({ page, size, sort: 'name,asc' });
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const createRoom = async (
    request: RoomCreateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await roomService.createRoom(request);
      addNotification('success', ROOM_MESSAGES.roomCreated);
      void fetchRooms();
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setFormError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  const updateRoom = async (
    id: string,
    request: RoomUpdateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await roomService.updateRoom(id, request);
      addNotification('success', ROOM_MESSAGES.roomUpdated);
      void fetchRooms();
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setFormError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  const deleteRoom = async (id: string): Promise<boolean> => {
    try {
      await roomService.deleteRoom(id);
      addNotification('success', ROOM_MESSAGES.roomDeleted);
      void fetchRooms();
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  return { data, isLoading, error, refetch: fetchRooms, createRoom, updateRoom, deleteRoom };
}
