import { useCallback } from 'react';
import { simulateWorkflow } from '@/api/simulate';
import useWorkflowStore from '@/store/workflowStore';
import useSimulationStore from '@/store/simulationStore';

/**
 * Custom hook that serializes the current workflow and calls POST /api/simulate.
 * Manages loading / result / error state via simulationStore.
 */
export function useSimulation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const { status, result, error, setRunning, setResult, setError, reset } =
    useSimulationStore();

  const run = useCallback(async () => {
    setRunning();
    try {
      const data = await simulateWorkflow({ nodes, edges });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Unknown simulation error');
    }
  }, [nodes, edges, setRunning, setResult, setError]);

  return { run, reset, status, result, error };
}
