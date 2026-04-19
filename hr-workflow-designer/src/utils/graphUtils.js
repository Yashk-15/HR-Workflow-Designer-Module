/**
 * Graph utility functions for workflow validation and traversal.
 */

/**
 * Detect cycles in a directed graph using DFS.
 * @param {string[]} nodeIds
 * @param {Array<{source: string, target: string}>} edges
 * @returns {boolean} true if cycle found
 */
export function hasCycle(nodeIds, edges) {
  const adj = {};
  nodeIds.forEach((id) => { adj[id] = []; });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
  });

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  nodeIds.forEach((id) => { color[id] = WHITE; });

  function dfs(u) {
    color[u] = GRAY;
    for (const v of adj[u] || []) {
      if (color[v] === GRAY) return true;
      if (color[v] === WHITE && dfs(v)) return true;
    }
    color[u] = BLACK;
    return false;
  }

  return nodeIds.some((id) => color[id] === WHITE && dfs(id));
}

/**
 * Find nodes with no incoming edges (candidates for Start position).
 * @param {string[]} nodeIds
 * @param {Array<{source: string, target: string}>} edges
 * @returns {string[]}
 */
export function findRoots(nodeIds, edges) {
  const hasIncoming = new Set(edges.map((e) => e.target));
  return nodeIds.filter((id) => !hasIncoming.has(id));
}

/**
 * Find nodes with no outgoing edges (candidates for End position).
 * @param {string[]} nodeIds
 * @param {Array<{source: string, target: string}>} edges
 * @returns {string[]}
 */
export function findLeaves(nodeIds, edges) {
  const hasOutgoing = new Set(edges.map((e) => e.source));
  return nodeIds.filter((id) => !hasOutgoing.has(id));
}

/**
 * Check if all nodes are reachable (graph is connected).
 * Returns node IDs that are unreachable.
 * @param {string[]} nodeIds
 * @param {Array<{source: string, target: string}>} edges
 * @returns {string[]} unreachable node IDs
 */
export function findUnreachableNodes(nodeIds, edges) {
  if (nodeIds.length === 0) return [];
  const adj = {};
  nodeIds.forEach((id) => { adj[id] = []; });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (adj[e.target]) adj[e.target].push(e.source); // undirected check
  });

  // BFS from first node
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
