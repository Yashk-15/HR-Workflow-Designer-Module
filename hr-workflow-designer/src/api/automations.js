/**
 * Fetch available automated actions from the mock API.
 * @returns {Promise<Array<{id: string, label: string, params: string[]}>>}
 */
export async function getAutomations() {
  const res = await fetch('/api/automations');
  if (!res.ok) throw new Error('Failed to fetch automations');
  return res.json();
}
