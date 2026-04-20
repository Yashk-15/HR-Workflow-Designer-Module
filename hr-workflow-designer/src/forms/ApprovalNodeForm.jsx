'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useWorkflowStore from '@/store/workflowStore';

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'CEO'];

export default function ApprovalNodeForm({ node }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      label: node.data?.label || '',
      approverRole: node.data?.approverRole || 'Manager',
      autoApproveThreshold: node.data?.autoApproveThreshold ?? 80,
    },
  });

  useEffect(() => {
    reset({
      label: node.data?.label || '',
      approverRole: node.data?.approverRole || 'Manager',
      autoApproveThreshold: node.data?.autoApproveThreshold ?? 80,
    });
  }, [node.id, reset]);

  useEffect(() => {
    const sub = watch((values) =>
      updateNodeData(node.id, {
        ...values,
        autoApproveThreshold: Number(values.autoApproveThreshold),
      })
    );
    return () => sub.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          {...register('label', { required: true })}
          className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-white
                      placeholder-slate-600 focus:outline-none transition-colors
                      ${errors.label ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500'}`}
          placeholder="e.g., Manager Approval"
        />
        {errors.label && <p className="text-xs text-red-400 mt-1">Title is required</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Approver Role
        </label>
        <select
          {...register('approverRole')}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     focus:outline-none focus:border-indigo-500 transition-colors"
        >
          {APPROVER_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Auto-Approve Threshold (%)
        </label>
        <input
          type="number"
          min={0}
          max={100}
          {...register('autoApproveThreshold')}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <p className="text-xs text-slate-600 mt-1">Auto-approve when score exceeds this threshold.</p>
      </div>
    </div>
  );
}
