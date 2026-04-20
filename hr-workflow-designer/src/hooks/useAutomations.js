import { useState, useEffect } from 'react';
import { getAutomations } from '@/api/automations';

/** Module-level cache — fetched once per session across all form instances. */
let _cache = null;

export function useAutomations() {
  const [automations, setAutomations] = useState(_cache || []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) return;
    getAutomations()
      .then((data) => { _cache = data; setAutomations(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { automations, loading };
}
