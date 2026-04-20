import { useCallback } from 'react';
import { simulateWorkflow } from '@/api/simulate';
import useWorkflowStore from '@/store/workflowStore';
import useSimulationStore from '@/store/simulationStore';

export function useSimulation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const { status, result, error, setRunning, setResult, setError, reset } =
    useSimulationStore();

  const run = useCallback(async () => {
    setRunning();
    try {
      setResult(await simulateWorkflow({ nodes, edges }));
    } catch (err) {
      setError(err.message || 'Unknown simulation error');
    }
  }, [nodes, edges, setRunning, setResult, setError]);

  return { run, reset, status, result, error };
}
