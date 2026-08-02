import { BarChart3, ClipboardList, DollarSign } from 'lucide-react';
import { getAgentEvidence } from '../data/strategySnapshot.js';

export default function AgentSynthesisCard({ snapshot }) {
  if (!snapshot) return null;

  const rows = [
    { id: 'cashflow', label: 'Cashflow', Icon: DollarSign, color: 'text-[#8B1A22]', copy: `Protected liquidity with ${getAgentEvidence(snapshot, 'cashflow')}` },
    { id: 'yield', label: 'Asset Yield', Icon: BarChart3, color: 'text-[#1F7A4D]', copy: `Improved return potential through ${getAgentEvidence(snapshot, 'yield')}` },
    { id: 'sequencing', label: 'Sequencing', Icon: ClipboardList, color: 'text-[#B4632A]', copy: `Aligned ${getAgentEvidence(snapshot, 'sequencing')} with the goal timeline` },
  ];

  return (
    <section className="shrink-0 rounded-[18px] border border-[#E4D8CE] bg-white/75 p-4 shadow-sm backdrop-blur-md">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[#7C2230]">How the agents shaped this plan</div>
      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-[#5F5550]">
        The final strategy combines safety, return potential, and milestone timing.
      </p>
      <div className="mt-3 divide-y divide-[#EEE6DF]">
        {rows.map(({ id, label, Icon, color, copy }) => (
          <div key={id} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F4EF]">
              <Icon size={12} className={color} />
            </span>
            <span className="min-w-0">
              <strong className="block text-[10px] text-[#2B2320]">{label}</strong>
              <span className="block text-[9px] leading-relaxed text-[#756A63]">{copy}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
