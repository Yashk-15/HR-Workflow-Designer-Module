'use client';
import { Plus, Trash2 } from 'lucide-react';

/**
 * Reusable dynamic key-value pair editor.
 * @param {{ value: Record<string,string>, onChange: (v: Record<string,string>) => void, label?: string }} props
 */
export default function KeyValueEditor({ value = {}, onChange, label = 'Custom Fields' }) {
  const entries = Object.entries(value);

  const addEntry = () => {
    const key = `field_${Date.now()}`;
    onChange({ ...value, [key]: '' });
  };

  const updateKey = (oldKey, newKey) => {
    const newVal = {};
    Object.entries(value).forEach(([k, v]) => {
      newVal[k === oldKey ? newKey : k] = v;
    });
    onChange(newVal);
  };

  const updateValue = (key, newVal) => {
    onChange({ ...value, [key]: newVal });
  };

  const removeEntry = (key) => {
    const newVal = { ...value };
    delete newVal[key];
    onChange(newVal);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      {entries.length === 0 && (
        <p className="text-xs text-slate-600 italic">No fields yet.</p>
      )}
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-1.5 items-center">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200
                       placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            value={k}
            placeholder="key"
            onChange={(e) => updateKey(k, e.target.value)}
          />
          <input
            className="flex-[2] bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200
                       placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            value={v}
            placeholder="value"
            onChange={(e) => updateValue(k, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeEntry(k)}
            className="text-slate-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
