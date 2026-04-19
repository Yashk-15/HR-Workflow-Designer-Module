import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedStepNode from './AutomatedStepNode';
import EndNode from './EndNode';

/**
 * nodeTypes map for React Flow.
 * Keys must match the `type` field used when creating nodes.
 */
export const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedStepNode: AutomatedStepNode,
  endNode: EndNode,
};

/** Human-readable labels for each node type */
export const NODE_TYPE_META = {
  startNode:         { label: 'Start',          color: 'emerald' },
  taskNode:          { label: 'Task',            color: 'blue'    },
  approvalNode:      { label: 'Approval',        color: 'amber'   },
  automatedStepNode: { label: 'Automated Step',  color: 'purple'  },
  endNode:           { label: 'End',             color: 'rose'    },
};
