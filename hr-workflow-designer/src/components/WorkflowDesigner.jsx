'use client';
import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useWorkflowStore from '@/store/workflowStore';
import { nodeTypes } from '@/nodes/index';
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import ValidationBanner from './ValidationBanner';
import SimulationPanel from './SimulationPanel';
import NodeFormPanel from '@/forms/NodeFormPanel';

let nodeIdCounter = 1;
const generateId = (type) => `${type}_${Date.now()}_${nodeIdCounter++}`;

function FlowCanvas() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [showSim, setShowSim] = useState(false);

  const nodes            = useWorkflowStore((s) => s.nodes);
  const edges            = useWorkflowStore((s) => s.edges);
  const setNodes         = useWorkflowStore((s) => s.setNodes);
  const setEdges         = useWorkflowStore((s) => s.setEdges);
  const addNode          = useWorkflowStore((s) => s.addNode);
  const addEdge          = useWorkflowStore((s) => s.addEdge);
  const removeNode       = useWorkflowStore((s) => s.removeNode);
  const removeEdge       = useWorkflowStore((s) => s.removeEdge);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const selectedNodeId   = useWorkflowStore((s) => s.selectedNodeId);
  const { nodeErrors }   = useWorkflowValidation();

  // Inject per-node errors into node data so nodes can show badges
  const nodesWithErrors = nodes.map((n) => ({
    ...n,
    data: { ...n.data, errors: nodeErrors[n.id] || [] },
  }));

  // ── Drag & drop from sidebar ──────────────────────────────────────────────
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow-type');
      const rawData = e.dataTransfer.getData('application/reactflow-data');
      if (!type) return;

      const data = rawData ? JSON.parse(rawData) : { label: type };
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      addNode({
        id: generateId(type),
        type,
        position,
        data,
      });
    },
    [screenToFlowPosition, addNode]
  );

  // ── Node selection ────────────────────────────────────────────────────────
  const onNodeClick = useCallback(
    (_, node) => setSelectedNodeId(node.id),
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(
    () => setSelectedNodeId(null),
    [setSelectedNodeId]
  );

  // ── Edge connection ───────────────────────────────────────────────────────
  const onConnect = useCallback(
    (connection) => addEdge(connection),
    [addEdge]
  );

  // ── Delete callbacks ──────────────────────────────────────────────────────
  const onNodesDelete = useCallback(
    (deleted) => deleted.forEach((n) => removeNode(n.id)),
    [removeNode]
  );

  const onEdgesDelete = useCallback(
    (deleted) => deleted.forEach((e) => removeEdge(e.id)),
    [removeEdge]
  );

  // ── Node / edge change handlers (position drag, etc.) ────────────────────
  const onNodesChange = useCallback(
    (changes) => {
      setNodes(
        changes.reduce((acc, change) => {
          if (change.type === 'position' && change.dragging !== undefined) {
            return acc.map((n) =>
              n.id === change.id
                ? { ...n, position: change.position ?? n.position }
                : n
            );
          }
          if (change.type === 'remove') {
            return acc.filter((n) => n.id !== change.id);
          }
          return acc;
        }, nodes)
      );
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges(
        changes.reduce((acc, change) => {
          if (change.type === 'remove') {
            return acc.filter((e) => e.id !== change.id);
          }
          return acc;
        }, edges)
      );
    },
    [edges, setEdges]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — node palette */}
        <Sidebar />

        {/* Center — React Flow canvas */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 relative bg-slate-950"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodesWithErrors}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            deleteKeyCode={['Delete', 'Backspace']}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 2 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="#1e293b"
            />
            <Controls
              className="!bg-slate-900 !border-slate-700 [&>button]:!bg-slate-900 [&>button]:!border-slate-700
                         [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-800"
            />
            <MiniMap
              className="!bg-slate-900 !border-slate-700"
              nodeColor={(n) => {
                const map = {
                  startNode: '#10b981',
                  taskNode: '#3b82f6',
                  approvalNode: '#f59e0b',
                  automatedStepNode: '#a855f7',
                  endNode: '#f43f5e',
                };
                return map[n.type] || '#64748b';
              }}
              maskColor="rgba(0,0,0,0.6)"
            />

            {/* Empty state */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-5xl mb-4 opacity-30">🗂️</div>
                  <p className="text-slate-600 text-sm">Drag nodes from the left panel to start building</p>
                </div>
              </div>
            )}
          </ReactFlow>
        </div>

        {/* Right — Node config panel */}
        <div className="w-64 shrink-0 bg-slate-950/80 border-l border-slate-800 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800 shrink-0">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Node Config</h2>
          </div>
          <div className="flex-1 min-h-0">
            <NodeFormPanel />
          </div>
        </div>
      </div>

      {/* Bottom validation banner + toolbar */}
      <div className="shrink-0">
        <ValidationBanner />
        <Toolbar onTestClick={() => setShowSim(true)} />
      </div>

      {/* Simulation modal */}
      {showSim && <SimulationPanel onClose={() => setShowSim(false)} />}
    </div>
  );
}

/** Wrapper that provides ReactFlowProvider context */
export default function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
