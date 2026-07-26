import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Coins, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatSGD, getMilestonePlan } from "../data/milestonePlans";
import {
  getAllocationImpact,
  getAllocationReason,
  getPersonalizedRecommendationReason,
  getPlanOpportunity,
  getProductAllocationReason,
  getRecommendedPlan,
  getWeightedAllocations,
  scaleAllocationUses,
} from "../data/planOpportunities";

export default function OpportunityDetailPage() {
  const {
    activePlanId, setActivePlanId, setPage, user, createdPlans,
    planAdjustments, opportunityDecisions, decideOpportunity,
  } = useApp();
  const opportunity = getPlanOpportunity();
  const plans = useMemo(
    () => (createdPlans.length ? createdPlans : [activePlanId]).map((id) => getMilestonePlan(id, planAdjustments)),
    [activePlanId, createdPlans, planAdjustments],
  );
  const recommended = getRecommendedPlan(plans);
  const handled = Object.values(opportunityDecisions).some((item) => item.opportunityId === opportunity.id);
  const [mode, setMode] = useState("best");
  const [allocationBudget, setAllocationBudget] = useState(opportunity.sourceAmount);
  const [custom, setCustom] = useState(
    Object.fromEntries(plans.map((plan) => [plan.id, plan.id === recommended?.id ? opportunity.sourceAmount : 0])),
  );
  const [expandedProductPlans, setExpandedProductPlans] = useState(
    () => new Set(recommended ? [recommended.id] : []),
  );
  const allocations = mode === "best"
    ? [{ planId: recommended.id, amount: allocationBudget, monthsSaved: getAllocationImpact(recommended, allocationBudget).monthsSaved }]
    : mode === "balanced"
      ? getWeightedAllocations(plans, allocationBudget)
      : plans
        .map((plan) => ({
          planId: plan.id,
          amount: Number(custom[plan.id]) || 0,
          monthsSaved: getAllocationImpact(plan, Number(custom[plan.id]) || 0).monthsSaved,
        }))
        .filter((item) => item.amount > 0);
  const total = allocations.reduce((sum, item) => sum + item.amount, 0);
  const returnedAmount = Math.max(0, opportunity.sourceAmount - total);
  const valid = total > 0
    && total <= opportunity.sourceAmount
    && allocations.length > 0
    && allocations.every((item) => Number.isInteger(item.amount) && item.amount >= 0);

  const accept = () => {
    if (!valid) return;
    if (decideOpportunity(activePlanId, opportunity, "accepted", allocations)) {
      setActivePlanId(allocations[0].planId);
      setPage("plan-milestones");
    }
  };

  const toggleProductPlan = (planId) => {
    setExpandedProductPlans((current) => {
      const next = new Set(current);
      if (next.has(planId)) next.delete(planId);
      else next.add(planId);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage("plan-dashboard")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm"><ArrowLeft size={18} /></button>
          <div><div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8A7F78]">Agent Owl allocation</div><h1 className="text-[18px] font-black">Compare your plans</h1></div>
        </div>
      </header>

      <main className="space-y-4 px-4 pb-28 pt-4">
        <section className="relative overflow-hidden rounded-[24px] bg-[#641D29] p-5 text-white">
          <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
          <div className="text-[9px] font-black uppercase tracking-wider text-white/60">Bonus received</div>
          <div className="mt-1 text-[36px] font-black text-[#FFE19A]">S$8,000</div>
          <div className="mt-3 rounded-[12px] bg-white/10 px-3 py-2.5">
            <div className="text-[8px] font-black uppercase tracking-wider text-white/55">Detected by Agent Owl</div>
            <p className="mt-1 text-[10px] font-bold">Salary bonus credited to your OCBC 360 Account</p>
            <p className="mt-0.5 text-[8.5px] text-white/65">24 Jul 2026 · Cleared and available</p>
          </div>
          <p className="mt-3 text-[11px] text-white/75">Owl noticed this was above your usual monthly income and compared where it could help most. Nothing moves until you confirm.</p>
        </section>

        {recommended && mode === "best" && (
          <section className="rounded-[20px] border border-[#E8DED5] bg-white p-4">
            <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#7C2230]">Why Owl recommends this plan</div>
            <h2 className="mt-1 text-[14px] font-black">{recommended.goalName} needs this opportunity most</h2>
            <p className="mt-2 text-[9.5px] leading-relaxed text-[#6F6560]">
              {getPersonalizedRecommendationReason(recommended, user?.name)}
            </p>
          </section>
        )}

        <section>
          <h2 className="px-1 text-[13px] font-extrabold">Choose an allocation approach</h2>
          <div className="mt-2 space-y-2">
            {[
              ["best", "Best plan first", `${formatSGD(allocationBudget)} to ${recommended.goalName}`, "Owl recommendation"],
              ["balanced", "Owl balanced split", "Need-weighted across your active plans", "Recommended split"],
              ["custom", "Custom split", "Choose any amount across your plans", "Your choice"],
            ].map(([id, title, description, label]) => (
              <button key={id} onClick={() => setMode(id)} className={`w-full rounded-[16px] border p-3 text-left ${mode === id ? "border-[#7C2230] bg-[#FFF8F4] ring-1 ring-[#7C2230]" : "border-[#E8DED5] bg-white"}`}>
                <div className="flex justify-between gap-3">
                  <div><span className="text-[8px] font-black uppercase text-[#9A641E]">{label}</span><div className="mt-0.5 text-[12px] font-extrabold">{title}</div><p className="mt-0.5 text-[9.5px] text-[#756A63]">{description}</p></div>
                  {mode === id && <Check size={16} className="text-[#7C2230]" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {mode !== "custom" && (
          <section className="rounded-[18px] border border-[#E8DED5] bg-white p-3.5">
            <label className="flex items-center justify-between gap-3">
              <span>
                <strong className="block text-[11px]">Amount to put toward your plans</strong>
                <span className="mt-0.5 block text-[8.5px] text-[#756A63]">You do not need to use the full bonus.</span>
              </span>
              <span className="flex shrink-0 items-center rounded-lg border border-[#D9CEC5] px-2 py-1.5 focus-within:ring-2 focus-within:ring-[#7C2230]">
                <span className="text-[10px] text-[#8A7F78]">S$</span>
                <input
                  type="number"
                  min="1"
                  max={opportunity.sourceAmount}
                  step="1"
                  value={allocationBudget}
                  onChange={(event) => setAllocationBudget(Math.min(opportunity.sourceAmount, Math.max(0, Math.floor(Number(event.target.value) || 0))))}
                  className="w-16 bg-transparent text-right text-[11px] font-black outline-none"
                />
              </span>
            </label>
          </section>
        )}

        {mode === "custom" && (
          <section className="rounded-[18px] border border-[#E8DED5] bg-white p-3.5">
            {plans.map((plan, index) => (
              <label key={plan.id} className={`flex items-center justify-between gap-3 py-2 ${index ? "border-t border-[#EFE7E0]" : ""}`}>
                <span className="text-[10.5px] font-extrabold">{plan.goalName}</span>
                <span className="flex items-center rounded-lg border border-[#D9CEC5] px-2 py-1">
                  <span className="text-[10px] text-[#8A7F78]">S$</span>
                  <input type="number" min="0" step="1" value={custom[plan.id]} onChange={(event) => setCustom((current) => ({ ...current, [plan.id]: Math.max(0, Math.floor(Number(event.target.value) || 0)) }))} className="w-16 bg-transparent text-right text-[11px] font-black outline-none" />
                </span>
              </label>
            ))}
            <div className={`mt-2 text-right text-[9.5px] font-black ${valid ? "text-[#2E7D4F]" : "text-[#B14A3F]"}`}>Using {formatSGD(total)} of {formatSGD(opportunity.sourceAmount)}</div>
          </section>
        )}

        {returnedAmount > 0 && (
          <section className="rounded-[16px] border border-[#D8E3DA] bg-[#F2F8F3] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="block text-[10.5px] text-[#2E523A]">The rest returns to your account</strong>
                <p className="mt-1 text-[8.5px] leading-relaxed text-[#5B6F60]">After confirmation, this opportunity will be complete and the unused amount will go back to the {opportunity.sourceAccount} where the bonus was received.</p>
              </div>
              <strong className="shrink-0 text-[11px] text-[#2E7D4F]">{formatSGD(returnedAmount)}</strong>
            </div>
          </section>
        )}

        <section>
          <h2 className="px-1 text-[13px] font-extrabold">Projected plan impact</h2>
          <div className="mt-2 space-y-2">
            {allocations.map((allocation) => {
              const plan = plans.find((item) => item.id === allocation.planId);
              const impact = getAllocationImpact(plan, allocation.amount);
              return (
                <div key={plan.id} className="rounded-[16px] border border-[#CFE2D3] bg-[#F2F8F3] p-3">
                  <div className="flex justify-between"><strong className="text-[11px]">{plan.goalName}</strong><strong className="text-[11px] text-[#2E7D4F]">{formatSGD(allocation.amount)}</strong></div>
                  <p className="mt-1 text-[9.5px] text-[#597061]">{impact.currentProgress}% → {impact.newProgress}% funded · about {impact.monthsSaved} months faster</p>
                  {mode === "balanced" && (
                    <div className="mt-2 rounded-[10px] bg-white/65 px-2.5 py-2">
                      <div className="text-[8px] font-black uppercase tracking-wide text-[#2E7D4F]">{Math.round(allocation.amount / 80)}% of your bonus</div>
                      <p className="mt-0.5 text-[8.5px] leading-relaxed text-[#647369]">{getAllocationReason(plan, allocation.amount, total)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#E8DED5] bg-white p-4">
          <div className="flex items-center gap-2"><Coins size={17} className="text-[#2E7D4F]" /><h2 className="text-[13px] font-extrabold">How Owl would use the bonus</h2></div>
          {allocations.map((allocation) => {
            const plan = plans.find((item) => item.id === allocation.planId);
            const isExpanded = expandedProductPlans.has(plan.id);
            return (
              <div key={plan.id} className="mt-3 overflow-hidden rounded-[14px] border border-[#E8DED5]">
                <button type="button" aria-expanded={isExpanded} onClick={() => toggleProductPlan(plan.id)} className="flex w-full items-center justify-between gap-3 bg-[#FFFDFB] p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C2230]">
                  <span><strong className="block text-[10.5px]">{plan.goalName}</strong><span className="mt-0.5 block text-[8px] text-[#756A63]">Products, returns and Owl's reasoning</span></span>
                  <span className="flex shrink-0 items-center gap-2">
                    <strong className="text-[10px] text-[#2E7D4F]">{formatSGD(allocation.amount)}</strong>
                    <ChevronDown size={15} className={`text-[#7C2230] transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`} />
                  </span>
                </button>
                {isExpanded && (
                  <div className="border-t border-[#E8DED5] px-3 pb-2">
                    <p className="my-2 rounded-[10px] bg-[#FFF8EC] px-2.5 py-2 text-[8.5px] leading-relaxed text-[#795D32]"><strong>Why Owl chose this mix: </strong>{getProductAllocationReason(plan, user?.name)}</p>
                    {scaleAllocationUses(plan.id, allocation.amount).map((item) => (
                      <div key={item.product} className="border-t border-[#EFE7E0] py-2">
                        <div className="flex justify-between gap-3 text-[9.5px]"><span><strong className="block">{item.product}</strong><span className="text-[#756A63]">{item.purpose}</span></span><span className="shrink-0 font-black text-[#2E7D4F]">{formatSGD(item.amount)}</span></div>
                        <div className="mt-1.5 rounded-[8px] bg-[#F2F8F3] px-2 py-1.5 text-[8.5px] text-[#2E7D4F]">Projected +{formatSGD(item.projectedGain)} · {item.growthLabel}<span className="mt-0.5 block text-[7.5px] text-[#718076]">{item.assumption}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {!handled && (
          <section className="rounded-[20px] bg-white p-4">
            <button disabled={!valid} onClick={accept} className="w-full rounded-xl bg-[#7C2230] py-3 text-[12px] font-extrabold text-white disabled:opacity-40">Confirm allocation and finish</button>
            <button onClick={() => decideOpportunity(activePlanId, opportunity, "declined", []) && setPage("plan-dashboard")} className="mt-2 w-full rounded-xl border border-[#D9CEC5] py-3 text-[11px] font-extrabold">Keep bonus unallocated</button>
          </section>
        )}
      </main>
    </div>
  );
}
