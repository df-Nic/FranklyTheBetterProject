import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { PLANS_DATA } from '../data/planTemplates';

// ─── Inline SVG Illustrations ───────────────────────────────────────────────

const RetirementIllustration = () => (
  <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="retGrad" x1="0" y1="0" x2="280" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF8C5A" />
        <stop offset="60%" stopColor="#FFB347" />
        <stop offset="100%" stopColor="#FFC97A" />
      </linearGradient>
    </defs>
    <rect width="280" height="160" fill="url(#retGrad)" />
    <rect x="0" y="125" width="280" height="35" fill="#C2440A" opacity="0.2" />
    <ellipse cx="140" cy="155" rx="200" ry="40" fill="#D45A10" opacity="0.2" />
    {/* Sun */}
    <circle cx="205" cy="52" r="28" fill="#FFEABC" opacity="0.9" />
    <circle cx="205" cy="52" r="20" fill="#FFD478" />
    <line x1="205" y1="20" x2="205" y2="12" stroke="#FFD478" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="225" y1="28" x2="231" y2="22" stroke="#FFD478" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="237" y1="52" x2="245" y2="52" stroke="#FFD478" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="225" y1="76" x2="231" y2="82" stroke="#FFD478" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="185" y1="28" x2="179" y2="22" stroke="#FFD478" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="173" y1="52" x2="165" y2="52" stroke="#FFD478" strokeWidth="2.5" strokeLinecap="round" />
    {/* Palm tree trunk */}
    <path d="M 62 148 Q 67 118 71 98 Q 73 82 69 66" stroke="#7C3F00" strokeWidth="5" strokeLinecap="round" fill="none"/>
    {/* Palm leaves */}
    <path d="M 69 66 Q 50 55 30 60 Q 48 63 56 73" fill="#3D9A3E" opacity="0.9"/>
    <path d="M 69 66 Q 56 45 69 35 Q 66 50 73 59" fill="#4CAF50" opacity="0.9"/>
    <path d="M 69 66 Q 82 45 102 49 Q 86 59 79 69" fill="#3D9A3E" opacity="0.9"/>
    <path d="M 69 66 Q 45 68 35 81 Q 53 73 63 79" fill="#4CAF50" opacity="0.8"/>
    <path d="M 69 66 Q 84 69 97 81 Q 83 71 76 79" fill="#3D9A3E" opacity="0.8"/>
    {/* Hammock rope left */}
    <line x1="88" y1="101" x2="82" y2="89" stroke="#A0785A" strokeWidth="1.5" opacity="0.85"/>
    {/* Hammock rope right */}
    <line x1="122" y1="101" x2="132" y2="96" stroke="#A0785A" strokeWidth="1.5" opacity="0.85"/>
    {/* Hammock body */}
    <path d="M 88 101 Q 105 115 122 101" stroke="#E8D5B7" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.85"/>
    <path d="M 88 101 Q 105 115 122 101" stroke="#F5E9D5" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6"/>
    {/* Person silhouette */}
    <ellipse cx="108" cy="104" rx="13" ry="5" fill="#D4956A" opacity="0.75"/>
    <circle cx="118" cy="99" r="6" fill="#D4956A" opacity="0.75"/>
    {/* Clouds */}
    <ellipse cx="60" cy="28" rx="24" ry="11" fill="white" opacity="0.22"/>
    <ellipse cx="48" cy="26" rx="15" ry="9" fill="white" opacity="0.18"/>
    <ellipse cx="76" cy="26" rx="15" ry="9" fill="white" opacity="0.18"/>
    <ellipse cx="148" cy="20" rx="19" ry="9" fill="white" opacity="0.18"/>
    <ellipse cx="138" cy="19" rx="13" ry="8" fill="white" opacity="0.14"/>
    <ellipse cx="162" cy="19" rx="13" ry="8" fill="white" opacity="0.14"/>
  </svg>
);

