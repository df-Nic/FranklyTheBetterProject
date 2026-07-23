import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Info,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getMilestonePlan } from "../data/milestonePlans";
import { canAcceptOpportunity, getOpportunityStatus, getPlanOpportunity } from "../data/planOpportunities";

function Section({ eyebrow, title, icon, children, tone = "default" }) {
  const styles = tone === "consider"
    ? "border-[#E8D7B8] bg-[#FFF9EC]"
    : "border-[#E8DED5] bg-white";
  return (
    <section className={`rounded-[20px] border p-4 shadow-[0_3px_14px_rgba(70,45,32,0.04)] ${styles}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3ECE6] text-[#7C2230]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[#9A8D84]">{eyebrow}</div>
          <h2 className="mt-0.5 text-[15px] font-extrabold leading-snug text-[#2B2320]">{title}</h2>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function OpportunityDetailPage() {
  const {
    activePlanId,
    setPage,
    opportunityDecisions,
    decideOpportunity,
  } = useApp();
  const plan = getMilestonePlan(activePlanId);
  const opportunity = getPlanOpportunity(plan.id);
  const decision = opportunityDecisions[plan.id];
  const displayStatus = getOpportunityStatus(opportunity, decision);
  const canAccept = canAcceptOpportunity(opportunity, decision);

  const handleDecision = (status) => {
    if (decideOpportunity(plan.id, opportunity, status)) {
      setPage("plan-milestones");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage("plan-milestones")}
            aria-label="Back to plan journey"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm active:scale-90"
          >
            <ArrowLeft size={18} strokeWidth={2.4} />
          </button>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8A7F78]">{plan.goalName}</div>
            <h1 className="text-[18px] font-black">Plan opportunity</h1>
          </div>
        </div>
      </header>

      <main className="space-y-3.5 px-4 pb-32 pt-4">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[24px] bg-[#641D29] p-5 text-white shadow-[0_12px_28px_rgba(84,24,35,0.22)]"
        >
          <Sparkles className="absolute -right-5 -top-5 h-28 w-28 text-white/[0.07]" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em]">
              {displayStatus === "accepted" ? "Opportunity accepted" : displayStatus === "declined" ? "Current plan kept" : "Opportunity starts now"}
            </span>
            <h2 className="mt-3 text-[24px] font-black leading-[1.08]">{opportunity.title}</h2>
            <p className="mt-3 text-[11.5px] leading-relaxed text-white/80">{opportunity.summary}</p>
            <div className="mt-5 border-l-2 border-[#F1C66D] pl-3.5">
              <div className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
                {opportunity.benefitCaption}
              </div>
              <div className="mt-0.5 text-[32px] font-black leading-none tracking-tight text-[#FFE19A]">
                {opportunity.benefitValue}
              </div>
              <p className="mt-1.5 text-[10.5px] font-semibold leading-relaxed text-white/75">
                {opportunity.benefitContext}
              </p>
            </div>
            <p className="mt-4 text-[10.5px] leading-relaxed text-white/70">
              Your current plan remains sound. This is an optional way to improve it.
            </p>
          </div>
        </motion.section>

        <Section eyebrow="What became available" title={opportunity.triggerType} icon={<Sparkles size={17} />}>
          <p className="text-[11.5px] leading-relaxed text-[#665B55]">{opportunity.trigger}</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded-xl bg-[#F8F3EE] p-2.5">
              <dt className="text-[#8A7F78]">Identified</dt>
              <dd className="mt-0.5 font-extrabold">{opportunity.detectedDate}</dd>
            </div>
            <div className="rounded-xl bg-[#F8F3EE] p-2.5">
              <dt className="text-[#8A7F78]">Terms checked</dt>
              <dd className="mt-0.5 font-extrabold">{opportunity.checkedDate}</dd>
            </div>
          </dl>
        </Section>

        <Section eyebrow="Why it applies to you" title="A fit with your existing plan" icon={<CheckCircle2 size={17} />}>
          <ul className="space-y-2">
            {opportunity.relevance.map((reason) => (
              <li key={reason} className="flex gap-2 text-[11.5px] leading-relaxed text-[#665B55]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2E7D4F]" />
                {reason}
              </li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="How it could help" title={opportunity.benefitType} icon={<ArrowRight size={17} />}>
          <div className="overflow-hidden rounded-[14px] border border-[#EAE0D7]">
            <div className="grid grid-cols-[1.15fr_1fr_1fr] bg-[#F8F3EE] px-3 py-2 text-[9px] font-black uppercase tracking-wide text-[#8A7F78]">
              <span>Measure</span><span>Current</span><span>Enhanced</span>
            </div>
            {opportunity.comparisons.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.15fr_1fr_1fr] border-t border-[#EFE7E0] px-3 py-2.5 text-[10px] leading-snug">
                <span className="text-[#756A63]">{row.label}</span>
                <span className="font-bold text-[#4E4540]">{row.current}</span>
                <span className={`font-extrabold ${row.proposed === row.current ? "text-[#4E4540]" : "text-[#2E7D4F]"}`}>
                  {row.proposed}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="What to consider" title="Assumptions and tradeoffs" icon={<Scale size={17} />} tone="consider">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-extrabold text-[#6B5B3F]">This estimate assumes</div>
              <ul className="mt-1.5 space-y-1.5 text-[10.5px] leading-relaxed text-[#756A63]">
                {opportunity.assumptions.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="border-t border-[#E8D7B8] pt-3">
              <div className="text-[10px] font-extrabold text-[#6B5B3F]">Tradeoffs</div>
              <ul className="mt-1.5 space-y-1.5 text-[10.5px] leading-relaxed text-[#756A63]">
                {opportunity.tradeoffs.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </Section>

        <section className="rounded-[18px] border border-[#CFE2D3] bg-[#F2F8F3] p-4">
          <div className="flex gap-2.5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D4F]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[12px] font-extrabold text-[#2E523A]">Eligibility {opportunity.eligibility.label.toLowerCase()}</h2>
                <span className="rounded-full bg-[#DDEEE0] px-2 py-0.5 text-[8px] font-black uppercase text-[#2E7D4F]">{opportunity.eligibility.label}</span>
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-[#597061]">{opportunity.eligibility.detail}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[16px] bg-[#F0EBE4] p-3.5 text-[9.5px] leading-relaxed text-[#756A63]">
          <div className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>Source: {opportunity.source}</span></div>
          <div className="mt-2 flex gap-2"><CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>Review by {opportunity.expiryDate}. Conditions will be checked again before any change is applied.</span></div>
        </section>

        {displayStatus === "accepted" ? (
          <section className="rounded-[18px] border border-[#CFE2D3] bg-white p-4 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-[#2E7D4F]" />
            <h2 className="mt-2 text-[14px] font-extrabold">Enhancement applied</h2>
            <p className="mt-1 text-[10.5px] text-[#756A63]">Accepted on {decision.decidedAt}. Achieved savings remain separate until they are recorded.</p>
          </section>
        ) : displayStatus === "declined" ? (
          <section className="rounded-[18px] border border-[#E4D8CE] bg-white p-4 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-[#8A7F78]" />
            <h2 className="mt-2 text-[14px] font-extrabold">Your existing plan remains unchanged</h2>
            <p className="mt-1 text-[10.5px] text-[#756A63]">Agent Owl will continue monitoring for other improvements.</p>
          </section>
        ) : displayStatus === "expired" || displayStatus === "superseded" ? (
          <section className="rounded-[18px] border border-[#E4D8CE] bg-white p-4 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-[#8A7F78]" />
            <h2 className="mt-2 text-[14px] font-extrabold">This opportunity is no longer available</h2>
            <p className="mt-1 text-[10.5px] text-[#756A63]">Your existing plan remains unchanged. Agent Owl will keep monitoring current conditions.</p>
          </section>
        ) : (
          <section className="rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(70,45,32,0.06)]">
            <h2 className="text-[14px] font-extrabold">Your plan, your decision</h2>
            <p className="mt-1 text-[10.5px] leading-relaxed text-[#756A63]">Nothing changes unless you accept. Keeping your current plan will not affect its progress or monitoring.</p>
            <button
              disabled={!canAccept}
              onClick={() => handleDecision("accepted")}
              className="mt-4 w-full rounded-xl bg-[#7C2230] px-4 py-3 text-[13px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Accept opportunity
            </button>
            <button
              onClick={() => handleDecision("declined")}
              className="mt-2 w-full rounded-xl border border-[#D9CEC5] px-4 py-3 text-[12px] font-extrabold text-[#5E514A]"
            >
              Keep my current plan
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
