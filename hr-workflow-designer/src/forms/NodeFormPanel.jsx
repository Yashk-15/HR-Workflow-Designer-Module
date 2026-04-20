'use client';
import { X, Trash2 } from 'lucide-react';
import useWorkflowStore from '@/store/workflowStore';
import { NODE_TYPE_META } from '@/nodes/index';
import StartNodeForm from './StartNodeForm';
import TaskNodeForm from './TaskNodeForm';
import ApprovalNodeForm from './ApprovalNodeForm';
import AutomatedStepNodeForm from './AutomatedStepNodeForm';
import EndNodeForm from './EndNodeForm';

const FORM_MAP = {
  startNode: StartNodeForm,
  taskNode: TaskNodeForm,
  approvalNode: ApprovalNodeForm,
  automatedStepNode: AutomatedStepNodeForm,
  endNode: EndNodeForm,
};

/**
 * Smart form panel dispatcher.
 * Reads selectedNodeId from store, renders the correct form component.
 */
export default function NodeFormPanel() {
  const getSelectedNode = useWorkflowStore((s) => s.getSelectedNode);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const removeNode = useWorkflowStore((s) => s.removeNode);

  const node = getSelectedNode();

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
          <span className="text-2xl">👆</span>
        </div>
        <p className="text-sm text-slate-500">Select a node on the canvas to configure it</p>
      </div>
    );
  }

  const FormComponent = FORM_MAP[node.type];
  const meta = NODE_TYPE_META[node.type] || { label: node.type };

  const COLOR_MAP = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };
  const colorClass = COLOR_MAP[meta.color] || 'text-slate-400 bg-slate-800 border-slate-700';

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>
            {meta.label}
          </span>
          <span className="text-xs text-slate-600 font-mono truncate max-w-[80px]">{node.id.slice(-6)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => removeNode(node.id)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete node"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Close panel"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {FormComponent ? (
          <FormComponent node={node} />
        ) : (
          <p className="text-sm text-slate-500">No form available for this node type.</p>
        )}
      </div>
    </div>
  );
}
