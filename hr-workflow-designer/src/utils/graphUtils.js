/** DFS cycle detection for directed graph. */
export function hasCycle(nodeIds, edges) {
  const adj = {};
  nodeIds.forEach((id) => { adj[id] = []; });
  edges.forEach((e) => { if (adj[e.source]) adj[e.source].push(e.target); });

  const color = {};
  nodeIds.forEach((id) => { color[id] = 0; });

  function dfs(u) {
    color[u] = 1;
    for (const v of adj[u] || []) {
      if (color[v] === 1) return true;
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  }

  return nodeIds.some((id) => color[id] === 0 && dfs(id));
}

/** BFS connectivity check — returns node IDs not reachable from any other node. */
export function findUnreachableNodes(nodeIds, edges) {
  if (nodeIds.length === 0) return [];
  const adj = {};
  nodeIds.forEach((id) => { adj[id] = []; });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (adj[e.target]) adj[e.target].push(e.source);
  });

  const visited = new Set();
  const queue = [nodeIds[0]];
  while (queue.length > 0) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    (adj[id] || []).forEach((nb) => queue.push(nb));
  }
  return nodeIds.filter((id) => !visited.has(id));
}
