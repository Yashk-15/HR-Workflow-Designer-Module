'use client';
import { X, Play, CheckCircle2, XCircle, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation';

const STATUS_ICON = {
  success: <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={14} className="text-red-400 shrink-0" />,
  skipped: <Clock size={14} className="text-slate-500 shrink-0" />,
};

const STATUS_DOT = {
  success: 'bg-emerald-400',
  error: 'bg-red-400',
  skipped: 'bg-slate-600',
};

/** @param {{ onClose: () => void }} props */
export default function SimulationPanel({ onClose }) {
  const { run, reset, status, result, error } = useSimulation();
  const { errors: validationErrors, isValid } = useWorkflowValidation();

  const handleRun = () => {
    run();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-white">Workflow Sandbox</h2>
            <p className="text-xs text-slate-500">Simulate workflow execution step-by-step</p>
          </div>
          <button
            onClick={() => { reset(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Validation warnings */}
        {!isValid && (
          <div className="mx-5 mt-4 rounded-xl border border-amber-700/40 bg-amber-950/20 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-300">Workflow has issues</p>
                {validationErrors.slice(0, 3).map((e, i) => (
                  <p key={i} className="text-xs text-amber-400/70 mt-0.5">{e}</p>
                ))}
                {validationErrors.length > 3 && (
                  <p className="text-xs text-amber-600 mt-0.5">+{validationErrors.length - 3} more…</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {status === 'idle' && !result && (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-sm text-slate-400">Click <strong className="text-white">Run Simulation</strong> to execute the workflow.</p>
              <p className="text-xs text-slate-600 mt-1">The workflow graph will be serialized and sent to the mock API.</p>
            </div>
          )}

          {status === 'running' && (
            <div className="flex items-center justify-center py-10 gap-3">
              <Loader2 size={20} className="text-indigo-400 animate-spin" />
              <p className="text-sm text-slate-400">Running simulation…</p>
            </div>
          )}

          {status === 'error' && !result && (
            <div className="rounded-xl border border-red-700/40 bg-red-950/20 px-4 py-3">
              <p className="text-xs font-semibold text-red-400">Simulation Error</p>
              <p className="text-xs text-red-300/70 mt-1">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary */}
              <div className={`rounded-xl border px-4 py-3
                ${result.success
                  ? 'border-emerald-700/40 bg-emerald-950/20'
                  : 'border-red-700/40 bg-red-950/20'}`}
              >
                <p className="text-xs font-semibold text-white">{result.summary}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {result.executedNodes}/{result.totalNodes} nodes executed
                </p>
              </div>

              {/* Step timeline */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Execution Log
                </p>
                <div className="relative ml-2">
                  {result.steps.map((step, i) => (
                    <div key={step.nodeId} className="relative flex gap-3 pb-4">
                      {/* Vertical line */}
                      {i < result.steps.length - 1 && (
                        <div className="absolute left-[6px] top-4 bottom-0 w-px bg-slate-800" />
                      )}
                      {/* Status dot */}
                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2 border-slate-900 ${STATUS_DOT[step.status] || 'bg-slate-600'}`} />
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-white">{step.label}</p>
                            <p className="text-xs text-slate-500">{step.message}</p>
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0
                            ${step.status === 'success' ? 'bg-emerald-500/15 text-emerald-400'
                              : step.status === 'error' ? 'bg-red-500/15 text-red-400'
                                : 'bg-slate-800 text-slate-500'}`}
                          >
                            {step.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5 font-mono">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-slate-800 shrink-0">
          {result && (
            <button
              onClick={reset}
              className="px-3 py-2 rounded-lg text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleRun}
            disabled={status === 'running'}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold
                       bg-indigo-600 hover:bg-indigo-500 text-white transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'running' ? (
              <><Loader2 size={13} className="animate-spin" /> Running…</>
            ) : (
              <><Play size={13} className="fill-white" /> Run Simulation</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
