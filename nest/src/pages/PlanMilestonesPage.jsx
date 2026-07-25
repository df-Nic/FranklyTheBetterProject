// src/pages/PlanMilestonesPage.jsx
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import sceneImg from "../assets/images/milestone-scene-clean.png";
import {
  getMilestonePlan,
  deriveOnTrack,
  getJourneyPosition,
  formatSGD,
} from "../data/milestonePlans";
import { buildPersonalizedPlanCopy } from "../data/personalizedPlanCopy";
import { applyOpportunityChanges, getPlanOpportunity, getRecommendedPlan } from "../data/planOpportunities";
import { getPlanActivity } from "../data/planActivity";
import MilestoneNode from "../components/milestones/MilestoneNode";
import OnTrackCard from "../components/milestones/OnTrackCard";
import JourneyOverlay from "../components/milestones/JourneyOverlay";
import {
  AgentOwlImpactCard,
  OpportunityCard,
} from "../components/milestones/ImpactCards";

/**
 * Per-goal milestones page. Pass a `plan` (see milestonePlans.js for the shape);
 * defaults to the Wedding Fund seed so it renders standalone.
 *
 * Wire navigation through your AppContext router — e.g. call this from
 * PlanDetailsPage with the selected plan, and use onBack to return.
 */
export default function PlanMilestonesPage() {
  const {
    activePlanId,
    setPage,
    user,
    opportunityDecisions,
    opportunityNotice,
    setOpportunityNotice,
    planAdjustments,
    adjustPlan,
    planActivity,
    addPlanActivity,
    createdPlans,
  } = useApp();
  const basePlan = getMilestonePlan(activePlanId, planAdjustments);
  const opportunity = getPlanOpportunity(basePlan.id);
  const decision = opportunityDecisions[basePlan.id]
    ?? Object.values(opportunityDecisions).find((item) => item.status === "accepted" && item.destinationPlanId === basePlan.id);
  const plan = applyOpportunityChanges(basePlan, opportunity, decision);
  const candidatePlans = (createdPlans.length ? createdPlans : [basePlan.id])
    .map((id) => getMilestonePlan(id, planAdjustments));
  const recommendedPlan = getRecommendedPlan(candidatePlans);
  const sourceDecision = Object.values(opportunityDecisions).find((item) => item.opportunityId === opportunity.id);
  const showOpportunity = recommendedPlan?.id === basePlan.id && !sourceDecision;
  const onTrack = deriveOnTrack(plan.onTrack);
  const activities = getPlanActivity({ plan, opportunity, decision, runtimeEvents: planActivity });
  const wasHealed = Boolean(planAdjustments?.[activePlanId]?.healed);
  const personalCopy = buildPersonalizedPlanCopy({
    plan, userName: user?.name, onTrack, recentActivity: activities[0], decision, wasHealed,
  });
  const count = plan.milestones.length;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(plan.goalName);

  useEffect(() => {
    if (!isEditingTitle) setTitleDraft(plan.goalName);
  }, [plan.goalName, isEditingTitle]);

  const cancelTitleEdit = () => {
    setTitleDraft(plan.goalName);
    setIsEditingTitle(false);
  };

  const saveTitle = () => {
    const goalName = titleDraft.trim();
    if (!goalName) return;
    if (goalName !== plan.goalName) {
      const previousName = plan.goalName;
      adjustPlan(activePlanId, { goalName });
      addPlanActivity(activePlanId, {
        id: `rename-${Date.now()}`,
        actor: "user",
        type: "rename",
        title: "Plan renamed",
        description: `You renamed “${previousName}” to “${goalName}”.`,
        timestamp: new Date().toISOString(),
        status: "completed",
      });
    }
    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (planAdjustments?.[activePlanId]?.healed) {
      // Clear the healer badge status immediately upon viewing the plan details
      adjustPlan(activePlanId, { healed: false });
    }
  }, [activePlanId, planAdjustments, adjustPlan]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-[#F9F4EE] text-[#2B2320]">
      {/* Header */}
      <div className="px-[18px] pb-1.5 pt-3.5">
        <div className="flex items-center justify-between text-[#7C2230]">
          <button onClick={() => setPage("plan-dashboard")} aria-label="Back to my plans" className="rounded-full p-1 active:scale-90">
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Plan journey</span>
        </div>

        <OpportunityCard
          opportunity={showOpportunity ? opportunity : null}
          decision={decision}
          onExplore={() => setPage("opportunity-detail")}
        />

        <div className="mt-2.5 flex min-h-9 items-center gap-2">
          {isEditingTitle ? (
            <>
              <input
                autoFocus
                value={titleDraft}
                maxLength={60}
                aria-label="Plan title"
                onChange={(event) => setTitleDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveTitle();
                  if (event.key === "Escape") cancelTitleEdit();
                }}
                className="min-w-0 flex-1 rounded-lg border border-[#CBB9AB] bg-white px-2.5 py-1 text-[21px] font-extrabold text-[#2B2320] outline-none focus-visible:ring-2 focus-visible:ring-[#7C2230]"
              />
              <button onClick={saveTitle} disabled={!titleDraft.trim()} aria-label="Save plan title" className="rounded-full bg-[#2E7D4F] p-1.5 text-white disabled:opacity-40">
                <Check size={15} />
              </button>
              <button onClick={cancelTitleEdit} aria-label="Cancel title editing" className="rounded-full bg-white p-1.5 text-[#7C2230] shadow-sm">
                <X size={15} />
              </button>
            </>
          ) : (
            <>
              <h1 className="m-0 min-w-0 break-words text-[26px] font-extrabold leading-tight text-[#2B2320]">{plan.goalName}</h1>
              <button onClick={() => setIsEditingTitle(true)} aria-label={`Edit ${plan.goalName} title`} className="shrink-0 rounded-full p-1.5 text-[#7C2230] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C2230]">
                <Pencil size={15} />
              </button>
            </>
          )}
        </div>

        <p className="mt-2 max-w-[340px] text-[12.5px] font-medium leading-relaxed text-[#6D625B]">
          {personalCopy.introduction}
        </p>

        <div className="mt-3 flex gap-12">
          <div>
            <div className="text-xs text-[#8A7F78]">Target amount</div>
            <div className="text-base font-bold">{formatSGD(plan.targetAmount)}</div>
          </div>
          <div>
            <div className="text-xs text-[#8A7F78]">Goal date</div>
            <div className="text-base font-bold">{plan.goalDate}</div>
          </div>
        </div>

      </div>

      {/* Scene with on-track overlay + milestone rail */}
      <div className="relative mt-1.5 w-full" style={{ aspectRatio: "853 / 1844" }}>
        <img src={sceneImg} alt="Goal journey" className="absolute inset-0 h-full w-full object-cover" />

        <OnTrackCard onTrack={onTrack} statusLabel={personalCopy.statusLabel} />
        <JourneyOverlay milestones={plan.milestones} />

        {plan.milestones.map((m, i) => (
          <MilestoneNode key={m.id} milestone={m} position={getJourneyPosition(i, count)} />
        ))}
      </div>

      {/* Cards */}
      <div className="-mt-1 flex flex-col gap-3.5 px-4 pb-28 pt-3.5">
        {opportunityNotice?.planId === plan.id && (
          <div className="flex items-start gap-2.5 rounded-[16px] border border-[#CFE2D3] bg-[#EDF7EF] p-3.5 text-[#2E523A]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2E7D4F]" />
            <div className="flex-1 text-[11.5px] font-semibold leading-relaxed">{opportunityNotice.message}</div>
            <button onClick={() => setOpportunityNotice(null)} aria-label="Dismiss confirmation" className="rounded-full p-0.5">
              <X size={14} />
            </button>
          </div>
        )}
        <AgentOwlImpactCard
          latestActivity={activities[0]}
          eventCount={activities.length}
          onSeeBreakdown={() => setPage("savings-breakdown")}
        />

        <button
          onClick={() => setPage("plan-view")}
          className="flex w-full items-center justify-between rounded-[14px] px-1 py-2 text-left text-[12px] font-extrabold text-[#7C2230] active:scale-[0.99]"
        >
          <span>View plan strategy and forecast</span>
          <ChevronRight size={16} className="shrink-0" />
        </button>
      </div>
    </div>
  );
}
