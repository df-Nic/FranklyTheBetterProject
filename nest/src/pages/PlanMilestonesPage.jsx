// src/pages/PlanMilestonesPage.jsx
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Pencil, Sparkles, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useApp } from "../context/AppContext";
import sceneImg from "../assets/images/milestone-scene-clean.png";
import {
  getMilestonePlan,
  deriveOnTrack,
  getFundingJourneyProgress,
  getJourneyPosition,
  getJourneyProgressPosition,
  formatSGD,
} from "../data/milestonePlans";
import { buildPersonalizedPlanCopy } from "../data/personalizedPlanCopy";
import { applyOpportunityChanges, getPlanOpportunity } from "../data/planOpportunities";
import { getPlanActivity } from "../data/planActivity";
import MilestoneNode from "../components/milestones/MilestoneNode";
import OnTrackCard from "../components/milestones/OnTrackCard";
import JourneyOverlay from "../components/milestones/JourneyOverlay";
import {
  AgentOwlImpactCard,
} from "../components/milestones/ImpactCards";
import ReasoningLogCard from "../features/planSimulation/components/ReasoningLogCard";

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
    setActivePlanId,
    setPage,
    setPlanDetailOrigin,
    user,
    opportunityDecisions,
    opportunityNotice,
    setOpportunityNotice,
    planAdjustments,
    adjustPlan,
    planActivity,
    addPlanActivity,
    opportunityReveal,
    markOpportunityRevealViewed,
    opportunitySourceAmount,
    pendingPlan,
  } = useApp();
  const basePlan = getMilestonePlan(activePlanId, planAdjustments);
  const opportunity = getPlanOpportunity(opportunitySourceAmount);
  const decision = Object.values(opportunityDecisions || {}).find((item) =>
    item?.status === "accepted" && item?.allocations?.some((allocation) => allocation.planId === basePlan?.id));
  const updatedPlan = applyOpportunityChanges(basePlan, opportunity, decision) || basePlan;
  const revealUpdate = opportunityReveal?.opportunityId === decision?.opportunityId
    ? opportunityReveal?.updates?.find((item) => item.planId === activePlanId)
    : null;
  const revealViewed = Boolean(opportunityReveal?.viewedPlanIds?.includes(activePlanId));
  const reduceMotion = useReducedMotion();
  const [movingRevealPlanId, setMovingRevealPlanId] = useState(null);
  const [completedRevealPlanId, setCompletedRevealPlanId] = useState(null);
  const [visibleRevealPlanId, setVisibleRevealPlanId] = useState(null);
  const scrollContainerRef = useRef(null);
  const journeyRef = useRef(null);
  const showingMovingState = Boolean(
    revealUpdate
    && !revealViewed
    && !reduceMotion
    && movingRevealPlanId === activePlanId
    && completedRevealPlanId !== activePlanId,
  );
  const showingBeforeState = Boolean(
    revealUpdate
    && !revealViewed
    && !reduceMotion
    && movingRevealPlanId !== activePlanId
    && completedRevealPlanId !== activePlanId,
  );
  const plan = showingBeforeState
    ? basePlan
    : showingMovingState
      ? { ...basePlan, onTrack: updatedPlan?.onTrack }
      : updatedPlan;
  const onTrack = deriveOnTrack(plan?.onTrack);
  const activities = getPlanActivity({ plan, opportunity, decision, runtimeEvents: planActivity });
  const wasHealed = Boolean(planAdjustments?.[activePlanId]?.healed);
  const personalCopy = buildPersonalizedPlanCopy({
    plan, userName: user?.name, onTrack, recentActivity: activities[0], decision, wasHealed,
  });
  const count = (plan?.milestones || []).length;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(plan?.goalName || "");
  const showReveal = Boolean(revealUpdate && visibleRevealPlanId === activePlanId);
  const revealFundingPercentBefore = revealUpdate
    ? Math.min(1, (revealUpdate.before?.saved || 0) / Math.max(revealUpdate.before?.targetAmount || 1, 1))
    : 0;
  const revealFundingPercentAfter = revealUpdate
    ? Math.min(1, (revealUpdate.after?.saved || 0) / Math.max(revealUpdate.after?.targetAmount || 1, 1))
    : 0;
  const revealJourneyProgressBefore = revealUpdate
    ? getFundingJourneyProgress(
      revealUpdate.before?.milestones || [],
      revealUpdate.before?.saved || 0,
      revealUpdate.before?.targetAmount || 0,
    )
    : 0;
  const newlyCompletedMilestoneIndex = revealUpdate
    ? (revealUpdate.after?.milestones || []).findIndex((milestone, index) =>
      milestone?.state === "completed"
      && revealUpdate.before?.milestones?.[index]?.state !== "completed")
    : -1;
  const calculatedRevealJourneyProgressAfter = revealUpdate
    ? getFundingJourneyProgress(
      revealUpdate.after?.milestones || [],
      revealUpdate.after?.saved || 0,
      revealUpdate.after?.targetAmount || 0,
    )
    : 0;
  const revealJourneyProgressAfter = newlyCompletedMilestoneIndex >= 0
    ? newlyCompletedMilestoneIndex / Math.max((revealUpdate.after?.milestones || []).length - 1, 1)
    : calculatedRevealJourneyProgressAfter;
  const journeyProgress = showReveal
    ? showingBeforeState
      ? revealJourneyProgressBefore
      : revealJourneyProgressAfter
    : getFundingJourneyProgress(plan?.milestones || [], plan?.onTrack?.saved || 0, plan?.targetAmount || 0);

  useEffect(() => {
    if (!revealUpdate) return undefined;
    if (revealViewed) {
      if (visibleRevealPlanId !== null) setVisibleRevealPlanId(activePlanId);
      return undefined;
    }
    setVisibleRevealPlanId(activePlanId);
    const scrollFrame = window.requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      const journey = journeyRef.current;
      if (!container || !journey) return;
      const originalPosition = getJourneyProgressPosition(revealJourneyProgressBefore);
      const owlOffset = journey.offsetTop + journey.clientHeight * (originalPosition.y / 100);
      const targetTop = Math.min(
        Math.max(0, owlOffset - container.clientHeight * 0.68),
        Math.max(0, container.scrollHeight - container.clientHeight),
      );
      container.scrollTo({
        top: targetTop,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
    if (reduceMotion) {
      setMovingRevealPlanId(null);
      setCompletedRevealPlanId(activePlanId);
      markOpportunityRevealViewed(activePlanId);
      return () => window.cancelAnimationFrame(scrollFrame);
    }
    setMovingRevealPlanId(null);
    setCompletedRevealPlanId(null);
    const moveTimer = window.setTimeout(() => {
      setMovingRevealPlanId(activePlanId);
    }, 1200);
    const completeTimer = window.setTimeout(() => {
      setCompletedRevealPlanId(activePlanId);
      markOpportunityRevealViewed(activePlanId);
    }, 2800);
    return () => {
      window.cancelAnimationFrame(scrollFrame);
      window.clearTimeout(moveTimer);
      window.clearTimeout(completeTimer);
    };
  }, [activePlanId, revealUpdate?.planId, revealViewed, reduceMotion]);

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
    <div ref={scrollContainerRef} className="h-full overflow-y-auto no-scrollbar bg-[#F9F4EE] text-[#2B2320]">
      {/* Header */}
      <div className="px-[18px] pb-1.5 pt-3.5">
        <div className="flex items-center justify-between text-[#7C2230]">
          <button onClick={() => setPage("plan-dashboard")} aria-label="Back to my plans" className="rounded-full p-1 active:scale-90">
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Plan journey</span>
        </div>

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

        {showReveal && opportunityReveal.updates.length > 1 && (
          <div className="mt-4">
            <div className="text-[8.5px] font-black uppercase tracking-[0.13em] text-[#8A7F78]">
              Updated plan {opportunityReveal.updates.findIndex((item) => item.planId === activePlanId) + 1} of {opportunityReveal.updates.length}
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {opportunityReveal.updates.map((item) => {
                const itemPlan = getMilestonePlan(item.planId, planAdjustments);
                const selected = item.planId === activePlanId;
                const viewed = opportunityReveal.viewedPlanIds.includes(item.planId);
                return (
                  <button
                    key={item.planId}
                    type="button"
                    onClick={() => setActivePlanId(item.planId)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-[9.5px] font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C2230] ${
                      selected ? "border-[#7C2230] bg-[#7C2230] text-white" : "border-[#D9CEC5] bg-white text-[#6F6560]"
                    }`}
                  >
                    {viewed && !selected ? "Viewed: " : ""}{itemPlan.goalName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {showReveal && (
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-3 rounded-[18px] border border-[#D8C481] bg-[#FFF8DC] p-3.5 text-[#5E4920]"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE9A8] text-[#8B641B]"><Sparkles size={15} /></span>
            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.13em] text-[#9A641E]">
                {showingBeforeState
                  ? "Preparing your journey"
                  : showingMovingState
                    ? "Moving your progress"
                    : "Journey updated"}
              </div>
              <div className="text-[11.5px] font-black">Your opportunity moved this plan forward</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 divide-x divide-[#E6D39E] rounded-[12px] bg-white/65 py-2.5 text-center">
            <div className="px-1.5">
              <div className="text-[8px] font-bold text-[#8A7F78]">Allocated</div>
              <div className="mt-0.5 text-[10.5px] font-black">{formatSGD(revealUpdate.amount)}</div>
            </div>
            <div className="px-1.5">
              <div className="text-[8px] font-bold text-[#8A7F78]">Funded</div>
              <div className="mt-0.5 text-[10.5px] font-black">{Math.round(revealFundingPercentBefore * 100)}% to {Math.round(revealFundingPercentAfter * 100)}%</div>
            </div>
            <div className="px-1.5">
              <div className="text-[8px] font-bold text-[#8A7F78]">Time saved</div>
              <div className="mt-0.5 text-[10.5px] font-black">{revealUpdate.monthsSaved ? `${revealUpdate.monthsSaved} mo` : "Stronger"}</div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Scene with on-track overlay + milestone rail */}
      <div ref={journeyRef} className="relative mt-1.5 w-full" style={{ aspectRatio: "853 / 1844" }}>
        <img src={sceneImg} alt="Goal journey" className="absolute inset-0 h-full w-full object-cover" />

        <OnTrackCard onTrack={onTrack} statusLabel={personalCopy.statusLabel} />
        <JourneyOverlay
          milestones={plan.milestones}
          fundingProgress={journeyProgress}
          fromFundingProgress={showingMovingState ? revealJourneyProgressBefore : undefined}
        />

        {plan.milestones.map((m, i) => (
          <MilestoneNode
            key={m.id}
            milestone={m}
            position={getJourneyPosition(i, count)}
            previousDate={showReveal && !showingBeforeState && !showingMovingState
              ? revealUpdate.before.milestones.find((item) => item.id === m.id)?.date
              : null}
            previousState={showReveal && !showingBeforeState && !showingMovingState
              ? revealUpdate.before.milestones.find((item) => item.id === m.id)?.state
              : null}
          />
        ))}
      </div>

      {/* Cards */}
      <div className="-mt-1 flex flex-col gap-3.5 px-4 pb-28 pt-3.5">
        {opportunityNotice?.planId === plan.id && !showReveal && (
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

        <ReasoningLogCard
          scriptId={pendingPlan?.script?.planId === activePlanId ? pendingPlan.script.id : null}
          planId={activePlanId}
          plan={plan}
          onOpen={() => setPage("reasoning-log")}
        />

        <button
          onClick={() => {
            setPlanDetailOrigin("plan-milestones");
            setPage("plan-details");
          }}
          className="flex w-full items-center justify-between rounded-[14px] px-1 py-2 text-left text-[12px] font-extrabold text-[#7C2230] active:scale-[0.99]"
        >
          <span>View plan breakdown</span>
          <ChevronRight size={16} className="shrink-0" />
        </button>
      </div>
    </div>
  );
}
