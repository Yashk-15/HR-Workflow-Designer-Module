'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ClipboardList, AlertCircle } from 'lucide-react';

function TaskNode({ data, selected }) {
  const hasError = data?.errors?.length > 0;
  return (
    <div className={`relative min-w-[180px] rounded-xl shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-blue-400 shadow-blue-400/30 shadow-xl' : 'border-blue-600/40'}
      bg-linear-to-br from-blue-950 to-blue-900`}>
      <Handle type="target" position={Position.Top} className="bg-blue-400! border-blue-700! w-3! h-3!" />
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-t-xl border-b border-blue-600/30">
        <ClipboardList size={13} className="text-blue-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">Task</span>
        {hasError && <AlertCircle size={13} className="text-red-400 ml-auto animate-pulse" title={data.errors.join(', ')} />}
      </div>
      <div className="px-3 py-2 space-y-0.5">
        <p className="text-sm font-medium text-white truncate max-w-[160px]">{data?.label || 'Untitled Task'}</p>
        {data?.assignee && <p className="text-xs text-blue-300/70 truncate">👤 {data.assignee}</p>}
        {data?.dueDate  && <p className="text-xs text-blue-300/50 truncate">📅 {data.dueDate}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} className="bg-blue-400! border-blue-700! w-3! h-3!" />
    </div>
  );
}
export default memo(TaskNode);
