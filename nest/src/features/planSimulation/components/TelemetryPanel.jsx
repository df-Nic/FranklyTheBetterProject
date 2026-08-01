import { BarChart3, ClipboardList, DollarSign } from 'lucide-react';
import TelemetryRow from './TelemetryRow.jsx';

const AGENT_ROWS = [
  { id: 'cashflow', name: 'Cashflow', Icon: DollarSign, color: '#8B1A22' },
  { id: 'yield', name: 'Asset Yield', Icon: BarChart3, color: '#1F7A4D' },
  { id: 'sequencing', name: 'Sequencing', Icon: ClipboardList, color: '#B4632A' },
];

export default function TelemetryPanel({ telemetry, completed = false }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold text-[#8B1A22] tracking-[0.10em] uppercase">Strategy Confidence</span>
      {AGENT_ROWS.map(({ id, name, Icon, color }) => (
        <TelemetryRow key={id} name={name} Icon={Icon} color={color} data={telemetry[id]} completed={completed} />
      ))}
    </div>
  );
}
