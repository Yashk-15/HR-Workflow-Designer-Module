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
        <div
          role="switch"
          aria-checked={watch('summaryFlag')}
          onClick={() => setValue('summaryFlag', !watch('summaryFlag'), { shouldDirty: true })}
          className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-200
            ${watch('summaryFlag') ? 'bg-indigo-500' : 'bg-slate-700'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
              transition-transform duration-200
              ${watch('summaryFlag') ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </div>
        <label className="text-sm text-slate-300 cursor-pointer select-none"
               onClick={() => setValue('summaryFlag', !watch('summaryFlag'), { shouldDirty: true })}>
          Generate Workflow Summary
        </label>
      </div>
    </div>
  );
}
