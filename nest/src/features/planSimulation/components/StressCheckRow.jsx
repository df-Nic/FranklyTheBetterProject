import { Shield } from 'lucide-react';

export default function StressCheckRow({ stress, completed = false }) {
  return (
    <div className="mt-3 flex items-center gap-2.5 border-t border-gray-100 pt-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
        <Shield size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10.5px] font-semibold text-gray-800 leading-tight">System Stress Check</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#1F7A4D]" />
          <span className="text-[9.5px] leading-snug text-gray-500">
            {completed ? 'Emergency-buffer resilience passed' : stress.label}
          </span>
        </div>
      </div>
      {stress.result === 'OK' && (
        <span className="text-[10px] font-semibold text-[#1F7A4D] border border-[#1F7A4D] rounded px-1.5 py-0.5 shrink-0">OK</span>
      )}
    </div>
  );
}
