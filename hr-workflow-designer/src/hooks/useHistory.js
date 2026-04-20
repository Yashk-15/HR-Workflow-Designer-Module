import { useEffect } from 'react';
import { useStore } from 'zustand';
import useWorkflowStore from '@/store/workflowStore';

/**
 * Exposes undo/redo from zundo temporal store.
 * useWorkflowStore.temporal is a vanilla zustand store — must use useStore() to subscribe reactively.
 */
export function useHistory({ enableKeyboard = false } = {}) {
  const pastCount   = useStore(useWorkflowStore.temporal, (s) => s.pastStates.length);
  const futureCount = useStore(useWorkflowStore.temporal, (s) => s.futureStates.length);

  useEffect(() => {
    if (!enableKeyboard) return;
    const handler = (e) => {
      const ctrl = navigator.platform.toUpperCase().includes('MAC') ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useWorkflowStore.temporal.getState().undo();
      }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        useWorkflowStore.temporal.getState().redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enableKeyboard]);

  return {
    undo:    () => useWorkflowStore.temporal.getState().undo(),
    redo:    () => useWorkflowStore.temporal.getState().redo(),
    clear:   () => useWorkflowStore.temporal.getState().clear(),
    canUndo: pastCount  > 0,
    canRedo: futureCount > 0,
  };
}
