// src/pages/PlanMilestonesPage.jsx
import { ChevronLeft, ChevronRight, Compass, Pencil } from "lucide-react";
import { useApp } from "../context/AppContext";
import sceneImg from "../assets/images/milestone-scene-clean.png";
import {
  getMilestonePlan,
  deriveOnTrack,
  getJourneyPosition,
  formatSGD,
} from "../data/milestonePlans";
import { buildPersonalizedPlanCopy } from "../data/personalizedPlanCopy";
import MilestoneNode from "../components/milestones/MilestoneNode";
import OnTrackCard, { MilestoneReflection, OnTrackDetails } from "../components/milestones/OnTrackCard";
import JourneyOverlay from "../components/milestones/JourneyOverlay";
import {
  AgentOwlImpactCard,
  RecommendedNextStepCard,
  SecurityFooter,
} from "../components/milestones/ImpactCards";

/**
 * Per-goal milestones page. Pass a `plan` (see milestonePlans.js for the shape);
 * defaults to the Wedding Fund seed so it renders standalone.
 *
 * Wire navigation through your AppContext router — e.g. call this from
 * PlanDetailsPage with the selected plan, and use onBack to return.
 */
export default function PlanMilestonesPage() {
  const { activePlanId, setPage, user } = useApp();
  const plan = getMilestonePlan(activePlanId);
  const onTrack = deriveOnTrack(plan.onTrack);
  const personalCopy = buildPersonalizedPlanCopy({ plan, userName: user?.name, onTrack });
  const count = plan.milestones.length;

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

        <div className="mt-2.5 flex items-center gap-2">
          <h1 className="m-0 text-[26px] font-extrabold text-[#2B2320]">{plan.goalName}</h1>
          <Pencil size={18} aria-hidden="true" className="text-[#8A7F78]" />
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
        <OnTrackDetails message={personalCopy.progressMessage} />
        <MilestoneReflection reflection={personalCopy.reflection} />

        <button
          onClick={() => setPage("plan-view")}
          className="w-full rounded-[18px] border border-[#E4D8CE] bg-white px-4 py-4 text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] active:scale-[0.99]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C2230]/10 text-[#7C2230]">
                <Compass size={19} />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A7F78]">Plan details</div>
                <div className="text-sm font-extrabold">{formatSGD(plan.monthlyContribution)}/month · {plan.planType}</div>
                <div className="mt-0.5 text-[10px] leading-snug text-[#8A7F78]">{plan.strategy}</div>
              </div>
            </div>
            <ChevronRight size={18} className="shrink-0 text-[#7C2230]" />
          </div>
        </button>

        <AgentOwlImpactCard impact={plan.impact} onSeeBreakdown={() => setPage("savings-breakdown")} />
        <RecommendedNextStepCard nextAction={personalCopy.nextAction} onReviewPlan={() => setPage("plan-view")} />
        <SecurityFooter />
      </div>
    </div>
  );
}
