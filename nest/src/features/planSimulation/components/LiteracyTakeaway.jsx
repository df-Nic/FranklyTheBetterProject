import { Lightbulb } from 'lucide-react';

export default function LiteracyTakeaway({ concept }) {
  return (
    <div className="rounded-xl bg-[#FDF6E3] border border-[#F0D080] p-2.5 h-full">
      <div className="flex items-center gap-1 mb-1.5">
        <Lightbulb size={11} className="text-[#B4632A] shrink-0" />
        <span className="text-[8px] font-bold text-[#B4632A] tracking-wider uppercase">Financial Literacy Takeaway</span>
      </div>
      <p className="text-[11px] font-bold text-gray-900 leading-tight mb-1">{concept.title}</p>
      <p className="text-[10px] text-gray-600 leading-snug">{concept.body}</p>
    </div>
  );
}
