import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, Coins, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatSGD, getMilestonePlan } from "../data/milestonePlans";
import {
  getAllocationImpact, getAllocationUses, getPlanOpportunity, getRecommendedPlan,
} from "../data/planOpportunities";

export default function OpportunityDetailPage() {
  const {
    activePlanId, setActivePlanId, setPage, createdPlans, planAdjustments, opportunityDecisions, decideOpportunity,
  } = useApp();
  const opportunity = getPlanOpportunity();
  const plans = useMemo(
    () => (createdPlans.length ? createdPlans : [activePlanId]).map((id) => getMilestonePlan(id, planAdjustments)),
    [activePlanId, createdPlans, planAdjustments],
  );
  const recommended = getRecommendedPlan(plans);
  const existingDecision = Object.values(opportunityDecisions).find((item) => item.opportunityId === opportunity.id);
  const [selectedPlanId, setSelectedPlanId] = useState(existingDecision?.destinationPlanId ?? recommended?.id ?? activePlanId);
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? recommended;
  const selectedImpact = getAllocationImpact(selectedPlan, opportunity.sourceAmount);
  const allocationUses = getAllocationUses(selectedPlan?.id);

  const accept = () => {
    if (decideOpportunity(activePlanId, opportunity, "accepted", selectedPlan.id, selectedImpact)) {
      setActivePlanId(selectedPlan.id);
      setPage("plan-milestones");
    }
  };

  const decline = () => {
    if (decideOpportunity(activePlanId, opportunity, "declined", activePlanId)) setPage("plan-milestones");
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage("plan-milestones")} aria-label="Back to plan journey" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm active:scale-90">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8A7F78]">Agent Owl allocation</div>
            <h1 className="text-[18px] font-black">Extra funds detected</h1>
          </div>
        </div>
      </header>

      <main className="space-y-3.5 px-4 pb-32 pt-4">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[24px] bg-[#641D29] p-5 text-white shadow-[0_12px_28px_rgba(84,24,35,0.22)]">
          <Sparkles className="absolute -right-5 -top-5 h-28 w-28 text-white/[0.07]" />
          <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em]">Bonus received</span>
          <div className="mt-3 text-[38px] font-black tracking-tight text-[#FFE19A]">{formatSGD(opportunity.sourceAmount)}</div>
          <h2 className="mt-1 text-[20px] font-black">Your extra money can bring a goal closer</h2>
          <p className="mt-2 text-[11.5px] leading-relaxed text-white/78">{opportunity.summary}</p>
          <div className="mt-4 flex items-center gap-2 rounded-[14px] bg-white/10 p-3">
            <WalletCards size={18} className="text-[#FFE19A]" />
            <div className="text-[10.5px]">
              <span className="block font-extrabold">From your 360 Account</span>
              <span className="text-white/65">Salary bonus credited 24 Jul 2026</span>
            </div>
          </div>
        </motion.section>

        <section className="rounded-[20px] border border-[#E8DED5] bg-white p-4">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[#9A8D84]">Owl’s recommendation</div>
          <div className="mt-2 flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBEFD9] text-[#9A641E]"><TrendingUp size={17} /></span>
            <div>
              <h2 className="text-[15px] font-extrabold">{recommended.goalName} needs it most</h2>
              <p className="mt-1 text-[10.5px] leading-relaxed text-[#756A63]">
                Owl ranked your plans by remaining funding gap and whether they are behind pace. You can choose another plan below.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 px-1">
            <h2 className="text-[13px] font-extrabold">Choose where the bonus goes</h2>
            <p className="mt-0.5 text-[10px] text-[#756A63]">Preview the effect before anything changes.</p>
          </div>
          <div className="space-y-2.5">
            {plans.map((plan) => {
              const impact = getAllocationImpact(plan, opportunity.sourceAmount);
              const selected = plan.id === selectedPlanId;
              return (
                <button key={plan.id} onClick={() => setSelectedPlanId(plan.id)} className={`w-full rounded-[17px] border p-3.5 text-left transition ${selected ? "border-[#7C2230] bg-[#FFF9F4] ring-1 ring-[#7C2230]" : "border-[#E8DED5] bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-extrabold">{plan.goalName}</span>
                        {plan.id === recommended.id && <span className="rounded-full bg-[#FBEFD9] px-1.5 py-0.5 text-[7px] font-black uppercase text-[#9A641E]">Recommended</span>}
                      </div>
                      <p className="mt-1 text-[9.5px] text-[#756A63]">{impact.currentProgress}% → <strong className="text-[#2E7D4F]">{impact.newProgress}% funded</strong> · about {impact.monthsSaved} months faster</p>
                    </div>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#7C2230] bg-[#7C2230] text-white" : "border-[#CDBFB4]"}`}>{selected && <Check size={12} />}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#E8DED5] bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7F1E9] text-[#2E7D4F]"><Coins size={17} /></span>
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7B8D80]">How Owl would use the bonus</div>
              <h2 className="mt-1 text-[14px] font-extrabold">Allocation for {selectedPlan.goalName}</h2>
            </div>
          </div>
          <div className="mt-3 overflow-hidden rounded-[14px] border border-[#EAE0D7]">
            {allocationUses.map((item, index) => (
              <div key={item.product} className={`p-3 ${index ? "border-t border-[#EFE7E0]" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10.5px] font-extrabold text-[#3F3732]">{item.product}</div>
                    <div className="mt-0.5 text-[9.5px] leading-relaxed text-[#756A63]">{item.purpose}</div>
                  </div>
                  <span className="shrink-0 text-[11px] font-black text-[#2E7D4F]">{formatSGD(item.amount)}</span>
                </div>
                <div className="mt-2 rounded-[10px] bg-[#F2F8F3] px-2.5 py-2">
                  <div className="text-[9.5px] font-extrabold text-[#2E7D4F]">
                    Projected +{formatSGD(item.projectedGain)} {item.growthLabel}
                  </div>
                  <div className="mt-0.5 text-[8.5px] text-[#718076]">{item.assumption}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[9px] leading-relaxed text-[#8A7F78]">
            Projections are illustrative, not guaranteed. Product suitability and current rates are checked again before funds move.
          </p>
        </section>

        {!existingDecision ? (
          <section className="rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(70,45,32,0.06)]">
            <button onClick={accept} className="w-full rounded-xl bg-[#7C2230] px-4 py-3 text-[13px] font-extrabold text-white">
              Allocate to {selectedPlan.goalName}
            </button>
            <button onClick={decline} className="mt-2 w-full rounded-xl border border-[#D9CEC5] px-4 py-3 text-[12px] font-extrabold text-[#5E514A]">
              Keep the bonus unallocated
            </button>
          </section>
        ) : (
          <section className="rounded-[18px] border border-[#CFE2D3] bg-white p-4 text-center">
            <CheckCircle2 className="mx-auto text-[#2E7D4F]" />
            <h2 className="mt-2 text-sm font-extrabold">Allocation recorded</h2>
          </section>
        )}
      </main>
    </div>
  );
}
