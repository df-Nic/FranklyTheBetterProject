import { ArrowLeft, CalendarDays, Coins, Target } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatSGD, getMilestonePlan } from "../data/milestonePlans";
import { PLANS_DATA } from "../data/planTemplates";

export default function PlanViewPage() {
  const { activePlanId, setPage, planAdjustments, customPlanData } = useApp();
  const plan = getMilestonePlan(activePlanId, planAdjustments);
  const template = PLANS_DATA[activePlanId] ?? PLANS_DATA.default;
  const custom = customPlanData[activePlanId] ?? {};
  const milestones = custom.subgoals?.length ? custom.subgoals : plan.milestones.filter((item) => item.id !== "created");
  const categories = custom.confirmedCategories?.length ? custom.confirmedCategories : template.categories;
  const isLumpSum = custom.confirmedPaymentStrategy === "lump-sum" || plan.paymentStrategy === "lump-sum";

  const isStaggered = custom.paymentStrategy ? custom.paymentStrategy === 'staggered' : true;

  return (
    <div className="flex-1 w-full min-h-0 overflow-y-auto scroll-ios touch-pan-y bg-[#F9F4EE] text-[#2B2320] no-scrollbar">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#EAE0D7] bg-[#F9F4EE]/95 px-4 pb-3 pt-5 backdrop-blur-xl">
        <button onClick={() => setPage("plan-milestones")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C2230] shadow-sm"><ArrowLeft size={18} /></button>
        <div><div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8A7F78]">{plan.goalName}</div><h1 className="text-[18px] font-black">Plan breakdown</h1></div>
      </header>
      <main className="space-y-4 px-4 pb-28 pt-4">
        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-[16px] border border-[#E8DED5] bg-white p-3"><Target size={15} className="text-[#7C2230]" /><div className="mt-2 text-[9px] text-[#8A7F78]">Target</div><div className="text-[14px] font-black">{formatSGD(plan.targetAmount)}</div></div>
          <div className="rounded-[16px] border border-[#E8DED5] bg-white p-3"><CalendarDays size={15} className="text-[#7C2230]" /><div className="mt-2 text-[9px] text-[#8A7F78]">Goal date</div><div className="text-[14px] font-black">{plan.goalDate}</div></div>
          <div className="col-span-2 rounded-[16px] border border-[#E8DED5] bg-white p-3"><Coins size={15} className="text-[#7C2230]" /><div className="mt-2 flex justify-between text-[10px]"><span className="text-[#8A7F78]">{isLumpSum ? "One-time contribution" : "Monthly contribution"}</span><strong>{formatSGD(isLumpSum ? plan.lumpSumContribution || plan.targetAmount : plan.monthlyContribution)}</strong></div><div className="mt-1 flex justify-between text-[10px]"><span className="text-[#8A7F78]">Strategy</span><strong className="max-w-[210px] text-right">{plan.strategy}</strong></div></div>
        </section>

        <section>
          <h2 className="px-1 text-[12px] font-black uppercase tracking-wider text-[#8A7F78]">Milestones</h2>
          <div className="mt-2 overflow-hidden rounded-[18px] border border-[#E8DED5] bg-white">
            {milestones.map((item, index) => (
              <div key={item.id ?? index} className={`grid ${isStaggered && item.date ? 'grid-cols-[1fr_auto_auto]' : 'grid-cols-[1fr_auto]'} items-center gap-3 p-3 ${index ? "border-t border-[#EFE7E0]" : ""}`}>
                <span className="text-[10.5px] font-extrabold">{item.name}</span>
                {item.amount != null && <span className="text-[9.5px] font-bold text-[#7C2230]">{formatSGD(item.amount)}</span>}
                {isStaggered && item.date && <span className="text-[9px] text-[#8A7F78]">{item.date}</span>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="px-1 text-[12px] font-black uppercase tracking-wider text-[#8A7F78]">Products and actions</h2>
          <div className="mt-2 space-y-3">
            {categories.map((category) => <article key={category.id} className="overflow-hidden rounded-[18px] border border-[#E8DED5] bg-white"><div className="bg-[#F8F3EE] px-3 py-2 text-[10px] font-black">{category.name}</div>{category.actions.map((action, index) => <div key={action.id} className={`p-3 ${index ? "border-t border-[#EFE7E0]" : ""}`}><div className="flex justify-between gap-3"><strong className="text-[10.5px]">{action.name}</strong><span className="shrink-0 text-[9.5px] font-black text-[#7C2230]">{formatSGD(action.baseVal)}</span></div><p className="mt-1 text-[9.5px] leading-relaxed text-[#756A63]">{action.desc}</p></div>)}</article>)}
          </div>
        </section>
        <p className="px-1 text-[9px] leading-relaxed text-[#8A7F78]">This is your accepted plan breakdown. Rates, eligibility, and product suitability are reviewed before execution.</p>
      </main>
    </div>
  );
}
