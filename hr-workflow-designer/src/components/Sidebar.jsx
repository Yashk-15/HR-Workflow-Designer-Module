'use client';
import { Play, FlagTriangleRight, ClipboardList, ShieldCheck, Zap } from 'lucide-react';

const NODE_PALETTE = [
  {
    type: 'startNode',
    label: 'Start',
    description: 'Workflow entry point',
    icon: Play,
    color: 'emerald',
    defaultData: { label: 'Start', metadata: {} },
  },
  {
    type: 'taskNode',
    label: 'Task',
    description: 'Human task step',
    icon: ClipboardList,
    color: 'blue',
    defaultData: { label: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} },
  },
  {
    type: 'approvalNode',
    label: 'Approval',
    description: 'Manager / HR approval',
    icon: ShieldCheck,
    color: 'amber',
    defaultData: { label: 'Approval', approverRole: 'Manager', autoApproveThreshold: 80 },
  },
  {
    type: 'automatedStepNode',
    label: 'Automated Step',
    description: 'System-triggered action',
    icon: Zap,
    color: 'purple',
    defaultData: { label: 'Auto Step', actionId: '', actionLabel: '', actionParams: {} },
  },
  {
    type: 'endNode',
    label: 'End',
    description: 'Workflow completion',
    icon: FlagTriangleRight,
    color: 'rose',
    defaultData: { label: 'End', endMessage: '', summaryFlag: false },
  },
];

const COLOR_STYLES = {
  emerald: {
    card: 'border-emerald-700/40 bg-emerald-950/40 hover:border-emerald-500/60 hover:bg-emerald-950/70',
    icon: 'bg-emerald-500/15 text-emerald-400',
    label: 'text-emerald-300',
  },
  blue: {
    card: 'border-blue-700/40 bg-blue-950/40 hover:border-blue-500/60 hover:bg-blue-950/70',
    icon: 'bg-blue-500/15 text-blue-400',
    label: 'text-blue-300',
  },
  amber: {
    card: 'border-amber-700/40 bg-amber-950/40 hover:border-amber-500/60 hover:bg-amber-950/70',
    icon: 'bg-amber-500/15 text-amber-400',
    label: 'text-amber-300',
  },
  purple: {
    card: 'border-purple-700/40 bg-purple-950/40 hover:border-purple-500/60 hover:bg-purple-950/70',
    icon: 'bg-purple-500/15 text-purple-400',
    label: 'text-purple-300',
  },
  rose: {
    card: 'border-rose-700/40 bg-rose-950/40 hover:border-rose-500/60 hover:bg-rose-950/70',
    icon: 'bg-rose-500/15 text-rose-400',
    label: 'text-rose-300',
  },
};

export default function Sidebar() {
  const onDragStart = (e, nodeType, defaultData) => {
    e.dataTransfer.setData('application/reactflow-type', nodeType);
    e.dataTransfer.setData('application/reactflow-data', JSON.stringify(defaultData));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 shrink-0 bg-slate-950/80 border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Node Palette</h2>
        <p className="text-xs text-slate-600 mt-0.5">Drag onto canvas</p>
      </div>

      {/* Node cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {NODE_PALETTE.map(({ type, label, description, icon: Icon, color, defaultData }) => {
          const s = COLOR_STYLES[color];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type, defaultData)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-grab active:cursor-grabbing
                          transition-all duration-200 select-none ${s.card}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.icon}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold ${s.label}`}>{label}</p>
                <p className="text-xs text-slate-600 truncate">{description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-slate-800">
        <p className="text-xs text-slate-700">
          Press <kbd className="bg-slate-800 px-1 rounded text-slate-500">Del</kbd> to remove selected
        </p>
      </div>
    </aside>
  );
}
