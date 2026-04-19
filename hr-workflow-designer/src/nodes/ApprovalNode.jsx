'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ShieldCheck, AlertCircle } from 'lucide-react';

function ApprovalNode({ data, selected }) {
  const hasError = data?.errors?.length > 0;
  return (
    <div
      className={`relative min-w-[180px] rounded-xl shadow-lg border-2 transition-all duration-200
        ${selected ? 'border-amber-400 shadow-amber-400/30 shadow-xl' : 'border-amber-600/40'}
        bg-gradient-to-br from-amber-950 to-amber-900`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-400 !border-amber-700 !w-3 !h-3"
      />
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 rounded-t-xl border-b border-amber-600/30">
        <ShieldCheck size={13} className="text-amber-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">Approval</span>
        {hasError && (
          <AlertCircle size={13} className="text-red-400 ml-auto animate-pulse" title={data.errors.join(', ')} />
        )}
      </div>
      {/* Body */}
      <div className="px-3 py-2 space-y-0.5">
        <p className="text-sm font-medium text-white truncate max-w-[160px]">
          {data?.label || 'Untitled Approval'}
        </p>
        {data?.approverRole && (
          <p className="text-xs text-amber-300/70 truncate">🎯 {data.approverRole}</p>
        )}
        {data?.autoApproveThreshold != null && (
          <p className="text-xs text-amber-300/50">Auto @{data.autoApproveThreshold}%</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-400 !border-amber-700 !w-3 !h-3"
      />
    </div>
  );
}

export default memo(ApprovalNode);
