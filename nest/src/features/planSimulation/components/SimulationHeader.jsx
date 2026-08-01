import { ArrowLeft } from 'lucide-react';

export default function SimulationHeader({ onBack, onSkip, isComplete }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1A22]"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-[11px] font-medium text-gray-400 tracking-wider uppercase">NEST · Agent Owl</span>
        </div>
        {!isComplete && (
          <button
            type="button"
            onClick={onSkip}
            className="text-[12px] text-[#8B1A22] font-medium underline-offset-2 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1A22]"
          >
            Skip to plan →
          </button>
        )}
      </div>
      <h1 className="text-[26px] font-bold text-gray-900 leading-tight">Generating your plan</h1>
      <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#8B1A22] animate-pulse motion-reduce:animate-none" />
        <span className="text-[12px] text-gray-600">Live multiverse simulation</span>
      </div>
    </div>
  );
}
