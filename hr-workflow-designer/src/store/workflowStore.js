import { create } from 'zustand';
import { temporal } from 'zundo';
import { addEdge as rfAddEdge } from 'reactflow';

/** Workflow graph + selection state. Wrapped with zundo temporal for undo/redo. */
const useWorkflowStore = create(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,

      setNodes: (nodes) => set({ nodes }),
      addNode:  (node) => set((s) => ({ nodes: [...s.nodes, node] })),

      updateNodeData: (nodeId, patch) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
          ),
        })),

      removeNode: (nodeId) =>
        set((s) => ({
          nodes: s.nodes.filter((n) => n.id !== nodeId),
          edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          selectedNodeId: s.selectedNodeId === nodeId ? null : s.selectedNodeId,
        })),

      setEdges: (edges) => set({ edges }),
      addEdge: (connection) =>
        set((s) => ({
          edges: rfAddEdge(
            { ...connection, animated: true, style: { stroke: '#6366f1' } },
            s.edges
          ),
        })),
      removeEdge: (edgeId) =>
        set((s) => ({ edges: s.edges.filter((e) => e.id !== edgeId) })),

      setSelectedNodeId: (id) => set({ selectedNodeId: id }),
      getSelectedNode: () => {
        const { nodes, selectedNodeId } = get();
        return nodes.find((n) => n.id === selectedNodeId) ?? null;
      },

      resetWorkflow:  () => set({ nodes: [], edges: [], selectedNodeId: null }),
      importWorkflow: ({ nodes, edges }) => set({ nodes, edges, selectedNodeId: null }),
    }),
    {
      partialize: (s) => ({ nodes: s.nodes, edges: s.edges }),
      limit: 50,
    }
  )
);

export default useWorkflowStore;
