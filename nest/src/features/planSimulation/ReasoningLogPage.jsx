import { useEffect, useState } from 'react';
import { ChevronLeft, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { getReasoningLog, listReasoningLogs } from '../../lib/reasoningLogStore.js';
import { getMilestonePlan } from '../../data/milestonePlans.js';
import { buildCompletedPlanScript } from './engine/buildCompletedPlanScript.js';
import ReasoningLogReplay from './components/ReasoningLogReplay.jsx';

export default function ReasoningLogPage() {
  const { activePlanId, pendingPlan, planAdjustments, navigate } = useApp();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const pendingScriptId = pendingPlan?.script?.planId === activePlanId
      ? pendingPlan.script.id
      : null;
    const exact = pendingScriptId ? getReasoningLog(pendingScriptId) : null;
    const latestForPlan = listReasoningLogs().find((candidate) => candidate.script?.planId === activePlanId);
    const completedPlan = getMilestonePlan(activePlanId, planAdjustments);
    const completedPlanScript = buildCompletedPlanScript(completedPlan);
    setLog(exact ?? latestForPlan ?? (completedPlanScript ? { script: completedPlanScript } : null));
  }, [activePlanId, pendingPlan, planAdjustments]);

  const script = log?.script;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-[#F9F4EE] text-[#2B2320]">
      <header className="sticky top-0 z-30 border-b border-[#E4D8CE] bg-[#F9F4EE]/95 px-[18px] pb-3 pt-3.5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-[#7C2230]">
          <button type="button" onClick={() => navigate('plan-milestones')} aria-label="Back to plan journey" className="rounded-full p-1 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C2230]">
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Decision record</span>
          <span className="w-[30px]" />
        </div>
        <h1 className="mt-2.5 text-[26px] font-extrabold leading-tight">Plan decision record</h1>
        <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#6D625B]">
          Review why the agents selected this strategy for {script?.request?.goalLabel ?? 'your goal'}.
        </p>
      </header>

      <main className="flex flex-col gap-3.5 px-4 pb-12 pt-4">
        {script ? (
          <ReasoningLogReplay script={script} />
        ) : (
          <section className="rounded-[18px] border border-[#E4D8CE] bg-white p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Scale className="mx-auto text-[#9A8F87]" size={24} />
            <h2 className="mt-2 text-[14px] font-extrabold">Decision record unavailable</h2>
            <p className="mt-1 text-[11px] text-[#8A7F78]">Complete a plan simulation to create this record.</p>
          </section>
        )}
      </main>
    </div>
  );
}
