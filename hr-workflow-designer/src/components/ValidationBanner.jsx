'use client';
import { AlertTriangle, X } from 'lucide-react';
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation';

export default function ValidationBanner() {
  const { errors, isValid } = useWorkflowValidation();

  if (isValid || errors.length === 0) return null;

  return (
    <div className="mx-4 mb-2 rounded-xl border border-amber-700/40 bg-amber-950/30 px-4 py-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-300 mb-1">Validation Issues</p>
          <ul className="space-y-0.5">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-amber-400/80">{err}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
