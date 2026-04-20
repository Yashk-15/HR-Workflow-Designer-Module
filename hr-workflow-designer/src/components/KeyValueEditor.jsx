'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

/**
 * Convert a Record<string,string> to the internal array format.
 * Each entry gets a stable local ID so renames don't destroy ordering.
 */
function recordToEntries(record = {}) {
  return Object.entries(record).map(([key, value]) => ({
    id: `${key}_${Math.random().toString(36).slice(2, 7)}`,
    key,
    value,
  }));
}

/** Convert internal array back to Record<string,string> for the parent form. */
function entriesToRecord(entries) {
  const out = {};
  entries.forEach(({ key, value }) => {
    // Last write wins if keys collide — but we warn via UI below
    out[key] = value;
  });
  return out;
}

/**
 * Reusable dynamic key-value pair editor.
 * Stores entries as an internal array so renames are non-destructive and
 * ordering is preserved. Converts to/from Record<string,string> at boundary.
 *
 * @param {{ value: Record<string,string>, onChange: (v: Record<string,string>) => void, label?: string }} props
 */
export default function KeyValueEditor({ value = {}, onChange, label = 'Custom Fields' }) {
  const [entries, setEntries] = useState(() => recordToEntries(value));

  // Sync inbound prop changes (e.g. node switch resets form)
  useEffect(() => {
    setEntries(recordToEntries(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  const commit = (next) => {
    setEntries(next);
    onChange(entriesToRecord(next));
  };

  const addEntry = () =>
    commit([...entries, { id: `field_${Date.now()}`, key: '', value: '' }]);

  const updateKey = (id, newKey) =>
    commit(entries.map((e) => (e.id === id ? { ...e, key: newKey } : e)));

  const updateValue = (id, newValue) =>
    commit(entries.map((e) => (e.id === id ? { ...e, value: newValue } : e)));

  const removeEntry = (id) =>
    commit(entries.filter((e) => e.id !== id));

  // Detect duplicate keys for visual warning
  const keyCounts = entries.reduce((acc, { key }) => {
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

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

      {entries.map(({ id, key, value: val }) => {
        const isDuplicate = keyCounts[key] > 1;
        return (
          <div key={id} className="flex gap-1.5 items-center">
            <div className="flex-1 relative">
              <input
                className={`w-full bg-slate-800 border rounded-md px-2 py-1 text-xs text-slate-200
                           placeholder-slate-600 focus:outline-none transition-colors
                           ${isDuplicate ? 'border-amber-500' : 'border-slate-700 focus:border-indigo-500'}`}
                value={key}
                placeholder="key"
                onChange={(e) => updateKey(id, e.target.value)}
              />
              {isDuplicate && (
                <span className="absolute -top-3 right-0 text-xs text-amber-400">duplicate</span>
              )}
            </div>
            <input
              className="flex-2 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200
                         placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              value={val}
              placeholder="value"
              onChange={(e) => updateValue(id, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeEntry(id)}
              className="text-slate-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

