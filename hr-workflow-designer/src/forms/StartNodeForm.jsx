'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import KeyValueEditor from '@/components/KeyValueEditor';
import useWorkflowStore from '@/store/workflowStore';

const inp = 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-colors';
const lbl = 'block text-xs font-medium text-slate-600 mb-1.5';

export default function StartNodeForm({ node }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, setValue, reset } = useForm({
    defaultValues: { label: node.data?.label || 'Start', metadata: node.data?.metadata || {} },
  });

  useEffect(() => { reset({ label: node.data?.label || 'Start', metadata: node.data?.metadata || {} }); }, [node.id, reset]);
  useEffect(() => { const sub = watch((v) => updateNodeData(node.id, v)); return () => sub.unsubscribe(); }, [watch, node.id, updateNodeData]);

  const metadata = watch('metadata');

  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Start Title</label>
        <input {...register('label')} className={inp} placeholder="e.g., Onboarding Start" />
      </div>
      <KeyValueEditor label="Metadata" value={metadata} onChange={(v) => setValue('metadata', v, { shouldDirty: true })} />
    </div>
  );
}
