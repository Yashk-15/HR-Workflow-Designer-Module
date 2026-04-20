'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useWorkflowStore from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';

export default function AutomatedStepNodeForm({ node }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { automations, loading } = useAutomations();
  const { register, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      label: node.data?.label || '',
      actionId: node.data?.actionId || '',
      actionParams: node.data?.actionParams || {},
    },
  });


  useEffect(() => {
    reset({
      label: node.data?.label || '',
      actionId: node.data?.actionId || '',
      actionParams: node.data?.actionParams || {},
    });
  }, [node.id, reset]);

  const selectedActionId = watch('actionId');
  const actionParams = watch('actionParams');

  // Derive selected automation's param list
  const selectedAutomation = automations.find((a) => a.id === selectedActionId);

  // When action changes, reset params
  const handleActionChange = (e) => {
    const id = e.target.value;
    const auto = automations.find((a) => a.id === id);
    const emptyParams = {};
    (auto?.params || []).forEach((p) => { emptyParams[p] = ''; });
    setValue('actionId', id);
    setValue('actionParams', emptyParams);
    const label = watch('label');
    updateNodeData(node.id, { label, actionId: id, actionLabel: auto?.label, actionParams: emptyParams });
  };

  // Live sync
  useEffect(() => {
    const sub = watch((values) => {
      const auto = automations.find((a) => a.id === values.actionId);
      updateNodeData(node.id, { ...values, actionLabel: auto?.label });
    });
    return () => sub.unsubscribe();
  }, [watch, node.id, updateNodeData, automations]);

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
          placeholder="e.g., Send Welcome Email"
        />
        {errors.label && <p className="text-xs text-red-400 mt-1">Title is required</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Action <span className="text-red-400">*</span>
        </label>
        {loading ? (
          <div className="text-xs text-slate-500 animate-pulse">Loading actions…</div>
        ) : (
          <select
            value={selectedActionId}
            onChange={handleActionChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                       focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">— Select an action —</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Dynamic params based on selected action */}
      {selectedAutomation && selectedAutomation.params.length > 0 && (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Action Parameters
          </label>
          {selectedAutomation.params.map((param) => (
            <div key={param}>
              <label className="block text-xs text-slate-500 mb-1 capitalize">{param}</label>
              <input
                value={actionParams[param] || ''}
                onChange={(e) => setValue('actionParams', { ...actionParams, [param]: e.target.value }, { shouldDirty: true })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white
                           placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder={`Enter ${param}…`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
