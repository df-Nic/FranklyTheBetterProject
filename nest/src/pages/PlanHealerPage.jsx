import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarClock, Check, ChevronDown, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getMilestonePlan } from "../data/milestonePlans";
import { getPlanOpportunity } from "../data/planOpportunities";
import { isDeviationPlanActionable } from "../lib/deviationRecovery";

const money = (value) => `S$${Math.round(value || 0).toLocaleString("en-SG")}`;

export default function PlanHealerPage() {
  const {
    transactionDeviations,
    activeDeviationId,
    setActiveDeviationId,
    setActivePlanId,
    activePlanId,
    setPage,
    applyDeviationRecoveries,
    declineDeviationRecovery,
    applyOpportunityRecovery,
    opportunityDecisions,
    user,
    planAdjustments,
    opportunitySourceAmount,
    opportunityLifecycle,
    dismissDeviationNotifications,
    restoreOrigin,
    restoreIntent,
  } = useApp();

  const pendingEvents = transactionDeviations.filter((item) => ["pending", "partially-resolved"].includes(item.status));
  const selectedEvent = transactionDeviations.find((item) => item.id === activeDeviationId);
  const event = selectedEvent
    ? selectedEvent
    : pendingEvents[0] || selectedEvent || transactionDeviations[transactionDeviations.length - 1];
  const opportunity = getPlanOpportunity(opportunitySourceAmount);
  const opportunityHandled = Object.values(opportunityDecisions).some(
    (decision) => decision.opportunityId === opportunity.id,
  );

  const defaultAllocations = useMemo(() => {
    if (!event) return {};
    let remaining = opportunity.sourceAmount;
    return event.affectedPlans
      .filter((plan) => plan.status === "pending")
      .reduce((allocations, plan) => {
        const amount = Math.min(plan.gap, remaining);
        allocations[plan.planId] = amount;
        remaining -= amount;
        return allocations;
      }, {});
  }, [event?.id, opportunity.sourceAmount]);

  const [selectedPlanIds, setSelectedPlanIds] = useState(new Set());
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [selectedStrategies, setSelectedStrategies] = useState({});
  const [bonusOpen, setBonusOpen] = useState(false);
  const [bonusAllocations, setBonusAllocations] = useState(defaultAllocations);
  const [reviewingRevisionIds, setReviewingRevisionIds] = useState(new Set());

  useEffect(() => {
    if (!event) return;
    const requestedRevision = restoreIntent === "alternatives"
      ? event.affectedPlans.find((plan) => plan.planId === activePlanId && plan.status === "timeline-extended")
      : null;
    const recommendedPending = event.affectedPlans.some(
      (plan) => plan.planId === event.recommendedPlanId && plan.status === "pending",
    );
    const initialPlanId = requestedRevision?.planId || (recommendedPending
      ? event.recommendedPlanId
      : event.affectedPlans.find((plan) => plan.status === "pending")?.planId);
    setActiveDeviationId(event.id);
    setSelectedPlanIds(new Set(initialPlanId ? [initialPlanId] : []));
    setExpandedPlanId(initialPlanId || null);
    setSelectedStrategies({});
    setBonusOpen(false);
    setBonusAllocations(defaultAllocations);
    setReviewingRevisionIds(new Set(requestedRevision ? [requestedRevision.planId] : []));
  }, [event?.id, restoreIntent]);

  if (!event) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F9F4EE] px-6 text-center">
        <div>
          <ShieldCheck className="mx-auto text-[#2E7D4F]" size={42} />
          <h1 className="mt-3 text-xl font-black">No plans need healing</h1>
          <button onClick={() => setPage("plan-dashboard")} className="mt-4 rounded-full bg-[#7C2230] px-5 py-2.5 text-xs font-black text-white">View My Plans</button>
        </div>
      </div>
    );
  }

  const pendingPlans = event.affectedPlans.filter((plan) =>
    plan.status === "pending" || (plan.status === "timeline-extended" && reviewingRevisionIds.has(plan.planId)));
  const revisedPlans = event.affectedPlans.filter((plan) =>
    plan.status === "timeline-extended" && !reviewingRevisionIds.has(plan.planId));
  const healedPlans = event.affectedPlans.filter((plan) => plan.status === "applied");
  const continuingPlans = event.affectedPlans.filter((plan) => plan.status === "covered");
  const checkedPlans = event.affectedPlans.filter((plan) =>
    !isDeviationPlanActionable(plan) && !["timeline-extended", "applied"].includes(plan.status));
  const recommendedAffected = event.affectedPlans.find((plan) => plan.planId === event.recommendedPlanId);
  const recommendedPlan = getMilestonePlan(event.recommendedPlanId, planAdjustments);
  const firstName = user?.name?.split(/\s+/)[0] || "You";
  const personalOutcome = recommendedPlan.personalContext?.desiredOutcome || recommendedPlan.goalName;
  const totalBonus = Object.values(bonusAllocations).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0,
  );
  const allReviewsComplete = event.status === "resolved" && pendingPlans.length === 0 && revisedPlans.length === 0;
  const hasPendingRecovery = event.affectedPlans.some((plan) => plan.status === "pending");

  const togglePlan = (planId) => {
    setSelectedPlanIds((current) => {
      const next = new Set(current);
      if (next.has(planId)) next.delete(planId);
      else next.add(planId);
      return next;
    });
  };

  const handleNotNow = () => {
    dismissDeviationNotifications(event.id);
    setPage(restoreOrigin || "plan-dashboard");
  };

  const handleBack = () => setPage(restoreOrigin || "plan-dashboard");

  const reviewTimelineAlternatives = (planId) => {
    setReviewingRevisionIds((current) => new Set([...current, planId]));
    setSelectedPlanIds(new Set([planId]));
    setExpandedPlanId(planId);
  };

  const viewUpdatedMilestones = (planId) => {
    setActivePlanId(planId);
    setPage("plan-milestones");
  };

  const applySelectedRecoveries = () => {
    const selections = pendingPlans
      .filter((plan) => selectedPlanIds.has(plan.planId))
      .map((plan) => ({
        planId: plan.planId,
        strategyId: selectedStrategies[plan.planId] || plan.recoveryOptions[0]?.id,
      }));
    applyDeviationRecoveries(event.id, selections);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto scroll-ios bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} aria-label="Go back" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[18px] font-black">NEST Restore</h1>
          </div>
        </div>
      </header>

      {allReviewsComplete ? (
        <main className="flex flex-1 items-center justify-center px-6 pb-12 text-center">
          <section className="max-w-[280px] text-[#2E523A]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F1E7]">
              <ShieldCheck size={32} />
            </span>
            <h2 className="mt-4 text-xl font-black">Recovery applied</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-[#627267]">Your portfolio decision is complete. Selected plans were adjusted and the others continue normally.</p>
            {healedPlans.length > 0 && (
              <div className="mt-5 space-y-2">
                {healedPlans.map((plan) => (
                  <button key={`complete-${plan.planId}`} onClick={() => viewUpdatedMilestones(plan.planId)} className="flex w-full items-center justify-between rounded-xl bg-[#2E7D4F] px-4 py-3 text-left text-[10px] font-black text-white">
                    <span>View {plan.planName}</span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
            )}
            {continuingPlans.length > 0 && (
              <div className="mt-4 rounded-xl border border-[#D7E8DB] bg-white p-3 text-left">
                <div className="text-[8px] font-black uppercase tracking-wider text-[#2E7D4F]">Continuing unchanged</div>
                <div className="mt-2 space-y-1 text-[9.5px] font-bold text-[#627267]">
                  {continuingPlans.map((plan) => <div key={`covered-${plan.planId}`}>{plan.planName}</div>)}
                </div>
              </div>
            )}
            <button onClick={() => setPage("plan-dashboard")} className={`${healedPlans.length ? "mt-2" : "mt-6"} rounded-full px-6 py-3 text-[10px] font-black text-[#2E7D4F]`}>View all plans</button>
          </section>
        </main>
      ) : (
        <main className="space-y-4 px-4 pb-28 pt-4">
          {pendingEvents.length > 1 && (
            <section>
              <div className="px-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#8A7F78]">{pendingEvents.length} transactions need review</div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {pendingEvents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveDeviationId(item.id)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-[9.5px] font-black ${item.id === event.id ? "border-[#7C2230] bg-[#7C2230] text-white" : "border-[#D9CEC5] bg-white text-[#6F6560]"}`}
                  >
                    {money(item.amount)} · {new Date(item.timestamp).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="relative overflow-hidden rounded-[24px] bg-[#641D29] p-5 text-white">
            <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
            <div className="text-[9px] font-black uppercase tracking-wider text-white/60">Transaction detected</div>
            <div className="mt-1 text-[36px] font-black text-[#FFE19A]">{money(event.amount)}</div>
            <div className="mt-3 rounded-[12px] bg-white/10 px-3 py-2.5">
              <div className="text-[8px] font-black uppercase tracking-wider text-white/55">{event.type === "paynow" ? "PayNow payment" : "Transaction"}</div>
              <p className="mt-1 text-[10px] font-bold">{event.reference} · {event.sourceAccount}</p>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-white/75">
              Owl compared {event.affectedPlans.length} {event.affectedPlans.length === 1 ? "plan" : "plans"}. Nothing changes until you confirm a recovery.
            </p>
          </section>

          <section className="rounded-[18px] border border-[#E8DED5] bg-white p-4">
            <div className="text-[8px] font-black uppercase tracking-widest text-[#7C2230]">Why Owl recommends {recommendedAffected?.planName}</div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#6F6560]">
              {firstName}, this plan has the largest relative funding gap after your payment. Prioritising it best protects your goal of {personalOutcome}, while respecting your {recommendedPlan.personalContext?.priority || "balanced"} preference.
            </p>
            <div className="mt-3 rounded-[12px] bg-[#FFF8EC] px-3 py-2 text-[8.5px] font-semibold leading-relaxed text-[#795D32]">
              Owl compared the funding gap, target size, goal context, preferred balance, and flexibility across all active plans.
            </div>
          </section>

          {opportunityLifecycle.state === 'healer' && !opportunityHandled && (
            <section className="overflow-hidden rounded-[20px] border border-[#E6D39E] bg-[#FFF9E9]">
              <button onClick={() => setBonusOpen(!bonusOpen)} className="flex w-full items-center gap-3 p-4 text-left">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE9A8] text-[#9A641E]"><Sparkles size={17} /></span>
                <span className="flex-1">
                  <span className="text-[8px] font-black uppercase text-[#9A641E]">NEST Signal</span>
                  <strong className="block text-[12px]">Use your S${(opportunity.sourceAmount || 8000).toLocaleString("en-SG")} deposit to heal plans</strong>
                </span>
                <ChevronDown size={16} className={bonusOpen ? "rotate-180" : ""} />
              </button>
              {bonusOpen && (
                <div className="border-t border-[#E6D39E] bg-white/70 p-4">
                  <p className="text-[9px] leading-relaxed text-[#756A63]">Allocate the bonus across any plans. Fully covered gaps resolve; partial gaps remain for another recovery.</p>
                  <div className="mt-3 space-y-2">
                    {pendingPlans.map((plan) => (
                      <div key={`bonus-${plan.planId}`} className="flex items-center justify-between rounded-xl border border-[#E8DED5] bg-white p-3">
                        <span>
                          <strong className="block text-[10px]">{plan.planName}</strong>
                          <span className="text-[8px] text-[#756A63]">Gap {money(plan.gap)}</span>
                        </span>
                        <span className="flex items-center rounded-lg border border-[#D9CEC5] px-2 py-1 focus-within:ring-2 focus-within:ring-[#9A641E]">
                          <span className="text-[9px]">S$</span>
                          <input
                            type="number"
                            min="0"
                            max={opportunity.sourceAmount}
                            value={bonusAllocations[plan.planId] ?? ''}
                            onChange={(inputEvent) => {
                              const valStr = inputEvent.target.value;
                              if (valStr === '') {
                                setBonusAllocations((current) => ({
                                  ...current,
                                  [plan.planId]: '',
                                }));
                                return;
                              }
                              const val = Math.min(opportunity.sourceAmount, Math.max(0, Math.floor(Number(valStr))));
                              setBonusAllocations((current) => ({
                                ...current,
                                [plan.planId]: Number.isNaN(val) ? '' : val,
                              }));
                            }}
                            className="w-16 bg-transparent text-right text-[10px] font-black outline-none"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-2 text-right text-[9px] font-black ${totalBonus <= opportunity.sourceAmount ? "text-[#2E7D4F]" : "text-[#B14A3F]"}`}>
                    Using {money(totalBonus)} of {money(opportunity.sourceAmount)}
                  </div>
                  <button
                    disabled={!totalBonus || totalBonus > opportunity.sourceAmount}
                    onClick={() => applyOpportunityRecovery(
                      event.id,
                      Object.entries(bonusAllocations).map(([planId, amount]) => ({ planId, amount: Number(amount) || 0 })),
                    )}
                    className="mt-3 w-full rounded-xl bg-[#9A641E] py-3 text-[10px] font-black text-white disabled:opacity-40"
                  >
                    Apply bonus to recovery
                  </button>
                </div>
              )}
            </section>
          )}

          {revisedPlans.map((plan) => (
            <section key={`timeline-confirmation-${plan.planId}`} className="overflow-hidden rounded-[22px] border border-[#BCD8C4] bg-[#F2F8F3] shadow-[0_8px_20px_rgba(46,125,79,0.08)]" aria-live="polite">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDEEE1] text-[#2E7D4F]"><CalendarClock size={19} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#2E7D4F]">Timeline extended</div>
                    <h2 className="mt-0.5 text-[13px] font-black">{plan.planName} has a new path</h2>
                    <p className="mt-1 text-[9.5px] leading-relaxed text-[#627267]">Your monthly contribution stays unchanged. All unfinished milestones moved together.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-[14px] border border-[#D7E8DB] bg-white px-3 py-3">
                  <div>
                    <div className="text-[7.5px] font-black uppercase tracking-wider text-[#8A7F78]">Original</div>
                    <div className="mt-0.5 text-[11px] font-black text-[#6F6560]">{plan.originalGoalDate}</div>
                  </div>
                  <ChevronRight size={16} className="text-[#2E7D4F]" />
                  <div className="text-right">
                    <div className="text-[7.5px] font-black uppercase tracking-wider text-[#2E7D4F]">Revised</div>
                    <div className="mt-0.5 text-[11px] font-black text-[#2E523A]">{plan.revisedGoalDate}</div>
                  </div>
                </div>
                <div className="mt-2 text-center text-[8.5px] font-bold text-[#627267]">{plan.delayMonths} {plan.delayMonths === 1 ? "month" : "months"} added</div>
                <button onClick={() => viewUpdatedMilestones(plan.planId)} className="mt-3 w-full rounded-xl bg-[#2E7D4F] py-3 text-[10px] font-black text-white">View updated milestones</button>
                <button onClick={() => reviewTimelineAlternatives(plan.planId)} className="mt-2 w-full py-2 text-[9.5px] font-black text-[#7C2230]">Review another recovery option</button>
              </div>
            </section>
          ))}

          {healedPlans.length > 0 && (
            <section className="rounded-[20px] border border-[#BCD8C4] bg-[#F2F8F3] p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDEEE1] text-[#2E7D4F]"><ShieldCheck size={17} /></span>
                <div>
                  <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#2E7D4F]">Recovery applied</div>
                  <h2 className="text-[12px] font-black">{healedPlans.length === 1 ? "Your plan is back on pace" : `${healedPlans.length} plans are back on pace`}</h2>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {healedPlans.map((plan) => (
                  <button key={`healed-${plan.planId}`} onClick={() => viewUpdatedMilestones(plan.planId)} className="flex w-full items-center justify-between rounded-xl border border-[#D7E8DB] bg-white px-3 py-3 text-left">
                    <span>
                      <strong className="block text-[10px]">{plan.planName}</strong>
                      <span className="text-[8px] text-[#627267]">View updated milestones</span>
                    </span>
                    <ChevronRight size={15} className="text-[#2E7D4F]" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {pendingPlans.length > 0 && <section>
            <div className="flex items-end justify-between px-1">
              <div>
                <h2 className="text-[13px] font-black">Choose plans to heal</h2>
                <p className="text-[8.5px] font-bold text-[#7C2230]">Only plans that need recovery can be selected.</p>
              </div>
              <span className="text-[8.5px] font-black text-[#7C2230]">{selectedPlanIds.size} selected</span>
            </div>
            <div className="mt-2 space-y-2">
              {pendingPlans.map((plan) => {
                const selected = selectedPlanIds.has(plan.planId);
                return (
                  <button key={plan.planId} onClick={() => togglePlan(plan.planId)} className={`flex w-full items-center gap-3 rounded-[15px] border p-3 text-left ${selected ? "border-[#7C2230] bg-[#FFF8F4] ring-1 ring-[#7C2230]" : "border-[#E8DED5] bg-white"}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded border ${selected ? "bg-[#7C2230] text-white" : "text-transparent"}`}><Check size={13} /></span>
                    <span className="flex-1">
                      <strong className="block text-[10.5px]">{plan.planName}</strong>
                      <span className="text-[8.5px] text-[#756A63]">Gap {money(plan.gap)}</span>
                    </span>
                    {plan.planId === event.recommendedPlanId && <span className="rounded-full bg-[#7C2230] px-2 py-1 text-[7.5px] font-black uppercase text-white">Owl pick</span>}
                  </button>
                );
              })}
            </div>
          </section>}

          {pendingPlans.filter((plan) => selectedPlanIds.has(plan.planId)).map((plan) => {
            const selectedStrategy = selectedStrategies[plan.planId] || plan.recoveryOptions[0]?.id;
            const expanded = expandedPlanId === plan.planId;
            return (
              <section key={`strategy-${plan.planId}`} className="overflow-hidden rounded-[18px] border border-[#E8DED5] bg-white">
                <button onClick={() => setExpandedPlanId(expanded ? null : plan.planId)} className="flex w-full items-center justify-between p-4 text-left">
                  <strong className="text-[11px]">{plan.planName}: choose a recovery</strong>
                  <ChevronDown size={15} className={expanded ? "rotate-180" : ""} />
                </button>
                {expanded && (
                  <div className="border-t border-[#EFE7E0] bg-[#FFFDFB] p-3.5">
                    <div className="space-y-2">
                      {plan.recoveryOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedStrategies((current) => ({ ...current, [plan.planId]: option.id }))}
                          className={`w-full rounded-[14px] border p-3 text-left ${selectedStrategy === option.id ? "border-[#7C2230] bg-[#FFF8F4]" : "border-[#E8DED5] bg-white"}`}
                        >
                          <span className="text-[8px] font-black uppercase text-[#9A641E]">{option.label}</span>
                          <strong className="mt-0.5 block text-[10.5px]">{option.title}</strong>
                          <span className="mt-1 block text-[9px] leading-relaxed text-[#756A63]">{option.description}</span>
                        </button>
                      ))}
                    </div>
                    {plan.status !== "timeline-extended" && (
                      <button onClick={() => declineDeviationRecovery(event.id, plan.planId)} className="mt-2 w-full rounded-xl border border-[#D9CEC5] py-2.5 text-[10px] font-black">
                        Keep contribution and extend timeline
                      </button>
                    )}
                  </div>
                )}
              </section>
            );
          })}

          {pendingPlans.some((plan) => selectedPlanIds.has(plan.planId)) && (
            <button onClick={applySelectedRecoveries} className="w-full rounded-xl bg-[#7C2230] py-3.5 text-[10px] font-black text-white shadow-[0_7px_16px_rgba(124,34,48,0.18)]">
              Apply {selectedPlanIds.size > 1 ? `recoveries to ${selectedPlanIds.size} plans` : "selected recovery"}
            </button>
          )}

          {checkedPlans.length > 0 && (
            <section>
              <h2 className="px-1 text-[13px] font-black">Checked by Agent Owl</h2>
              <p className="px-1 text-[8.5px] text-[#756A63]">These plans cannot be selected because they do not need recovery or have already been handled.</p>
              <div className="mt-2 overflow-hidden rounded-[18px] border border-[#CFE2D3] bg-[#F4F9F5]">
                {checkedPlans.map((plan, index) => (
                  <div key={plan.planId} className={`flex items-center gap-3 p-3 ${index ? "border-t border-[#DDEADF]" : ""}`}>
                    <ShieldCheck size={17} className="text-[#2E7D4F]" />
                    <span className="flex-1">
                      <strong className="block text-[10px]">{plan.planName}</strong>
                      <span className="text-[8px] text-[#627267]">
                        {plan.status === "timeline-extended" ? "Timeline revised" : plan.status === "applied" ? "Recovery applied" : "No recovery needed"}
                      </span>
                    </span>
                    <span className="text-[8px] font-black uppercase text-[#2E7D4F]">
                      {plan.impactStatus === "reduced-buffer" ? "Buffer reduced" : plan.status === "applied" ? "Adjusted" : "On track"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {hasPendingRecovery && healedPlans.length === 0 && (
            <button
              type="button"
              onClick={handleNotNow}
              className="w-full rounded-xl border border-[#D9CEC5] bg-white py-3 text-[10px] font-black text-[#7C2230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C2230]"
            >
              Not now
            </button>
          )}
        </main>
      )}
    </div>
  );
}
