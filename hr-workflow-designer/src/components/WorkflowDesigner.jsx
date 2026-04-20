'use client';
import { useCallback, useRef, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useWorkflowStore from '@/store/workflowStore';
import { nodeTypes } from '@/nodes/index';
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation';
import { useHistory } from '@/hooks/useHistory';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import ValidationBanner from './ValidationBanner';
import SimulationPanel from './SimulationPanel';
import NodeFormPanel from '@/forms/NodeFormPanel';

let _idCounter = 1;
const genId = (type) => `${type}_${Date.now()}_${_idCounter++}`;

function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow();
  const [showSim, setShowSim] = useState(false);
  useHistory({ enableKeyboard: true });

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);
  const addNode = useWorkflowStore((s) => s.addNode);
  const addEdge = useWorkflowStore((s) => s.addEdge);
  const removeNode = useWorkflowStore((s) => s.removeNode);
  const removeEdge = useWorkflowStore((s) => s.removeEdge);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const { nodeErrors } = useWorkflowValidation();

  const nodesWithErrors = useMemo(
    () => nodes.map((n) => ({ ...n, data: { ...n.data, errors: nodeErrors[n.id] || [] } })),
    [nodes, nodeErrors]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow-type');
    if (!type) return;
    const raw = e.dataTransfer.getData('application/reactflow-data');
    addNode({
      id: genId(type),
      type,
      position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
      data: raw ? JSON.parse(raw) : { label: type },
    });
  }, [screenToFlowPosition, addNode]);

  const onNodeClick = useCallback((_, n) => setSelectedNodeId(n.id), [setSelectedNodeId]);
  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);
  const onConnect = useCallback((c) => addEdge(c), [addEdge]);
  const onNodesDelete = useCallback((del) => del.forEach((n) => removeNode(n.id)), [removeNode]);
  const onEdgesDelete = useCallback((del) => del.forEach((e) => removeEdge(e.id)), [removeEdge]);
  const onNodesChange = useCallback((c) => setNodes(applyNodeChanges(c, nodes)), [nodes, setNodes]);
  const onEdgesChange = useCallback((c) => setEdges(applyEdgeChanges(c, edges)), [edges, setEdges]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 relative bg-slate-950" onDragOver={onDragOver} onDrop={onDrop}>
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
            defaultEdgeOptions={{ animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
            <Controls className="bg-slate-900! border-slate-700! [&>button]:bg-slate-900! [&>button]:border-slate-700! [&>button]:text-slate-400!" />
            <MiniMap
              className="bg-slate-900! border-slate-700!"
              nodeColor={(n) => ({ startNode: '#10b981', taskNode: '#3b82f6', approvalNode: '#f59e0b', automatedStepNode: '#a855f7', endNode: '#f43f5e' })[n.type] || '#64748b'}
              maskColor="rgba(0,0,0,0.6)"
            />
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
        <div className="w-64 shrink-0 bg-slate-950/80 border-l border-slate-800 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800 shrink-0">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Node Config</h2>
          </div>
          <div className="flex-1 min-h-0">
            <NodeFormPanel />
          </div>
        </div>
      </div>
      <div className="shrink-0">
        <ValidationBanner />
        <Toolbar onTestClick={() => setShowSim(true)} />
      </div>
      {showSim && <SimulationPanel onClose={() => setShowSim(false)} />}
    </div>
  );
}

export default function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
