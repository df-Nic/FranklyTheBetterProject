import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Calculator, CheckCircle2, ChevronDown, Lightbulb, Pencil, UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatSGD, getMilestonePlan } from "../data/milestonePlans";
import { applyOpportunityChanges, getPlanOpportunity } from "../data/planOpportunities";
import { getPlanActivity } from "../data/planActivity";
import owlImg from "../assets/images/ocbc-owl-transparent.png";

const TYPE_ICON = {
  saving: Calculator,
  opportunity: Lightbulb,
  rename: Pencil,
  created: CheckCircle2,
  completion: CheckCircle2,
  milestone: CheckCircle2,
};

function ActivityItem({ event, expanded, onToggle }) {
  const hasDetails = event.type === "saving" && (event.calculation?.length || event.source);
  const Icon = TYPE_ICON[event.type] || UserRound;
  const isOwl = event.actor === "owl";
  return (
    <article className="relative pl-12">
      <span className={`absolute left-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#F9F4EE] ${
        isOwl ? "bg-[#7C2230] text-white" : "bg-[#E7F1E9] text-[#2E7D4F]"
      }`}>
        {isOwl
          ? <img src={owlImg} alt="" className="h-6 w-6 rounded-full object-contain" />
          : <Icon size={15} />}
      </span>
      <div className="overflow-hidden rounded-[18px] border border-[#E8DED5] bg-white shadow-[0_3px_12px_rgba(70,45,32,0.05)]">
        <button
          type="button"
          disabled={!hasDetails}
          aria-expanded={hasDetails ? expanded : undefined}
          onClick={hasDetails ? onToggle : undefined}
          className="w-full p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C2230] disabled:cursor-default"
        >
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[8px] font-black uppercase tracking-[0.13em] ${isOwl ? "text-[#7C2230]" : "text-[#2E7D4F]"}`}>
              {isOwl ? "Agent Owl" : "You"} · {event.status}
            </span>
            <span className="text-[8.5px] text-[#9A8D84]">
              {Number.isNaN(Date.parse(event.timestamp)) ? event.timestamp : new Date(event.timestamp).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[12.5px] font-extrabold leading-snug text-[#2B2320]">{event.title}</h2>
              <p className="mt-1 text-[10px] leading-relaxed text-[#756A63]">{event.description}</p>
            </div>
            {event.amount != null && <span className="shrink-0 text-[13px] font-black text-[#2E7D4F]">{formatSGD(event.amount)}</span>}
          </div>
          {hasDetails && (
            <span className="mt-2 flex items-center gap-1 text-[9px] font-bold text-[#7C2230]">
              How this was calculated
              <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </span>
          )}
        </button>
        <AnimatePresence initial={false}>
          {expanded && hasDetails && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="border-t border-[#F0E8E1] bg-[#FCF8F4] px-4 pb-4 pt-3">
                <dl className="space-y-2">
                  {event.calculation?.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 text-[10px]">
                      <dt className="text-[#8A7F78]">{row.label}</dt>
                      <dd className="text-right font-bold text-[#3F3732]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                {event.source && <p className="mt-3 border-t border-[#EAE0D7] pt-2 text-[9px] text-[#8A7F78]">Source: {event.source}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

export default function SavingsBreakdownPage() {
  const {
    activePlanId,
    setPage,
    opportunityDecisions,
    planAdjustments,
    planActivity,
    opportunitySourceAmount,
    opportunityLifecycle,
  } = useApp();
  const basePlan = getMilestonePlan(activePlanId, planAdjustments);
  const opportunity = getPlanOpportunity(opportunitySourceAmount);
  const decision = Object.values(opportunityDecisions).find((item) =>
    item.status === "accepted"
    && item.allocations?.some((allocation) => allocation.planId === basePlan.id));
  const plan = applyOpportunityChanges(basePlan, opportunity, decision);
  const events = getPlanActivity({
    plan,
    opportunity,
    decision,
    opportunityLifecycle,
    runtimeEvents: planActivity,
  });
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="h-full overflow-y-auto scroll-ios bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage("plan-milestones")} aria-label="Back to plan journey" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm active:scale-90">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8A7F78]">{plan.goalName}</div>
            <h1 className="text-[18px] font-black">Agent Owl history</h1>
          </div>
        </div>
      </header>
      <main className="px-4 pb-28 pt-4">
        <section className="rounded-[20px] bg-[#641D29] p-4 text-white">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/65">
            <img src={owlImg} alt="" className="h-6 w-6 rounded-full bg-white/90 object-contain" /> Plan history
          </div>
          <p className="mt-2 text-[12px] font-semibold leading-relaxed text-white/85">
            What Agent Owl has already done for you, including what changed and what you decided.
          </p>
        </section>
        {events.length ? (
          <section className="relative mt-5 space-y-3.5 before:absolute before:bottom-4 before:left-[17px] before:top-4 before:w-px before:bg-[#DCCDC2]">
            {events.map((event) => (
              <ActivityItem key={event.id} event={event} expanded={expandedId === event.id} onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)} />
            ))}
          </section>
        ) : (
          <section className="mt-5 rounded-[18px] border border-dashed border-[#DCCDC2] p-6 text-center">
            <img src={owlImg} alt="Agent Owl" className="mx-auto h-10 w-10 object-contain opacity-60" />
            <h2 className="mt-2 text-sm font-extrabold">No activity yet</h2>
            <p className="mt-1 text-[10px] text-[#756A63]">New plan actions and decisions will appear here.</p>
          </section>
        )}
      </main>
    </div>
  );
}