const SavingsIllustration = () => (
  <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="savGrad" x1="0" y1="0" x2="280" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F7FFA" />
        <stop offset="100%" stopColor="#6C5CE7" />
      </linearGradient>
    </defs>
    <rect width="280" height="160" fill="url(#savGrad)" />
    <ellipse cx="140" cy="152" rx="120" ry="15" fill="#3D5DB8" opacity="0.4"/>
    {/* House body */}
    <rect x="90" y="90" width="78" height="56" rx="3" fill="#FAFAFA" opacity="0.95"/>
    {/* Roof */}
    <polygon points="82,92 129,56 200,92" fill="#E8F4FF" opacity="0.95"/>
    {/* Door */}
    <rect x="117" y="116" width="22" height="30" rx="3" fill="#6C5CE7" opacity="0.75"/>
    <circle cx="133" cy="132" r="2" fill="white" opacity="0.8"/>
    {/* Windows */}
    <rect x="97" y="101" width="18" height="16" rx="2" fill="#D6EEFF" opacity="0.9"/>
    <rect x="143" y="101" width="18" height="16" rx="2" fill="#D6EEFF" opacity="0.9"/>
    <line x1="106" y1="101" x2="106" y2="117" stroke="#AACDE0" strokeWidth="0.8"/>
    <line x1="97" y1="109" x2="115" y2="109" stroke="#AACDE0" strokeWidth="0.8"/>
    <line x1="152" y1="101" x2="152" y2="117" stroke="#AACDE0" strokeWidth="0.8"/>
    <line x1="143" y1="109" x2="161" y2="109" stroke="#AACDE0" strokeWidth="0.8"/>
    {/* Chimney */}
    <rect x="160" y="65" width="10" height="20" rx="1" fill="#FAFAFA" opacity="0.8"/>
    {/* Left coin stack */}
    <ellipse cx="55" cy="145" rx="15" ry="6" fill="#FFD700" opacity="0.9"/>
    <ellipse cx="55" cy="133" rx="15" ry="6" fill="#FFD700" opacity="0.87"/>
    <ellipse cx="55" cy="121" rx="15" ry="6" fill="#FFD700" opacity="0.84"/>
    <ellipse cx="55" cy="109" rx="15" ry="6" fill="#FFE580" opacity="0.95"/>
    <text x="55" y="112" textAnchor="middle" fontSize="7" fill="#A07800" fontWeight="bold">$</text>
    {/* Left arrow up */}
    <path d="M55 95 L55 87 M51 92 L55 87 L59 92" stroke="#FFE066" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Right coin stack */}
    <ellipse cx="222" cy="145" rx="15" ry="6" fill="#FFD700" opacity="0.9"/>
    <ellipse cx="222" cy="133" rx="15" ry="6" fill="#FFD700" opacity="0.87"/>
    <ellipse cx="222" cy="121" rx="15" ry="6" fill="#FFE580" opacity="0.95"/>
    <text x="222" y="124" textAnchor="middle" fontSize="7" fill="#A07800" fontWeight="bold">$</text>
    {/* Right arrow up */}
    <path d="M222 107 L222 99 M218 104 L222 99 L226 104" stroke="#FFE066" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Stars */}
    <circle cx="35" cy="42" r="2" fill="white" opacity="0.35"/>
    <circle cx="245" cy="28" r="1.5" fill="white" opacity="0.3"/>
    <circle cx="260" cy="55" r="1" fill="white" opacity="0.25"/>
    <circle cx="22" cy="70" r="1.5" fill="white" opacity="0.25"/>
  </svg>
);

