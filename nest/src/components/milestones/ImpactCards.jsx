// src/components/milestones/ImpactCards.jsx
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getOpportunityStatus } from "../../data/planOpportunities";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export function AgentOwlImpactCard({ latestActivity, eventCount, onSeeBreakdown }) {
  return (
    <motion.div {...fadeUp} className="rounded-[16px] border border-[#E4D8CE] bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        onClick={onSeeBreakdown}
        disabled={!onSeeBreakdown}
        className="flex w-full items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-45"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7F1E9]">
          <ShieldCheck size={17} className="text-[#2E7D4F]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-[#8A7F78]">Agent Owl history</span>
          <span className="mt-0.5 block text-[12.5px] font-extrabold text-[#2B2320]">
            {latestActivity?.title || "Your plan history is ready"}
          </span>
          <span className="mt-0.5 block text-[9.5px] text-[#8A7F78]">
            View {eventCount} {eventCount === 1 ? "activity" : "activities"} and savings details
          </span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-[#C88A2E]" strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

export function OpportunityCard({ opportunity, decision, onExplore }) {
  const status = getOpportunityStatus(opportunity, decision);
  if (!opportunity || status !== "active") return null;

  return (
    <motion.button
      {...fadeUp}
      onClick={onExplore}
      className="relative mt-3 flex w-full items-center gap-3 overflow-hidden rounded-[16px] border border-[#E7C98F] bg-[linear-gradient(145deg,#FFF9EC_0%,#FFF4D8_100%)] p-3 text-left shadow-[0_6px_18px_rgba(139,93,32,0.11)] active:scale-[0.99]"
    >
      <Sparkles className="absolute -right-3 -top-3 h-16 w-16 text-[#C88A2E]/10" />
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C2230] text-white">
        <Sparkles size={16} />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="inline-flex rounded-full bg-[#7C2230] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-white">
          NEST Signal
        </span>
        <span className="mt-1 block text-[11.5px] font-extrabold leading-snug text-[#2B2320]">{opportunity.title}</span>
        <span className="mt-0.5 block text-[9.5px] font-bold text-[#9A641E]">{opportunity.benefitLabel}</span>
      </span>
      <ChevronRight size={16} className="relative shrink-0 text-[#9A641E]" />
    </motion.button>
  );
}
