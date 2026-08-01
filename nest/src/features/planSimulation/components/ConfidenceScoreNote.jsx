import { Info } from 'lucide-react';

export default function ConfidenceScoreNote() {
  return (
    <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-[#F8F4EF] px-2.5 py-2 text-[#756A63]">
      <Info size={12} className="mt-0.5 shrink-0 text-[#8B1A22]" />
      <p className="text-[9px] leading-relaxed">
        Confidence scores compare safety, return and timeline resilience. They are simulated comparisons, not guaranteed outcomes.
      </p>
    </div>
  );
}
