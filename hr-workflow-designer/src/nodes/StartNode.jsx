'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, AlertCircle } from 'lucide-react';

function StartNode({ data, selected }) {
  const hasError = data?.errors?.length > 0;
  return (
    <div
      className={`relative min-w-[160px] rounded-xl shadow-lg border-2 transition-all duration-200
        ${selected ? 'border-emerald-400 shadow-emerald-400/30 shadow-xl' : 'border-emerald-600/40'}
        bg-gradient-to-br from-emerald-950 to-emerald-900`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 rounded-t-xl border-b border-emerald-600/30">
        <Play size={13} className="text-emerald-400 fill-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Start</span>
        {hasError && (
          <AlertCircle size={13} className="text-red-400 ml-auto animate-pulse" title={data.errors.join(', ')} />
        )}
      </div>
      {/* Body */}
      <div className="px-3 py-2">
        <p className="text-sm font-medium text-white truncate max-w-[140px]">
          {data?.label || 'Start'}
        </p>
        {data?.metadata && Object.keys(data.metadata).length > 0 && (
          <p className="text-xs text-emerald-400/70 mt-0.5">{Object.keys(data.metadata).length} metadata</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-400 !border-emerald-700 !w-3 !h-3"
      />
    </div>
  );
}

export default memo(StartNode);
