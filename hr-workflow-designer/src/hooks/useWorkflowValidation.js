import { useMemo } from 'react';
import useWorkflowStore from '@/store/workflowStore';
import { hasCycle, findUnreachableNodes } from '@/utils/graphUtils';

/**
 * Validates the workflow graph structure and returns per-node and global errors.
 *
 * @returns {{
 *   errors: string[],
 *   nodeErrors: Record<string, string[]>,
 *   isValid: boolean,
 * }}
 */
export function useWorkflowValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  return useMemo(() => {
    const errors = [];
    /** @type {Record<string, string[]>} */
    const nodeErrors = {};

    const addNodeError = (id, msg) => {
      if (!nodeErrors[id]) nodeErrors[id] = [];
      nodeErrors[id].push(msg);
    };

    const nodeIds = nodes.map((n) => n.id);

    // 1. Must have exactly one Start node
    const startNodes = nodes.filter((n) => n.type === 'startNode');
    if (startNodes.length === 0) {
      errors.push('Workflow must have a Start node.');
    } else if (startNodes.length > 1) {
      errors.push('Workflow can only have one Start node.');
      startNodes.forEach((n) => addNodeError(n.id, 'Duplicate Start node'));
    }

    // 2. Must have at least one End node
    const endNodes = nodes.filter((n) => n.type === 'endNode');
    if (endNodes.length === 0) {
      errors.push('Workflow must have an End node.');
    }

    // 3. No cycles
    if (nodeIds.length > 0 && hasCycle(nodeIds, edges)) {
      errors.push('Workflow contains a cycle. Cycles are not allowed.');
    }

    // 4. No isolated / unreachable nodes
    if (nodeIds.length > 1) {
      const unreachable = findUnreachableNodes(nodeIds, edges);
      unreachable.forEach((id) => {
        const node = nodes.find((n) => n.id === id);
        const label = node?.data?.label || id;
        errors.push(`Node "${label}" is not connected to the workflow.`);
        addNodeError(id, 'Not connected');
      });
    }

    // 5. Required fields per node type
    nodes.forEach((node) => {
      const d = node.data || {};
      if (['taskNode', 'approvalNode', 'automatedStepNode'].includes(node.type)) {
        if (!d.label || d.label.trim() === '') {
          addNodeError(node.id, 'Title is required');
          errors.push(`A ${node.type} node is missing a required title.`);
        }
      }
      if (node.type === 'automatedStepNode' && !d.actionId) {
        addNodeError(node.id, 'No action selected');
      }
    });

    return {
      errors,
      nodeErrors,
      isValid: errors.length === 0,
    };
  }, [nodes, edges]);
}
