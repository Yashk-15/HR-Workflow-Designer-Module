'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// WorkflowDesigner must be loaded client-only (React Flow requires window)
const WorkflowDesigner = dynamic(
  () => import('@/components/WorkflowDesigner'),
  { ssr: false }
);

async function startMSW() {
  if (typeof window === 'undefined') return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

export default function HomePage() {
  useEffect(() => {
    startMSW();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top nav */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3
                         bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-900/50">
            ⚙
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none">HR Workflow Designer</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Tredence Case Study</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2 py-1 bg-slate-800 rounded-full border border-slate-700">Next.js 15</span>
          <span className="px-2 py-1 bg-slate-800 rounded-full border border-slate-700">React Flow</span>
          <span className="px-2 py-1 bg-slate-800 rounded-full border border-slate-700">Tailwind v4</span>
        </div>
      </header>

      {/* Main canvas area */}
      <main className="flex-1 min-h-0">
        <WorkflowDesigner />
      </main>
    </div>
  );
}
