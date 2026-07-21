// src/components/milestones/ImpactCards.jsx
import { motion } from "framer-motion";
import {
  Info,
  ShieldCheck,
  Clock,
  Star,
  ChevronRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import { formatSGD } from "../../data/milestonePlans";

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
          label="Better alternatives found"
          value={String(impact.betterAlternatives)}
          sub="Options reviewed and accepted"
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

export function RecommendedNextStepCard({ nextAction, onReviewPlan }) {
  return (
    <motion.div {...fadeUp} className="rounded-[18px] bg-white p-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A7F78]">{nextAction.eyebrow}</div>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#FBEFD9]">
          <TrendingUp size={20} strokeWidth={2.2} className="text-[#C88A2E]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-extrabold leading-snug text-[#2B2320]">{nextAction.title}</div>
          {nextAction.amountLabel && (
            <span className="mt-1 inline-block rounded-full bg-[#FBEFD9] px-2 py-0.5 text-[11px] font-extrabold text-[#9A641E]">
              {nextAction.amountLabel}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-[#6D625B]">{nextAction.detail}</p>

      <button
        onClick={onReviewPlan}
        className="mt-4 w-full rounded-xl bg-[#C88A2E] px-4 py-2.5 text-[13px] font-extrabold text-white transition-transform active:scale-[0.98]"
      >
        {nextAction.cta}
      </button>
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
