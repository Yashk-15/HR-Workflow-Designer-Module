'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, AlertCircle } from 'lucide-react';

function AutomatedStepNode({ data, selected }) {
  const hasError = data?.errors?.length > 0;
  return (
    <div className={`relative min-w-[180px] rounded-xl shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-purple-400 shadow-purple-400/30 shadow-xl' : 'border-purple-600/40'}
      bg-linear-to-br from-purple-950 to-purple-900`}>
      <Handle type="target" position={Position.Top} className="bg-purple-400! border-purple-700! w-3! h-3!" />
      <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-t-xl border-b border-purple-600/30">
        <Zap size={13} className="text-purple-400 fill-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">Auto Step</span>
        {hasError && <AlertCircle size={13} className="text-red-400 ml-auto animate-pulse" title={data.errors.join(', ')} />}
      </div>
      <div className="px-3 py-2 space-y-0.5">
        <p className="text-sm font-medium text-white truncate max-w-[160px]">{data?.label || 'Untitled Action'}</p>
        {data?.actionLabel && <p className="text-xs text-purple-300/70 truncate">⚡ {data.actionLabel}</p>}
        {!data?.actionId   && <p className="text-xs text-red-400/70">No action selected</p>}
      </div>
      <Handle type="source" position={Position.Bottom} className="bg-purple-400! border-purple-700! w-3! h-3!" />
    </div>
  );
}
export default memo(AutomatedStepNode);
