// src/components/milestones/ImpactCards.jsx
import { motion } from "framer-motion";
import {
  Info,
  ShieldCheck,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { formatSGD } from "../../data/milestonePlans";
import { getOpportunityStatus } from "../../data/planOpportunities";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export function AgentOwlImpactCard({ impact, onSeeBreakdown }) {
  return (
    <motion.div {...fadeUp} className="rounded-[18px] bg-white p-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-1.5 text-base font-extrabold text-[#2B2320]">
        What Agent Owl has helped with
        <Info size={15} className="text-[#B7ACA2]" />
      </div>

      <div className="mt-4 flex justify-between gap-2">
        <Stat
          icon={<ShieldCheck size={20} className="text-[#2E7D4F]" />}
          iconBg="#E7F1E9"
          label="Additional savings"
          value={formatSGD(impact.additionalSavings)}
          valueColor="#2E7D4F"
          sub="From rate and fee improvements"
        />
        <Stat
          icon={<Clock size={20} className="text-[#C88A2E]" />}
          iconBg="#FBEFD9"
          label="Time saved"
          value={impact.timeSaved}
          sub="From automated plan checks"
        />
        <Stat
          icon={<Star size={20} className="text-[#7E5BB5]" />}
          iconBg="#EFEAF7"
          label="Opportunities acted on"
          value={String(impact.opportunitiesActedOn)}
          sub="Improvements you accepted"
        />
      </div>

      <div className="mt-4 h-px bg-[#F0EAE3]" />

      <button
        onClick={onSeeBreakdown}
        disabled={!onSeeBreakdown}
        className="flex w-full items-center justify-between pt-3.5 text-[13.5px] font-bold text-[#C88A2E] disabled:cursor-not-allowed disabled:opacity-45"
      >
        See savings breakdown
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

function Stat({ icon, iconBg, label, value, valueColor, sub }) {
  return (
    <div className="flex-1">
      <div
        className="mb-2 flex h-[38px] w-[38px] items-center justify-center rounded-full"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="text-[10.5px] font-semibold text-[#8A7F78]">{label}</div>
      <div className="my-0.5 text-[19px] font-extrabold" style={{ color: valueColor || "#2B2320" }}>
        {value}
      </div>
      <div className="text-[9.5px] leading-tight text-[#8A7F78]">{sub}</div>
    </div>
  );
}

export function OpportunityCard({ opportunity, decision, onExplore }) {
  const status = getOpportunityStatus(opportunity, decision);
  if (!opportunity || status === "declined" || status === "expired" || status === "superseded" || status === "unavailable") {
    return (
      <motion.div {...fadeUp} className="rounded-[18px] border border-[#E4D8CE] bg-white p-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F1E9]">
            <ShieldCheck size={20} className="text-[#2E7D4F]" />
          </span>
          <div>
            <div className="text-[13px] font-extrabold text-[#2B2320]">Your plan remains a strong fit</div>
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#756A63]">
              Agent Owl will continue monitoring for ways to improve it.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const accepted = decision?.status === "accepted";
  return (
    <motion.div {...fadeUp} className="relative overflow-hidden rounded-[20px] border border-[#E7C98F] bg-[linear-gradient(145deg,#FFF9EC_0%,#FFF4D8_100%)] p-[18px] shadow-[0_8px_22px_rgba(139,93,32,0.10)]">
      <Sparkles className="absolute -right-4 -top-4 h-20 w-20 text-[#C88A2E]/10" />
      <div className="relative">
        <div className="inline-flex rounded-full bg-[#7C2230] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
          {accepted ? "Opportunity accepted" : "Opportunity starts now"}
        </div>
        <div className="mt-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#C88A2E] shadow-sm">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-extrabold leading-snug text-[#2B2320]">{opportunity.title}</h2>
            <div className="mt-1 text-[11px] font-extrabold text-[#9A641E]">{opportunity.benefitLabel}</div>
          </div>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-[#6D625B]">
          {accepted
            ? `Accepted on ${decision.decidedAt}. Your original plan was already sound; this enhancement has now been applied.`
            : `${opportunity.summary} Your current plan still works—this is an optional improvement.`}
        </p>
        <div className="mt-3 text-[9.5px] font-bold text-[#8A7F78]">
          {accepted ? "Review the applied change" : `Identified ${opportunity.detectedDate}`}
        </div>
        <button
          onClick={onExplore}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#C88A2E] px-4 py-2.5 text-[13px] font-extrabold text-white transition-transform active:scale-[0.98]"
        >
          {accepted ? "Review opportunity" : "Explore this opportunity"}
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export function SecurityFooter() {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F0EBE4] p-2.5 text-[11px] text-[#8A7F78]">
      <Shield size={14} />
      Your data is secure and used only to help you achieve your goals.
    </div>
  );
}
