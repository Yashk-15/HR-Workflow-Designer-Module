'use client';
import { Download, Upload, RotateCcw, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRef } from 'react';
import useWorkflowStore from '@/store/workflowStore';
import { exportWorkflow, importWorkflow } from '@/utils/exportUtils';
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation';

/**
 * @param {{ onTestClick: () => void }} props
 */
export default function Toolbar({ onTestClick }) {
  const nodes     = useWorkflowStore((s) => s.nodes);
  const edges     = useWorkflowStore((s) => s.edges);
  const resetWorkflow  = useWorkflowStore((s) => s.resetWorkflow);
  const importWF  = useWorkflowStore((s) => s.importWorkflow);
  const fileRef   = useRef(null);
  const { isValid, errors } = useWorkflowValidation();

  const handleExport = () => exportWorkflow(nodes, edges);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importWorkflow(file);
      importWF(data);
    } catch (err) {
      alert(err.message);
    }
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 shrink-0">
      {/* Left: workflow actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700
                     hover:border-slate-600 transition-all"
        >
          <Download size={13} /> Export JSON
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700
                     hover:border-slate-600 transition-all"
        >
          <Upload size={13} /> Import JSON
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        <button
          onClick={() => { if (confirm('Clear the entire workflow?')) resetWorkflow(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-red-400
                     border border-slate-700 hover:border-red-800 transition-all"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Center: validation status */}
      <div className="flex-1 flex items-center justify-center">
        {nodes.length === 0 ? (
          <span className="text-xs text-slate-600">Add nodes to start designing</span>
        ) : isValid ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle size={13} /> Workflow is valid
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-amber-400">
            <AlertTriangle size={13} /> {errors.length} validation issue{errors.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Right: test button */}
      <button
        onClick={onTestClick}
        disabled={nodes.length === 0}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold
                   bg-indigo-600 hover:bg-indigo-500 text-white transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40"
      >
        <Play size={13} className="fill-white" /> Test Workflow
      </button>
    </div>
  );
}
