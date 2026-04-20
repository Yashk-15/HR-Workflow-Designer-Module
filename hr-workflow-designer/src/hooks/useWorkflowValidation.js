import { useMemo } from 'react';
import useWorkflowStore from '@/store/workflowStore';
import { hasCycle, findUnreachableNodes } from '@/utils/graphUtils';

/** Validates workflow graph structure. Returns per-node errors and global errors. */
export function useWorkflowValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  return useMemo(() => {
    const errors = [];
    const nodeErrors = {};

    const addNodeError = (id, msg) => {
      nodeErrors[id] = [...(nodeErrors[id] || []), msg];
    };

    const nodeIds = nodes.map((n) => n.id);
    const startNodes = nodes.filter((n) => n.type === 'startNode');
    const endNodes   = nodes.filter((n) => n.type === 'endNode');

    if (startNodes.length === 0) errors.push('Workflow must have a Start node.');
    if (startNodes.length > 1) {
      errors.push('Workflow can only have one Start node.');
      startNodes.forEach((n) => addNodeError(n.id, 'Duplicate Start node'));
    }
    if (endNodes.length === 0) errors.push('Workflow must have an End node.');

    if (nodeIds.length > 0 && hasCycle(nodeIds, edges))
      errors.push('Workflow contains a cycle. Cycles are not allowed.');

    if (nodeIds.length > 1) {
      findUnreachableNodes(nodeIds, edges).forEach((id) => {
        const label = nodes.find((n) => n.id === id)?.data?.label || id;
        errors.push(`Node "${label}" is not connected to the workflow.`);
        addNodeError(id, 'Not connected');
      });
    }

    nodes.forEach((node) => {
      const d = node.data || {};
      if (['taskNode', 'approvalNode', 'automatedStepNode'].includes(node.type)) {
        if (!d.label?.trim()) {
          addNodeError(node.id, 'Title is required');
          errors.push(`A ${node.type} node is missing a required title.`);
        }
      }
      if (node.type === 'automatedStepNode' && !d.actionId)
        addNodeError(node.id, 'No action selected');
    });

    return { errors, nodeErrors, isValid: errors.length === 0 };
  }, [nodes, edges]);
}
