# HR Workflow Designer

> Tredence Case Study — A visual drag-and-drop HR workflow builder.

---

## How to Run

```bash
cd hr-workflow-designer
npm install
npm run dev
# → http://localhost:3000
```

No backend needed. API calls are intercepted in-browser by **MSW (Mock Service Worker)**.

---

## Architecture

```
hr-workflow-designer/
├── app/
│   ├── layout.js               # Root layout (Inter font)
│   ├── page.js                 # App shell + MSW bootstrap gate
│   └── globals.css             # Tailwind v4 + React Flow overrides
├── src/
│   ├── store/
│   │   ├── workflowStore.js    # Zustand store wrapped with zundo (undo/redo)
│   │   └── simulationStore.js  # Simulation run status + result
│   ├── nodes/                  # 5 custom React Flow node components
│   │   └── index.js            # nodeTypes map + NODE_TYPE_META
│   ├── forms/                  # Per-node config forms (react-hook-form)
│   │   └── NodeFormPanel.jsx   # Dispatcher — reads selectedNodeId, renders right form
│   ├── components/
│   │   ├── WorkflowDesigner.jsx  # ReactFlowProvider + canvas + layout
│   │   ├── Sidebar.jsx           # Icon sidebar + draggable node palette
│   │   ├── Toolbar.jsx           # Export / Import / Reset / Undo / Redo
│   │   ├── ValidationBanner.jsx  # Global error list above toolbar
│   │   ├── SimulationPanel.jsx   # Modal sandbox with step timeline
│   │   └── KeyValueEditor.jsx    # Reusable key-value field editor
│   ├── hooks/
│   │   ├── useWorkflowValidation.js  # Graph validation (cycle, connectivity, required fields)
│   │   ├── useSimulation.js          # Calls POST /api/simulate
│   │   ├── useAutomations.js         # Fetches GET /api/automations (module-level cache)
│   │   └── useHistory.js             # Undo/redo via zundo + keyboard shortcuts
│   ├── utils/
│   │   ├── graphUtils.js       # DFS cycle detection + BFS reachability
│   │   └── exportUtils.js      # JSON download + FileReader import
│   ├── api/
│   │   ├── automations.js      # fetch wrapper for GET /api/automations
│   │   └── simulate.js         # fetch wrapper for POST /api/simulate
│   └── mocks/
│       ├── handlers.js         # MSW route handlers + topological simulation logic
│       └── browser.js          # MSW browser worker setup
```

---

## Design Decisions

**Zustand over Context/Redux**  
React Flow recommends keeping node state flat and close to the canvas. Zustand's selector-based model avoids unnecessary re-renders without boilerplate.

**zundo for Undo/Redo**  
Wrapped the Zustand store with `temporal` middleware. Used `partialize` to track only `nodes` and `edges` — UI-only state (selection, form state) doesn't pollute the history stack. Limit set to 50 steps.

**MSW over JSON Server**  
Runs entirely in-browser as a Service Worker with zero extra processes. The `/api/simulate` handler performs a real topological sort so the response actually reflects the graph structure.

**NodeFormPanel as a Dispatcher**  
Forms are completely decoupled from node components. `NodeFormPanel` reads `selectedNodeId`, looks up a `FORM_MAP`, and renders the correct form. Adding a new node type = add one entry to the map.

**react-hook-form with live Zustand sync**  
Each form uses `watch()` to subscribe to field changes and writes to the store on every keystroke. The node on canvas updates in real-time without re-rendering the whole tree.

**Validation as a pure hook**  
`useWorkflowValidation` is a `useMemo` over `[nodes, edges]`. Returns `errors[]`, `nodeErrors{}` (per-node), and `isValid`. Zero side effects — runs synchronously on every graph change.

**MSW initialization gate**  
`page.js` awaits `worker.start()` before mounting the React tree, preventing a race condition where `AutomatedStepNodeForm` mounts and fetches `/api/automations` before the service worker is registered.

---

## What I Completed

- **Canvas** — Drag-and-drop workflow builder with React Flow; connect, move, and delete nodes and edges
- **5 Node types** — Start, Task, Approval, Automated Step, End; each with a distinct config form
- **Node config forms** — Per-type forms with live canvas preview (react-hook-form + Zustand sync)
- **Validation engine** — Cycle detection (DFS), connectivity check (BFS), required field checks; per-node error badges + global banner
- **Mock API** — `GET /api/automations` returns 4 automation types; `POST /api/simulate` runs a topological sort and returns a step-by-step execution log
- **Simulation sandbox** — Modal panel showing execution timeline with status per node
- **Undo / Redo** — 50-step history via zundo; `Ctrl+Z` / `Ctrl+Y` / `Ctrl+Shift+Z`; Toolbar buttons
- **Export / Import** — Download workflow as JSON; re-import to restore state
- **UI design** — Dark icon sidebar, floating badge nodes, cool-gray canvas with dot grid

## What I Would Add With More Time

- **Edge labels** — "Approved / Rejected / Cancelled" branches on Approval nodes to support conditional routing
- **Local storage persistence** — Auto-save workflow state so refreshing the page doesn't reset progress
- **Conditional node type** — A branching node with configurable rules (visible in the reference screenshot)
- **Real backend** — Replace MSW with actual Next.js API routes backed by a database (PostgreSQL + Prisma)
- **Role-based access** — Lock certain node types or workflow actions behind user roles
- **Simulation animation** — Highlight the active node and edge during simulation playback with step delays
- **Unit tests** — Jest tests for `graphUtils.js` (cycle detection, reachability) and the Zustand store actions
- **Keyboard navigation** — Full keyboard support for selecting and configuring nodes without a mouse
