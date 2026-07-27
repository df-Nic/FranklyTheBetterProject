import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getMilestonePlan } from "../data/milestonePlans";

const formatSGD = (amount) => `S$${Math.round(amount).toLocaleString("en-SG")}`;

function getPersonalizedHealerReason(plan, affectedPlan, userName) {
  const firstName = userName?.trim()?.split(/\s+/)[0];
  const outcome = plan.personalContext?.desiredOutcome || plan.personalContext?.motivation || plan.goalName.toLowerCase();
  const priority = plan.personalContext?.priority || "balance";
  const gapShare = Math.max(1, Math.round((affectedPlan.gap / Math.max(plan.targetAmount, 1)) * 100));
  const flexibility = plan.personalContext?.flexibility === "limited"
    ? "and the limited flexibility you set means delaying action carries more risk"
    : "while preserving the flexibility you wanted in your plan";
  return `${firstName ? `${firstName}, ` : ""}Owl recommends ${plan.goalName} first because this payment creates a ${gapShare}% gap against its target. Your goal is ${outcome}, and your preference for ${priority} makes protecting its funding path the strongest fit ${flexibility}.`;
}

export default function PlanHealerPage() {
  const {
    transactionDeviations,
    activeDeviationId,
    setActiveDeviationId,
    setPage,
    applyDeviationRecovery,
    declineDeviationRecovery,
    user,
    planAdjustments,
  } = useApp();
  const pendingEvents = useMemo(
    () => transactionDeviations.filter((event) => event.status === "pending"),
    [transactionDeviations],
  );
  const event = transactionDeviations.find((item) => item.id === activeDeviationId)
    || pendingEvents[pendingEvents.length - 1]
    || transactionDeviations[transactionDeviations.length - 1];
  const [expandedPlanId, setExpandedPlanId] = useState(event?.recommendedPlanId || null);
  const [selectedStrategies, setSelectedStrategies] = useState({});
  const [selectedPlanIds, setSelectedPlanIds] = useState(
    () => new Set(event?.recommendedPlanId ? [event.recommendedPlanId] : []),
  );

  useEffect(() => {
    if (event && event.id !== activeDeviationId) setActiveDeviationId(event.id);
  }, [activeDeviationId, event, setActiveDeviationId]);

  useEffect(() => {
    if (event) {
      setExpandedPlanId(event.recommendedPlanId);
      setSelectedPlanIds(new Set(event.recommendedPlanId ? [event.recommendedPlanId] : []));
    }
  }, [event?.id, event?.recommendedPlanId]);

  if (!event) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#F9F4EE] px-6 text-center text-[#2B2320]">
        <ShieldCheck className="h-12 w-12 text-[#2E7D4F]" />
        <h1 className="mt-3 text-xl font-black">No plans need healing</h1>
        <p className="mt-1 text-xs text-[#756A63]">Agent Owl will let you know when a transaction needs review.</p>
        <button onClick={() => setPage("plan-dashboard")} className="mt-5 rounded-full bg-[#7C2230] px-5 py-2.5 text-xs font-black text-white">Back to My Plans</button>
      </div>
    );
  }

  const recommendedAffectedPlan = event.affectedPlans.find((plan) => plan.planId === event.recommendedPlanId);
  const recommendedPlan = getMilestonePlan(event.recommendedPlanId, planAdjustments);
  const toggleSelectedPlan = (planId) => {
    setSelectedPlanIds((current) => {
      const next = new Set(current);
      if (next.has(planId)) next.delete(planId);
      else next.add(planId);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage("plan-dashboard")} aria-label="Back to my plans" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8A7F78]">Agent Owl review</div>
            <h1 className="text-[18px] font-black">Plan Healer</h1>
          </div>
        </div>
      </header>

      <main className={event.status === "resolved"
        ? "flex flex-1 items-center justify-center px-6 pb-12"
        : "space-y-4 px-4 pb-28 pt-4"
      }>
        {event.status !== "resolved" && pendingEvents.length > 1 && (
          <section>
            <div className="px-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#8A7F78]">{pendingEvents.length} transactions need review</div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {pendingEvents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveDeviationId(item.id)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[9.5px] font-black ${item.id === event.id ? "border-[#7C2230] bg-[#7C2230] text-white" : "border-[#D9CEC5] bg-white text-[#6F6560]"}`}
                >
                  {formatSGD(item.amount)} · {new Date(item.timestamp).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
                </button>
              ))}
            </div>
          </section>
        )}

        {event.status !== "resolved" && (
        <section className="relative overflow-hidden rounded-[24px] bg-[#641D29] p-5 text-white">
          <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
          <div className="text-[9px] font-black uppercase tracking-wider text-white/60">Transaction detected</div>
          <div className="mt-1 text-[36px] font-black text-[#FFE19A]">{formatSGD(event.amount)}</div>
          <div className="mt-3 rounded-[12px] bg-white/10 px-3 py-2.5">
            <div className="text-[8px] font-black uppercase tracking-wider text-white/55">PayNow payment</div>
            <p className="mt-1 text-[10px] font-bold">{event.reference} · {event.sourceAccount}</p>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-white/75">
            Owl compared {event.affectedPlans.length} {event.affectedPlans.length === 1 ? "plan" : "plans"}. Nothing changes until you confirm a recovery.
          </p>
        </section>
        )}

        {event.status === "resolved" ? (
          <section className="w-full max-w-[280px] text-center text-[#2E523A]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F1E7]">
              <ShieldCheck className="h-8 w-8 text-[#2E7D4F]" />
            </span>
            <h2 className="mt-4 text-[20px] font-black">Review complete</h2>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#627267]">Every affected plan has been handled. You can find all decisions in Agent Owl history.</p>
            <button onClick={() => setPage("plan-dashboard")} className="mt-6 rounded-full bg-[#2E7D4F] px-6 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(46,125,79,0.18)]">View My Plans</button>
          </section>
        ) : (
          <>
            <section className="rounded-[18px] border border-[#E8DED5] bg-white p-4">
              <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#7C2230]">Owl recommendation</div>
              <h2 className="mt-1 text-[14px] font-black">
                Why Owl recommends {recommendedAffectedPlan?.planName}
              </h2>
              <p className="mt-1.5 text-[9.5px] leading-relaxed text-[#6F6560]">
                {getPersonalizedHealerReason(recommendedPlan, recommendedAffectedPlan, user?.name)}
              </p>
              <div className="mt-3 rounded-[12px] bg-[#FFF8EC] px-3 py-2 text-[8.5px] font-semibold leading-relaxed text-[#795D32]">
                Owl compared the relative funding gap, target size, your goal context, preferred balance, and flexibility across all affected plans.
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between px-1">
                <div>
                  <h2 className="text-[13px] font-extrabold">Choose plans to heal</h2>
                  <p className="mt-0.5 text-[8.5px] font-bold text-[#7C2230]">Only plans that need recovery can be selected.</p>
                  <p className="mt-0.5 text-[8.5px] text-[#756A63]">Choose Owl’s recommendation, another plan, or multiple plans.</p>
                </div>
                <span className="text-[8.5px] font-black text-[#7C2230]">{selectedPlanIds.size} selected</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {event.affectedPlans.filter((plan) => plan.status === "pending").map((plan) => {
                  const selected = selectedPlanIds.has(plan.planId);
                  const recommended = plan.planId === event.recommendedPlanId;
                  return (
                    <button
                      key={`select-${plan.planId}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleSelectedPlan(plan.planId)}
                      className={`flex items-center gap-3 rounded-[15px] border p-3 text-left ${selected ? "border-[#7C2230] bg-[#FFF8F4] ring-1 ring-[#7C2230]" : "border-[#E8DED5] bg-white"}`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? "border-[#7C2230] bg-[#7C2230] text-white" : "border-[#CBBEB5] text-transparent"}`}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-[10.5px]">{plan.planName}</strong>
                        <span className="mt-0.5 block text-[8.5px] text-[#756A63]">{formatSGD(plan.gap)} projected gap</span>
                      </span>
                      {recommended && <span className="rounded-full bg-[#7C2230] px-2 py-1 text-[7.5px] font-black uppercase text-white">Owl pick</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedPlanIds.size > 0 && (
            <section>
              <h2 className="px-1 text-[13px] font-extrabold">Choose a fix for each selected plan</h2>
              <div className="mt-2 space-y-2.5">
                {event.affectedPlans.filter((plan) => plan.status === "pending" && selectedPlanIds.has(plan.planId)).map((plan) => {
                  const isExpanded = expandedPlanId === plan.planId;
                  const selectedStrategy = selectedStrategies[plan.planId] || "deposit";
                  const isRecommended = plan.planId === event.recommendedPlanId;
                  return (
                    <article key={plan.planId} className={`overflow-hidden rounded-[18px] border bg-white ${isRecommended ? "border-[#7C2230]" : "border-[#E8DED5]"}`}>
                      <button
                        type="button"
                        onClick={() => setExpandedPlanId(isExpanded ? null : plan.planId)}
                        className="flex w-full items-center justify-between gap-3 p-3.5 text-left"
                      >
                        <span>
                          <span className="text-[8px] font-black uppercase tracking-wide text-[#B14A3F]">
                            {isRecommended ? "Review first" : "Needs healing"}
                          </span>
                          <strong className="mt-0.5 block text-[12px]">{plan.planName}</strong>
                          <span className="mt-0.5 block text-[9px] text-[#756A63]">
                            Projected gap {formatSGD(plan.gap)}
                          </span>
                        </span>
                        <ChevronDown size={16} className={`text-[#7C2230] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="border-t border-[#EFE7E0] bg-[#FFFDFB] p-3.5">
                          <div className="text-[9px] font-black uppercase tracking-wide text-[#8A7F78]">Choose a recovery</div>
                          <div className="mt-2 space-y-2">
                            {plan.recoveryOptions.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setSelectedStrategies((current) => ({ ...current, [plan.planId]: option.id }))}
                                className={`w-full rounded-[14px] border p-3 text-left ${selectedStrategy === option.id ? "border-[#7C2230] bg-[#FFF8F4] ring-1 ring-[#7C2230]" : "border-[#E8DED5] bg-white"}`}
                              >
                                <div className="flex justify-between gap-3">
                                  <span>
                                    <span className="text-[8px] font-black uppercase text-[#9A641E]">{option.label}</span>
                                    <strong className="mt-0.5 block text-[10.5px]">{option.title}</strong>
                                    <span className="mt-1 block text-[9px] leading-relaxed text-[#756A63]">{option.description}</span>
                                  </span>
                                  {selectedStrategy === option.id && <Check size={15} className="shrink-0 text-[#7C2230]" />}
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => applyDeviationRecovery(event.id, plan.planId, selectedStrategy)}
                            className="mt-3 w-full rounded-xl bg-[#7C2230] py-3 text-[11px] font-extrabold text-white"
                          >
                            Confirm and apply recovery
                          </button>
                          <button
                            type="button"
                            onClick={() => declineDeviationRecovery(event.id, plan.planId)}
                            className="mt-2 w-full rounded-xl border border-[#D9CEC5] py-2.5 text-[10px] font-extrabold"
                          >
                            Keep current plan
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
            )}

            {event.affectedPlans.some((plan) => plan.status !== "pending") && (
              <section>
                <div className="px-1">
                  <h2 className="text-[13px] font-extrabold">Checked by Agent Owl</h2>
                  <p className="mt-0.5 text-[8.5px] text-[#756A63]">These plans cannot be selected because they do not need recovery.</p>
                </div>
                <div className="mt-2 overflow-hidden rounded-[18px] border border-[#CFE2D3] bg-[#F4F9F5]">
                  {event.affectedPlans.filter((plan) => plan.status !== "pending").map((plan, index) => {
                    const label = plan.status === "applied"
                      ? "Recovery applied"
                      : plan.status === "declined"
                        ? "Current plan kept"
                        : plan.impactStatus === "reduced-buffer"
                          ? "No action needed"
                          : "Still on track";
                    const detail = plan.status === "not-required" && plan.impactStatus === "reduced-buffer"
                      ? `${formatSGD(plan.remainingBuffer)} safety buffer remains`
                      : plan.status === "not-required"
                        ? "Agent Owl found no material impact"
                        : "This plan has already been handled";
                    return (
                      <div key={`checked-${plan.planId}`} className={`flex items-center gap-3 px-3.5 py-3 ${index ? "border-t border-[#DDEADF]" : ""}`}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4F1E7] text-[#2E7D4F]">
                          <ShieldCheck size={17} strokeWidth={2.2} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-[10.5px]">{plan.planName}</strong>
                          <span className="mt-0.5 block text-[8.5px] text-[#627267]">{detail}</span>
                        </span>
                        <span className="max-w-[92px] text-right text-[8px] font-black uppercase leading-snug text-[#2E7D4F]">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
