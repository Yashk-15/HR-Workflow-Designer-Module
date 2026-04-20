export function exportWorkflow(nodes, edges, filename = 'workflow.json') {
  const blob = new Blob(
    [JSON.stringify({ version: '1.0', exportedAt: new Date().toISOString(), nodes, edges }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWorkflow(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.nodes || !parsed.edges)
          return reject(new Error('Invalid workflow file: missing nodes or edges.'));
        resolve({ nodes: parsed.nodes, edges: parsed.edges });
      } catch {
        reject(new Error('Failed to parse workflow JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('File read error.'));
    reader.readAsText(file);
  });
}
