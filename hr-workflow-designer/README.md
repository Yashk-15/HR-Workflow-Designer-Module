# HR Workflow Designer

> **Tredence Case Study** — Visual HR workflow builder with React Flow, Next.js 16, and Tailwind CSS v4.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs) ![React Flow](https://img.shields.io/badge/React%20Flow-12-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8) ![MSW](https://img.shields.io/badge/MSW-mock%20API-orange)

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

No backend required. The mock API is served entirely in-browser via **MSW (Mock Service Worker)**.

---

## Features

| Feature | Details |
|---|---|
| **5 custom node types** | Start, Task, Approval, Automated Step, End |
| **Drag & drop** | Drag nodes from left sidebar onto the canvas |
| **Connect nodes** | Click and drag from any handle to connect |
| **Delete nodes/edges** | `Delete`/`Backspace` key or Trash button in form panel |
| **Node config forms** | Dynamic forms per node type with live preview |
| **Validation** | Real-time structural validation with per-node error badges |
| **Mock API** | `GET /api/automations` + `POST /api/simulate` via MSW |
| **Simulation sandbox** | Step-by-step execution log with timeline UI |
| **Export/Import JSON** | Download or restore workflow as `.json` |
| **Minimap + zoom** | Built-in React Flow controls |
| **Undo / Redo** | Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z) — 50-step history via `zundo` |

---

## Architecture

```
hr-workflow-designer/
├── app/                        # Next.js App Router
│   ├── layout.js               # Root layout (Inter font, dark theme)
│   ├── page.js                 # App shell — MSW bootstrap + WorkflowDesigner mount
│   └── globals.css             # Tailwind v4 import + custom theme tokens
├── src/
│   ├── api/                    # Fetch wrappers (easy to swap for real endpoints)
│   │   ├── automations.js      # GET /api/automations
│   │   └── simulate.js         # POST /api/simulate
│   ├── mocks/                  # MSW handlers & browser worker setup
│   │   ├── handlers.js         # Route handlers with topological simulation logic
│   │   └── browser.js          # MSW browser worker export
│   ├── store/                  # Zustand global state
│   │   ├── workflowStore.js    # nodes, edges, selection, import/export
│   │   └── simulationStore.js  # simulation status + execution log
│   ├── nodes/                  # Custom React Flow node components
│   │   ├── StartNode.jsx       # Green — source handle only
│   │   ├── TaskNode.jsx        # Blue — assignee + due date preview
│   │   ├── ApprovalNode.jsx    # Amber — approver role + threshold
│   │   ├── AutomatedStepNode.jsx # Purple — action label from API
│   │   ├── EndNode.jsx         # Rose — target handle only
│   │   └── index.js            # nodeTypes map + NODE_TYPE_META
│   ├── forms/                  # Node configuration forms
│   │   ├── NodeFormPanel.jsx   # Dispatcher by node.type
│   │   ├── StartNodeForm.jsx   # title + metadata (key-value)
│   │   ├── TaskNodeForm.jsx    # title* + desc + assignee + dueDate + customFields
│   │   ├── ApprovalNodeForm.jsx # title + approverRole select + threshold
│   │   ├── AutomatedStepNodeForm.jsx # title + action picker + dynamic params
│   │   └── EndNodeForm.jsx     # endMessage + summaryFlag toggle
│   ├── components/             # Shared UI components
│   │   ├── WorkflowDesigner.jsx # Main canvas (ReactFlowProvider + FlowCanvas)
│   │   ├── Sidebar.jsx         # Draggable node palette (5 cards)
│   │   ├── Toolbar.jsx         # Export/Import/Reset + validation badge + Test button
│   │   ├── SimulationPanel.jsx # Modal sandbox with step timeline
│   │   ├── ValidationBanner.jsx # Global error list banner
│   │   └── KeyValueEditor.jsx  # Reusable dynamic key-value editor
│   ├── hooks/
│   │   ├── useWorkflowValidation.js # useMemo-based structural validation
│   │   ├── useSimulation.js         # Serialize + call API + manage state
│   │   ├── useAutomations.js        # Fetches /api/automations with module-level cache
│   │   └── useHistory.js            # Undo/redo via zundo temporal + keyboard shortcuts
│   └── utils/
│       ├── graphUtils.js       # Cycle detection (DFS) + unreachable node check (BFS)
│       └── exportUtils.js      # Blob download + FileReader import
```

