/**
 * useConfirmDialog hook.
 * Manages open/close state and pending action for confirmation dialogs.
 */
import { useState, useCallback } from 'react';

interface UseConfirmDialogReturn {
  isOpen: boolean;
  open: (onConfirm: () => void | Promise<void>) => void;
  close: () => void;
  confirm: () => void;
  isLoading: boolean;
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void | Promise<void>) | null>(null);

  const open = useCallback((onConfirm: () => void | Promise<void>) => {
    setPendingAction(() => onConfirm);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPendingAction(null);
  }, []);

  const confirm = useCallback(async () => {
    if (!pendingAction) return;
    setIsLoading(true);
    try {
      await pendingAction();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setPendingAction(null);
    }
  }, [pendingAction]);

  return { isOpen, open, close, confirm, isLoading };
}
