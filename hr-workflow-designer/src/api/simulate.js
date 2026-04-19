/**
 * Send the serialized workflow graph to the mock simulation API.
 * @param {{ nodes: object[], edges: object[] }} workflow
 * @returns {Promise<{ success: boolean, steps: object[], summary: string }>}
 */
export async function simulateWorkflow(workflow) {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workflow),
  });
  if (!res.ok) throw new Error('Simulation request failed');
  return res.json();
}
