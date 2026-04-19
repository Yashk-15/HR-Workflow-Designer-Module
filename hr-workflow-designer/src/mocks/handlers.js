import { http, HttpResponse } from 'msw';

const AUTOMATIONS = [
  { id: 'send_email',    label: 'Send Email',         params: ['to', 'subject'] },
  { id: 'generate_doc',  label: 'Generate Document',  params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create HR Ticket',   params: ['type', 'priority'] },
  { id: 'notify_slack',  label: 'Notify via Slack',   params: ['channel', 'message'] },
];

/**
 * Perform a simple topological walk of the workflow graph and return
 * a step-by-step execution log.
 */
function simulateWorkflow(workflow) {
  const { nodes = [], edges = [] } = workflow;

  // Build adjacency list
  const adj = {};
  const inDegree = {};
  nodes.forEach((n) => { adj[n.id] = []; inDegree[n.id] = 0; });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (inDegree[e.target] !== undefined) inDegree[e.target]++;
  });

  // Kahn's algorithm for topological sort
  const queue = nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);
  const order = [];
  const visited = new Set();

  while (queue.length > 0) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    (adj[id] || []).forEach((next) => {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    });
  }

  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

  // If not all nodes visited → cycle detected
  const hasCycle = order.length < nodes.length;

  const steps = order.map((id, i) => {
    const node = nodeMap[id];
    const label = node?.data?.label || node?.type || id;
    const delay = (i + 1) * 400; // simulate async delay in ms
    const status = hasCycle ? 'skipped' : 'success';
    return {
      nodeId: id,
      type: node?.type,
      label,
      status,
      timestamp: new Date(Date.now() + delay).toISOString(),
      message: getStepMessage(node),
    };
  });

  // Add skipped nodes if cycle
  if (hasCycle) {
    nodes
      .filter((n) => !visited.has(n.id))
      .forEach((n) => {
        steps.push({
          nodeId: n.id,
          type: n.type,
          label: n.data?.label || n.type,
          status: 'error',
          timestamp: new Date().toISOString(),
          message: 'Node skipped due to cycle in workflow graph',
        });
      });
  }

  return {
    success: !hasCycle,
    totalNodes: nodes.length,
    executedNodes: visited.size,
    steps,
    summary: hasCycle
      ? '⚠ Workflow contains a cycle and could not fully execute.'
      : `✓ Workflow executed successfully across ${steps.length} step(s).`,
  };
}

function getStepMessage(node) {
  if (!node) return 'Processing…';
  const d = node.data || {};
  switch (node.type) {
    case 'startNode':  return `Workflow started: "${d.label || 'Start'}"`;
    case 'taskNode':   return `Task assigned to ${d.assignee || 'Unassigned'}: "${d.label}"`;
    case 'approvalNode': return `Pending approval from ${d.approverRole || 'Manager'}`;
    case 'automatedStepNode': return `Executing action: ${d.actionId || 'none'}`;
    case 'endNode':    return `Workflow complete. ${d.endMessage || ''}`;
    default:           return 'Processing step…';
  }
}

export const handlers = [
  http.get('/api/automations', () => {
    return HttpResponse.json(AUTOMATIONS);
  }),

  http.post('/api/simulate', async ({ request }) => {
    const body = await request.json();
    const result = simulateWorkflow(body);
    return HttpResponse.json(result);
  }),
];
