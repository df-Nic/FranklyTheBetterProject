import { ArrowLeft } from 'lucide-react';

export default function SimulationHeader({ onBack }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1A22]"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">NEST · Agent Owl</span>
      </div>
      <h1 className="text-[26px] font-bold leading-tight text-gray-900">Generating your plan</h1>
    </div>
  );
}