---

## Design Decisions

### 1. Zustand over Redux/Context
React Flow recommends avoiding Redux for node state. Zustand's flat, selector-based model plays perfectly with React Flow's callback pattern — no `useCallback` dependency hell.

### 2. MSW over JSON Server
MSW runs in-browser as a service worker with zero extra processes. The simulation mock includes a real topological sort so the `/simulate` response actually reflects graph structure.

### 3. NodeFormPanel as a Dispatcher
Rather than colocating forms inside node components (which bloats them), `NodeFormPanel` is a pure router — it reads `selectedNodeId` from the store, finds the node, and renders the correct form. Adding a new node type = add one entry to `FORM_MAP`. No changes elsewhere.

### 4. React Hook Form + Zustand
Each form uses `react-hook-form`'s `watch()` subscription to live-sync field changes to the store. The node on the canvas updates instantly without re-rendering the entire tree.

### 5. Validation as a Pure Hook
`useWorkflowValidation` is a `useMemo` over `[nodes, edges]`. It returns:
- `errors[]` — global error strings for `ValidationBanner`
- `nodeErrors{}` — per-node error arrays injected into each node's `data.errors` before rendering
- `isValid` — boolean for `Toolbar` badge

This means validation runs on every nodes/edges change with zero side effects.

### 6. Dynamic param fields in AutomatedStepNodeForm
When the user selects an action from the API list, the form reads `automation.params[]` and renders one text input per param — completely data-driven. Adding new action types in the mock (or future real API) automatically produces the correct form with zero code changes.

---

## Mock API Contract

### `GET /api/automations`
```json
[
  { "id": "send_email",    "label": "Send Email",        "params": ["to", "subject"] },
  { "id": "generate_doc",  "label": "Generate Document", "params": ["template", "recipient"] },
  { "id": "create_ticket", "label": "Create HR Ticket",  "params": ["type", "priority"] },
  { "id": "notify_slack",  "label": "Notify via Slack",  "params": ["channel", "message"] }
]
```

### `POST /api/simulate`
**Request body:** `{ nodes: ReactFlowNode[], edges: ReactFlowEdge[] }`

**Response:**
```json
{
  "success": true,
  "totalNodes": 5,
  "executedNodes": 5,
  "summary": "✓ Workflow executed successfully across 5 step(s).",
  "steps": [
    {
      "nodeId": "startNode_1",
      "type": "startNode",
      "label": "Start",
      "status": "success",
      "timestamp": "2025-01-01T00:00:00.400Z",
      "message": "Workflow started: \"Start\""
    }
  ]
}
```

---

## Validation Rules

| Rule | Description |
|---|---|
| One Start node | Exactly one `startNode` is required |
| One End node | At least one `endNode` is required |
| No cycles | DFS cycle detection across all edges |
| No islands | All nodes must be connected (BFS reachability check) |
| Required titles | Task, Approval, and AutoStep nodes must have a non-empty label |
| Action selected | AutoStep nodes must have an `actionId` selected |

---

## Assumptions

- No authentication or backend persistence required per spec.
- Workflow state is **in-memory only** (refreshing the page resets it — use Export JSON to persist).
- "Auto-approve threshold" is stored as a percentage (0–100) with no real business logic behind it in this prototype.
- The simulation result is deterministic and mock-only: it performs a real topological sort but does not evaluate node conditions or branching logic.
- MSW service worker requires a `public/mockServiceWorker.js` file (already included via `npx msw init`).

---

## Bonus Features Implemented

- ✅ **Export/Import JSON** — Full round-trip via Toolbar buttons
- ✅ **Minimap** — Color-coded per node type
- ✅ **Zoom controls** — React Flow built-in Controls panel
- ✅ **Validation errors on nodes** — Red alert badge per node when flagged
- ✅ **Delete keyboard shortcut** — `Delete` / `Backspace` keys
- ✅ **Undo / Redo** — `Ctrl+Z` / `Ctrl+Y` / `Ctrl+Shift+Z`, 50-step history, toolbar buttons

