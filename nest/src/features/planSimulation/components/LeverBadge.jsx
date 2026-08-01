export default function LeverBadge({ label, sub, Icon }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-md px-2 py-1.5 max-w-[148px]">
      <div className="w-7 h-7 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0">
        <Icon size={13} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-900 leading-tight truncate">{label}</p>
        <p className="text-[9px] text-gray-400 leading-tight truncate">{sub}</p>
      </div>
    </div>
  );
}
