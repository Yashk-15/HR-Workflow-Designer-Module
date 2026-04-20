'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FlagTriangleRight } from 'lucide-react';

function EndNode({ data, selected }) {
  return (
    <div className={`relative min-w-[160px] rounded-xl shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-rose-400 shadow-rose-400/30 shadow-xl' : 'border-rose-600/40'}
      bg-gradient-to-br from-rose-950 to-rose-900`}>
      <Handle type="target" position={Position.Top} className="!bg-rose-400 !border-rose-700 !w-3 !h-3" />
      <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/20 rounded-t-xl border-b border-rose-600/30">
        <FlagTriangleRight size={13} className="text-rose-400 fill-rose-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-rose-300">End</span>
      </div>
      <div className="px-3 py-2 space-y-0.5">
        <p className="text-sm font-medium text-white truncate max-w-[140px]">{data?.label || 'End'}</p>
        {data?.endMessage  && <p className="text-xs text-rose-300/60 truncate italic">"{data.endMessage}"</p>}
        {data?.summaryFlag && <span className="inline-block text-xs bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full">Summary On</span>}
      </div>
    </div>
  );
}
export default memo(EndNode);
