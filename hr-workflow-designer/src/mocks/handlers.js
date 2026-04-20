import { http, HttpResponse } from 'msw';

const AUTOMATIONS = [
  { id: 'send_email',    label: 'Send Email',        params: ['to', 'subject']           },
  { id: 'generate_doc',  label: 'Generate Document',  params: ['template', 'recipient']   },
  { id: 'create_ticket', label: 'Create HR Ticket',   params: ['type', 'priority']        },
  { id: 'notify_slack',  label: 'Notify via Slack',   params: ['channel', 'message']      },
];

function simulateWorkflow({ nodes = [], edges = [] }) {
  const adj = {}, inDeg = {};
  nodes.forEach((n) => { adj[n.id] = []; inDeg[n.id] = 0; });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (inDeg[e.target] !== undefined) inDeg[e.target]++;
  });

  const queue   = nodes.filter((n) => inDeg[n.id] === 0).map((n) => n.id);
  const order   = [];
  const visited = new Set();

  while (queue.length > 0) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    (adj[id] || []).forEach((next) => { inDeg[next]--; if (inDeg[next] === 0) queue.push(next); });
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const hasCycle = order.length < nodes.length;

  const steps = order.map((id, i) => {
    const node  = nodeMap[id];
    const d     = node?.data || {};
    const msgs  = {
      startNode:         `Workflow started: "${d.label || 'Start'}"`,
      taskNode:          `Task assigned to ${d.assignee || 'Unassigned'}: "${d.label}"`,
      approvalNode:      `Pending approval from ${d.approverRole || 'Manager'}`,
      automatedStepNode: `Executing action: ${d.actionId || 'none'}`,
      endNode:           `Workflow complete. ${d.endMessage || ''}`,
    };
    return {
      nodeId:    id,
      type:      node?.type,
      label:     d.label || node?.type || id,
      status:    'success',
      timestamp: new Date(Date.now() + (i + 1) * 400).toISOString(),
      message:   msgs[node?.type] || 'Processing…',
    };
  });

  if (hasCycle) {
    nodes.filter((n) => !visited.has(n.id)).forEach((n) =>
      steps.push({
        nodeId: n.id, type: n.type,
        label:  n.data?.label || n.type,
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Node skipped — cycle detected in workflow graph',
      })
    );
  }

  return {
    success:       !hasCycle,
    totalNodes:    nodes.length,
    executedNodes: visited.size,
    steps,
    summary: hasCycle
      ? '⚠ Workflow contains a cycle and could not fully execute.'
      : `✓ Workflow executed successfully across ${steps.length} step(s).`,
  };
}

export const handlers = [
  http.get('/api/automations', () => HttpResponse.json(AUTOMATIONS)),
  http.post('/api/simulate', async ({ request }) =>
    HttpResponse.json(simulateWorkflow(await request.json()))
  ),
];
