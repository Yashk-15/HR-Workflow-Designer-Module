'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import KeyValueEditor from '@/components/KeyValueEditor';
import useWorkflowStore from '@/store/workflowStore';

export default function StartNodeForm({ node }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, setValue, reset } = useForm({
    defaultValues: { label: node.data?.label || 'Start', metadata: node.data?.metadata || {} },
  });

  // Reset form when a different node is selected
  useEffect(() => {
    reset({ label: node.data?.label || 'Start', metadata: node.data?.metadata || {} });
  }, [node.id, reset]);

  // Live sync to store
  useEffect(() => {
    const subscription = watch((values) => {
      updateNodeData(node.id, values);
    });
    return () => subscription.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  const metadata = watch('metadata');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Start Title
        </label>
        <input
          {...register('label')}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="e.g., Onboarding Start"
        />
      </div>
      <KeyValueEditor
        label="Metadata"
        value={metadata}
        onChange={(v) => setValue('metadata', v, { shouldDirty: true })}
      />
    </div>
  );
}
