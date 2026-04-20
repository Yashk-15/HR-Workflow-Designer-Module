import { create } from 'zustand';

const useSimulationStore = create((set) => ({
  status: 'idle',
  result: null,
  error:  null,

  setRunning: () => set({ status: 'running', result: null, error: null }),
  setResult:  (r) => set({ status: r.success ? 'success' : 'error', result: r }),
  setError:   (msg) => set({ status: 'error', error: msg }),
  reset:      () => set({ status: 'idle', result: null, error: null }),
}));

export default useSimulationStore;
