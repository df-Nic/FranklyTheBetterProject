import { BarChart3, ClipboardList, DollarSign } from 'lucide-react';
import ArenaStage from './ArenaStage.jsx';
import LeverBadge from './LeverBadge.jsx';
import ArenaSpeechBubble from './ArenaSpeechBubble.jsx';

const BADGES = [
  { id: 'cashflow', label: 'Cashflow Lever', sub: 'Safety & Liquidity', Icon: DollarSign, position: 'top-3 left-3' },
  { id: 'yield', label: 'Asset Yield Lever', sub: 'Growth & Returns', Icon: BarChart3, position: 'top-3 right-3' },
  { id: 'sequencing', label: 'Sequencing / Staging Lever', sub: 'Timing & Milestones', Icon: ClipboardList, position: 'bottom-3 right-3' },
];

export default function TournamentCard({ activeAgent, speech = null }) {
  return (
    <div className="bg-white rounded-[--radius-card] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] font-semibold text-[#8B1A22] tracking-[0.12em] uppercase">Live Sandbox Tournament</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A22]" />
          <span className="text-[10px] font-semibold text-[#8B1A22]">LIVE</span>
        </div>
      </div>
      <div className="relative">
        <ArenaStage activeAgent={activeAgent} />
        {BADGES.map((badge) => (
          <div key={badge.id} className={`absolute ${badge.position}`}>
            <LeverBadge label={badge.label} sub={badge.sub} Icon={badge.Icon} />
          </div>
        ))}
        <ArenaSpeechBubble speech={speech} />
      </div>
    </div>
  );
}