const EmergencyIllustration = () => {
  const rainL = [[40,70],[28,86],[56,83],[18,96],[46,98],[64,91],[31,109],[53,113]];
  const rainR = [[220,61],[236,73],[249,69],[226,86],[241,91],[256,81],[231,101],[246,106]];
  const ribs = [90, 107, 124, 140, 156, 173, 190];
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="emGrad" x1="0" y1="0" x2="280" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E2A5A" />
          <stop offset="60%" stopColor="#2D3FA3" />
          <stop offset="100%" stopColor="#4A5CCF" />
        </linearGradient>
      </defs>
      <rect width="280" height="160" fill="url(#emGrad)" />
      {/* Storm clouds left */}
      <ellipse cx="55" cy="44" rx="40" ry="19" fill="#384580" opacity="0.85"/>
      <ellipse cx="37" cy="48" rx="26" ry="15" fill="#2D3870" opacity="0.75"/>
      <ellipse cx="76" cy="48" rx="26" ry="15" fill="#2D3870" opacity="0.75"/>
      {/* Storm clouds right */}
      <ellipse cx="226" cy="37" rx="36" ry="17" fill="#384580" opacity="0.65"/>
      <ellipse cx="210" cy="41" rx="23" ry="14" fill="#2D3870" opacity="0.58"/>
      <ellipse cx="244" cy="41" rx="23" ry="14" fill="#2D3870" opacity="0.58"/>
      {/* Rain left */}
      {rainL.map(([x,y], i) => (
        <ellipse key={`rl${i}`} cx={x} cy={y} rx="1.5" ry="4.5" fill="#8CA8E8" opacity={0.45 + (i % 3) * 0.18} transform={`rotate(-12 ${x} ${y})`}/>
      ))}
      {/* Rain right */}
      {rainR.map(([x,y], i) => (
        <ellipse key={`rr${i}`} cx={x} cy={y} rx="1.5" ry="4.5" fill="#8CA8E8" opacity={0.38 + (i % 3) * 0.18} transform={`rotate(-12 ${x} ${y})`}/>
      ))}
      {/* Umbrella canopy */}
      <path d="M 90 95 Q 140 44 190 95" fill="#5B8AF0" opacity="0.95"/>
      {/* Alternating segments */}
      <path d="M 90 95 Q 107 54 124 95" fill="#7BA5F5" opacity="0.72"/>
      <path d="M 124 95 Q 140 44 156 95" fill="#4566C8" opacity="0.72"/>
      <path d="M 156 95 Q 173 54 190 95" fill="#7BA5F5" opacity="0.72"/>
      {/* Ribs */}
      {ribs.map((x, i) => {
        const t = i / 6;
        const cy = 44 + Math.sin(Math.PI * t) * 51;
        return <line key={i} x1="140" y1="95" x2={x} y2={cy} stroke="#3355AA" strokeWidth="0.9" opacity="0.65"/>;
      })}
      {/* Edge highlight */}
      <path d="M 88 96 Q 140 45 192 96" stroke="white" strokeWidth="2" fill="none" opacity="0.38" strokeLinecap="round"/>
      {/* Handle */}
      <path d="M 140 95 L 140 137 Q 140 147 129 147 Q 118 147 118 136" stroke="#FAFAFA" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      {/* Person */}
      <circle cx="137" cy="117" r="7.5" fill="#FFD0A8" opacity="0.92"/>
      <rect x="129" y="124" width="16" height="19" rx="5" fill="#4F7FFA" opacity="0.85"/>
      {/* Rain center - shown bouncing off canopy */}
      <ellipse cx="110" cy="68" rx="1.2" ry="4" fill="#A0C0FF" opacity="0.5" transform="rotate(-12 110 68)"/>
      <ellipse cx="130" cy="62" rx="1.2" ry="4" fill="#A0C0FF" opacity="0.5" transform="rotate(-12 130 62)"/>
      <ellipse cx="150" cy="60" rx="1.2" ry="4" fill="#A0C0FF" opacity="0.5" transform="rotate(-12 150 60)"/>
      <ellipse cx="168" cy="64" rx="1.2" ry="4" fill="#A0C0FF" opacity="0.5" transform="rotate(-12 168 64)"/>
    </svg>
  );
};

const WealthIllustration = () => {
  const bars = [
    { x: 65,  h: 40,  label: '2026' },
    { x: 100, h: 58,  label: '2027' },
    { x: 135, h: 78,  label: '2028' },
    { x: 170, h: 98,  label: '2029' },
    { x: 205, h: 115, label: '2030' },
  ];
  const dots = [[65,100],[100,82],[135,62],[170,42],[205,25]];
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="wlGrad" x1="0" y1="0" x2="280" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A3A2A" />
          <stop offset="100%" stopColor="#0F5F3A" />
        </linearGradient>
      </defs>
      <rect width="280" height="160" fill="url(#wlGrad)" />
      {/* Grid */}
      {[30,55,80,105,130].map((y,i) => (
        <line key={i} x1="45" y1={y} x2="250" y2={y} stroke="#2A5A3A" strokeWidth="0.8" opacity="0.6"/>
      ))}
      {/* Axes */}
      <line x1="50" y1="20" x2="50" y2="140" stroke="#3A7A4A" strokeWidth="1.5" opacity="0.7"/>
      <line x1="50" y1="140" x2="255" y2="140" stroke="#3A7A4A" strokeWidth="1.5" opacity="0.7"/>
      {/* Bars */}
      {bars.map((bar, i) => (
        <g key={i}>
          <rect x={bar.x - 12} y={140 - bar.h} width="24" height={bar.h} rx="4" fill="#4ADE80" opacity={0.62 + i * 0.07}/>
          <text x={bar.x} y={153} textAnchor="middle" fontSize="7" fill="#5A9A6A">{bar.label}</text>
        </g>
      ))}
      {/* Trend line */}
      <polyline points="65,100 100,82 135,62 170,42 205,25" stroke="#22D3EE" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Dots */}
      {dots.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i === 4 ? 5.5 : 3.5} fill={i === 4 ? '#22D3EE' : '#86EFAC'} opacity="0.92"/>
      ))}
      {/* Arrow tip */}
      <path d="M205 17 L205 9 M201 14 L205 9 L209 14" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Coin stack */}
      <ellipse cx="233" cy="138" rx="13" ry="5" fill="#FFD700" opacity="0.86"/>
      <ellipse cx="233" cy="130" rx="13" ry="5" fill="#FFD700" opacity="0.84"/>
      <ellipse cx="233" cy="122" rx="13" ry="5" fill="#FFD700" opacity="0.82"/>
      <ellipse cx="233" cy="114" rx="13" ry="5" fill="#FFD700" opacity="0.80"/>
      <ellipse cx="233" cy="106" rx="13" ry="5" fill="#FFD700" opacity="0.78"/>
      <ellipse cx="233" cy="98" rx="13" ry="5" fill="#FFE580" opacity="0.96"/>
      <text x="233" y="101" textAnchor="middle" fontSize="7" fill="#A07800" fontWeight="bold">$</text>
      {/* Labels */}
      <text x="58" y="26" fontSize="8" fill="#4ADE80" opacity="0.85">+7%</text>
      <text x="58" y="35" fontSize="6" fill="#86EFAC" opacity="0.65">p.a.</text>
    </svg>
  );
};

