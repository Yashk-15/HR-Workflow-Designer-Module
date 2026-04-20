import StartNode        from './StartNode';
import TaskNode         from './TaskNode';
import ApprovalNode     from './ApprovalNode';
import AutomatedStepNode from './AutomatedStepNode';
import EndNode          from './EndNode';

export const nodeTypes = {
  startNode:         StartNode,
  taskNode:          TaskNode,
  approvalNode:      ApprovalNode,
  automatedStepNode: AutomatedStepNode,
  endNode:           EndNode,
};

export const NODE_TYPE_META = {
  startNode:         { label: 'Start',          color: 'emerald' },
  taskNode:          { label: 'Task',            color: 'blue'    },
  approvalNode:      { label: 'Approval',        color: 'amber'   },
  automatedStepNode: { label: 'Automated Step',  color: 'purple'  },
  endNode:           { label: 'End',             color: 'rose'    },
};
