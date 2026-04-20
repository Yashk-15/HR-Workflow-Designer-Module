import { create } from 'zustand';
import { temporal } from 'zundo';
import { addEdge as rfAddEdge } from 'reactflow';

/**
 * Central workflow store.
 * Manages React Flow nodes, edges, and selected node state.
 * Wrapped with zundo `temporal` for undo/redo — only nodes+edges are tracked.
 */
const useWorkflowStore = create(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,

      // ── Node actions ────────────────────────────────────────────────────────
      setNodes: (nodes) => set({ nodes }),

      addNode: (node) =>
        set((state) => ({ nodes: [...state.nodes, node] })),

      updateNodeData: (nodeId, dataUpdates) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, ...dataUpdates } }
              : n
          ),
        })),

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          selectedNodeId:
            state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        })),

      // ── Edge actions ────────────────────────────────────────────────────────
      setEdges: (edges) => set({ edges }),

      addEdge: (connection) =>
        set((state) => ({
          edges: rfAddEdge(
            { ...connection, animated: true, style: { stroke: '#6366f1' } },
            state.edges
          ),
        })),

      removeEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),

      // ── Selection ───────────────────────────────────────────────────────────
      setSelectedNodeId: (id) => set({ selectedNodeId: id }),

      getSelectedNode: () => {
        const { nodes, selectedNodeId } = get();
        return nodes.find((n) => n.id === selectedNodeId) || null;
      },

      // ── Graph reset ─────────────────────────────────────────────────────────
      resetWorkflow: () => set({ nodes: [], edges: [], selectedNodeId: null }),

      // ── Import / export ─────────────────────────────────────────────────────
      importWorkflow: ({ nodes, edges }) => set({ nodes, edges, selectedNodeId: null }),
    }),
    {
      // Only track nodes + edges in history — selection is transient UI state
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      limit: 50,
    }
  )
);

export default useWorkflowStore;

