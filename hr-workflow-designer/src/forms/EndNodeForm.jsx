'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useWorkflowStore from '@/store/workflowStore';

export default function EndNodeForm({ node }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, reset } = useForm({
    defaultValues: {
      label:       node.data?.label       || 'End',
      endMessage:  node.data?.endMessage  || '',
      summaryFlag: node.data?.summaryFlag ?? false,
    },
  });

  useEffect(() => {
    reset({
      label:       node.data?.label       || 'End',
      endMessage:  node.data?.endMessage  || '',
      summaryFlag: node.data?.summaryFlag ?? false,
    });
  }, [node.id, reset]);

  useEffect(() => {
    const sub = watch((values) =>
      updateNodeData(node.id, { ...values, summaryFlag: Boolean(values.summaryFlag) })
    );
    return () => sub.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          End Title
        </label>
        <input
          {...register('label')}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="e.g., Onboarding Complete"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          End Message
        </label>
        <textarea
          {...register('endMessage')}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          placeholder="e.g., Onboarding completed successfully!"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            id="summaryFlag"
            type="checkbox"
            {...register('summaryFlag')}
            className="sr-only peer"
          />
          <label
            htmlFor="summaryFlag"
            className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-700
                       transition-colors peer-checked:bg-indigo-500"
          >
            <span className="ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform
                             peer-checked:translate-x-4 translate-x-0 block" />
          </label>
        </div>
        <label htmlFor="summaryFlag" className="text-sm text-slate-300 cursor-pointer">
          Generate Workflow Summary
        </label>
      </div>
    </div>
  );
}
