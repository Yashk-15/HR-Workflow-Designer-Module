import { create } from 'zustand';

/**
 * Simulation store — tracks the execution log and status for
 * the workflow sandbox panel.
 */
const useSimulationStore = create((set) => ({
  status: 'idle', // 'idle' | 'running' | 'success' | 'error'
  result: null,   // full response from POST /api/simulate
  error: null,

  setRunning: () => set({ status: 'running', result: null, error: null }),
  setResult:  (result) => set({ status: result.success ? 'success' : 'error', result }),
  setError:   (message) => set({ status: 'error', error: message }),
  reset:      () => set({ status: 'idle', result: null, error: null }),
}));

export default useSimulationStore;
