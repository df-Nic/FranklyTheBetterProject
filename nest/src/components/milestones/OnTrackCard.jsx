// src/components/milestones/OnTrackCard.jsx
import { CheckCircle2, TrendingUp, Info, ArrowUpRight } from "lucide-react";
import { formatSGD } from "../../data/milestonePlans";

export default function OnTrackCard({ onTrack, statusLabel }) {
  return (
    <div className="absolute left-[4%] top-[3%] z-30 w-[43%] rounded-2xl bg-white/[0.94] p-3 shadow-[0_6px_18px_rgba(0,0,0,0.12)] backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide text-[#2E7D4F]">
        <CheckCircle2 size={16} strokeWidth={2.4} />
        {statusLabel}
      </div>
      <div className="mt-2 text-[10px] leading-snug text-[#5E554F]">
        {formatSGD(onTrack.saved)} saved of {formatSGD(onTrack.expected)} expected
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#E7F1E9] px-2 py-1.5 text-[10.5px] font-bold text-[#2E7D4F]">
        <TrendingUp size={14} strokeWidth={2.5} />
        {onTrack.deltaLabel}
      </div>
    </div>
  );
}

export function OnTrackDetails({ message }) {
  return (
    <div className="rounded-[18px] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex gap-2 text-[12px] leading-relaxed text-[#5E554F]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#8A7F78]" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export function MilestoneReflection({ reflection }) {
  return (
    <div className="rounded-[18px] border border-[#E7D9CC] bg-[#FFF9F2] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7F1E9] text-[#2E7D4F]">
          <CheckCircle2 size={18} strokeWidth={2.4} />
        </span>
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A7F78]">Your progress</div>
          <p className="mt-1 text-[13px] font-semibold leading-relaxed text-[#3F3732]">{reflection.achieved}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-bold text-[#7C2230]">
            <ArrowUpRight size={15} />
            {reflection.lookingAhead}
          </div>
        </div>
      </div>
    </div>
  );
}
