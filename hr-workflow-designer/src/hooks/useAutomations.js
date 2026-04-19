import { useState, useEffect } from 'react';
import { getAutomations } from '@/api/automations';

/** Module-level cache — fetched once per session, shared across all form instances */
let _cache = null;

/**
 * Reusable hook for fetching the automations list.
 * Caches the result at module level so subsequent mounts get instant data.
 * @returns {{ automations: Array<{id:string, label:string, params:string[]}>, loading: boolean }}
 */
export function useAutomations() {
  const [automations, setAutomations] = useState(_cache || []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) return; // already fetched — use cache immediately
    getAutomations()
      .then((data) => {
        _cache = data;
        setAutomations(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { automations, loading };
}
