/**
 * Workflow JSON export and import utilities.
 */

/**
 * Export the current workflow as a downloadable JSON file.
 * @param {object[]} nodes
 * @param {object[]} edges
 * @param {string} [filename]
 */
export function exportWorkflow(nodes, edges, filename = 'workflow.json') {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    nodes,
    edges,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse an imported workflow JSON file.
 * @param {File} file
 * @returns {Promise<{nodes: object[], edges: object[]}>}
 */
export function importWorkflow(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.nodes || !parsed.edges) {
          reject(new Error('Invalid workflow file: missing nodes or edges.'));
          return;
        }
        resolve({ nodes: parsed.nodes, edges: parsed.edges });
      } catch {
        reject(new Error('Failed to parse workflow JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('File read error.'));
    reader.readAsText(file);
  });
}
