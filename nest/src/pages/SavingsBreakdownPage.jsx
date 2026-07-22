import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Calculator, ChevronDown, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatSGD, getMilestonePlan } from "../data/milestonePlans";
import { getSavingsBreakdown, sumSavings } from "../data/savingsBreakdowns";

function BreakdownItem({ item, expanded, onToggle }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#E8DED5] bg-white shadow-[0_3px_12px_rgba(70,45,32,0.05)]">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C2230]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-[#E6F2E8] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#2E7D4F]">
              Savings achieved
            </span>
            <h2 className="mt-2 text-[15px] font-extrabold leading-snug text-[#2B2320]">{item.title}</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-[#756A63]">{item.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[17px] font-black text-[#2E7D4F]">{formatSGD(item.amount)}</div>
            <ChevronDown className={`ml-auto mt-2 h-4 w-4 text-[#8A7F78] transition-transform ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#F0E8E1] bg-[#FCF8F4] px-4 pb-4 pt-3">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#7C2230]">
                <Calculator size={14} /> How this saving was calculated
              </div>
              <dl className="mt-3 space-y-2">
                {item.calculation.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 text-[11px]">
                    <dt className="text-[#8A7F78]">{row.label}</dt>
                    <dd className="text-right font-bold text-[#3F3732]">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 border-t border-[#EAE0D7] pt-2 text-[9.5px] text-[#8A7F78]">Source: {item.source}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function SavingsBreakdownPage() {
  const { activePlanId, setPage } = useApp();
  const plan = getMilestonePlan(activePlanId);
  const breakdown = getSavingsBreakdown(plan.id);
  const [expandedId, setExpandedId] = useState(breakdown.items[0]?.id ?? null);
  const realized = sumSavings(breakdown.items, "realized");

  return (
    <div className="h-full overflow-y-auto bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage("plan-milestones")}
            aria-label="Back to plan journey"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm transition-transform active:scale-90"
          >
            <ArrowLeft size={18} strokeWidth={2.4} />
          </button>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8A7F78]">{plan.goalName}</div>
            <h1 className="text-[18px] font-black">Savings breakdown</h1>
          </div>
        </div>
      </header>

      <main className="space-y-4 px-4 pb-28 pt-4">
        <section className="relative overflow-hidden rounded-[24px] bg-[#641D29] p-5 text-white shadow-[0_12px_28px_rgba(84,24,35,0.22)]">
          <Sparkles className="absolute -right-3 -top-3 h-24 w-24 text-white/[0.06]" />
          <div className="relative">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/65">Savings achieved</div>
            <div className="mt-2 text-[34px] font-black tracking-tight">{formatSGD(realized)}</div>
            <p className="mt-1 max-w-[270px] text-[11px] leading-relaxed text-white/75">
              Captured through actions Agent Owl helped you complete for this plan.
            </p>
            <div className="mt-4 flex gap-2 text-[10px] font-bold">
              <span className="rounded-full bg-white/12 px-2.5 py-1">As of {breakdown.asOf}</span>
              <span className="rounded-full bg-white/12 px-2.5 py-1">{breakdown.items.length} actions completed</span>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between gap-3 px-1">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A7F78]">What contributes</div>
              <p className="mt-0.5 text-[11px] text-[#756A63]">Tap an item to see its assumptions.</p>
            </div>
            <span className="text-[10px] font-bold text-[#8A7F78]">{breakdown.items.length} items</span>
          </div>
          <div className="space-y-3">
            {breakdown.items.map((item) => (
              <BreakdownItem
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId((current) => current === item.id ? null : item.id)}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