// ─── Plan Card Meta ──────────────────────────────────────────────────────────

const PLAN_META = {
  retirement: {
    Illustration: RetirementIllustration,
    tag: 'Retirement',
    tagColor: 'bg-orange-100 text-orange-700',
  },
  savings: {
    Illustration: SavingsIllustration,
    tag: 'Savings & HDB',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  emergency: {
    Illustration: EmergencyIllustration,
    tag: 'Emergency Fund',
    tagColor: 'bg-indigo-100 text-indigo-700',
  },
  default: {
    Illustration: WealthIllustration,
    tag: 'Wealth Builder',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
};

// ─── Single Plan Card ────────────────────────────────────────────────────────

const PlanCard = ({ planId, index, onClick }) => {
  const plan = PLANS_DATA[planId];
  const meta = PLAN_META[planId] || PLAN_META.default;
  const { Illustration } = meta;
  const goalText = plan.goal.length > 92 ? plan.goal.slice(0, 92) + '\u2026' : plan.goal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 160, delay: index * 0.08 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-zinc-100 cursor-pointer select-none active:shadow-sm"
    >
      {/* Illustration zone */}
      <div className="relative w-full" style={{ height: '150px' }}>
        <Illustration />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${meta.tagColor}`}>
          {meta.tag}
        </span>
      </div>

      {/* Detail panel */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black text-zinc-900 tracking-tight leading-snug flex-1">
            {plan.title}
          </h3>
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
            <ChevronRight className="w-4 h-4 text-zinc-500 stroke-[2.2]" />
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 font-medium leading-snug">
          {goalText}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <CalendarDays className="w-3 h-3 text-zinc-400" />
          <span className="text-[9px] font-semibold text-zinc-400">
            Target:{' '}
            <span className="text-zinc-600 font-bold">{plan.timelineAll}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Plan Dashboard Page ─────────────────────────────────────────────────────

const PlanDashboardPage = () => {
  const { navigate, createdPlans, setActivePlanId, setClickPos, setPlanDetailOrigin } = useApp();

  const handleCardClick = (e, planId) => {
    const mobileFrame = e.currentTarget.closest('[data-mobile-frame]');
    if (mobileFrame) {
      const rect = mobileFrame.getBoundingClientRect();
      setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      setClickPos({ x: 195, y: 300 });
    }
    setActivePlanId(planId);
    setPlanDetailOrigin('plan-dashboard'); // back button returns to dashboard
    navigate('plan-details');
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="pt-6 pb-2 h-auto w-full bg-white/70 backdrop-blur-xl border-b border-white/50 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">NEST ADVISORY</span>
            <span className="text-sm font-black text-zinc-900 tracking-tight mt-0.5">My Plans</span>
          </div>
        </div>

        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white text-[10px] font-bold transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Plan</span>
        </button>
      </header>

      {/* Cards area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-5 pb-28 flex flex-col gap-4 z-10">
        {createdPlans.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center flex-1 gap-4 pt-20">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-zinc-300 stroke-[1.5]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-800">No plans yet</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-[200px] leading-snug">
                Chat with Nest to create your first financial plan.
              </p>
            </div>
            <button
              onClick={() => navigate('home')}
              className="mt-2 px-5 py-2.5 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Create a Plan
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-0.5 mb-1">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Plans</span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Tap a plan to view details and execution roadmap
              </span>
            </div>

            {createdPlans.map((planId, index) => (
              <PlanCard
                key={planId}
                planId={planId}
                index={index}
                onClick={(e) => handleCardClick(e, planId)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlanDashboardPage;
