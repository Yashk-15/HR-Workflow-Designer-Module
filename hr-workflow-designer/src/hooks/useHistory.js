import { useEffect } from 'react';
import useWorkflowStore from '@/store/workflowStore';

/**
 * Exposes undo/redo actions and state from zundo's temporal store.
 * Also registers Ctrl+Z / Ctrl+Y keyboard shortcuts globally.
 *
 * @param {{ enableKeyboard?: boolean }} options
 * @returns {{ undo: () => void, redo: () => void, canUndo: boolean, canRedo: boolean, clear: () => void }}
 */
export function useHistory({ enableKeyboard = false } = {}) {
  // Access the temporal store attached to useWorkflowStore by zundo
  const { undo, redo, clear, pastStates, futureStates } =
    useWorkflowStore.temporal.getState();

  // Subscribe to temporal store so canUndo/canRedo reactively update
  const pastCount  = useWorkflowStore.temporal((s) => s.pastStates.length);
  const futureCount = useWorkflowStore.temporal((s) => s.futureStates.length);

  // Keyboard shortcuts — only registered at the top-level canvas
  useEffect(() => {
    if (!enableKeyboard) return;

    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl  = isMac ? e.metaKey : e.ctrlKey;

      if (!ctrl) return;

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useWorkflowStore.temporal.getState().undo();
      }
      if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        useWorkflowStore.temporal.getState().redo();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enableKeyboard]);

  return {
    undo:     () => useWorkflowStore.temporal.getState().undo(),
    redo:     () => useWorkflowStore.temporal.getState().redo(),
    clear:    () => useWorkflowStore.temporal.getState().clear(),
    canUndo:  pastCount  > 0,
    canRedo:  futureCount > 0,
  };
}
