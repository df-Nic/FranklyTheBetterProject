import { ArrowLeft, FastForward } from 'lucide-react';

export default function SimulationHeader({ onBack, onSkip }) {
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
        <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">NEST · Agent Owl</span>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center gap-1 rounded-full border border-[#D9CEC5] bg-white px-3 py-2 text-[9px] font-bold text-[#7C2230] shadow-sm transition-colors hover:bg-[#FFF8F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1A22]"
          aria-label="Skip simulation for demo"
        >
          <FastForward size={12} />
          Skip simulation
        </button>
      </div>
      <h1 className="text-[26px] font-bold leading-tight text-gray-900">Generating your plan</h1>
    </div>
  );
}
