'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import KeyValueEditor from '@/components/KeyValueEditor';
import useWorkflowStore from '@/store/workflowStore';

export default function TaskNodeForm({ node }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      label:        node.data?.label        || '',
      description:  node.data?.description  || '',
      assignee:     node.data?.assignee     || '',
      dueDate:      node.data?.dueDate      || '',
      customFields: node.data?.customFields || {},
    },
  });

  useEffect(() => {
    reset({
      label:        node.data?.label        || '',
      description:  node.data?.description  || '',
      assignee:     node.data?.assignee     || '',
      dueDate:      node.data?.dueDate      || '',
      customFields: node.data?.customFields || {},
    });
  }, [node.id, reset]);

  useEffect(() => {
    const sub = watch((values) => updateNodeData(node.id, values));
    return () => sub.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  const customFields = watch('customFields');

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
          placeholder="e.g., Collect Documents"
        />
        {errors.label && <p className="text-xs text-red-400 mt-1">Title is required</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          placeholder="Describe what needs to happen…"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Assignee</label>
        <input
          {...register('assignee')}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="e.g., hr@company.com"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                     focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <KeyValueEditor
        label="Custom Fields"
        value={customFields}
        onChange={(v) => setValue('customFields', v, { shouldDirty: true })}
      />
    </div>
  );
}
