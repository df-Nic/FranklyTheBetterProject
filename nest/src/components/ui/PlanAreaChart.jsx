import React, { useState } from 'react';

// SVG Area Chart Dimension Constants
const paddingLeft = 45;
const paddingBottom = 25;
const chartW = 280;
const chartH = 125;
const svgW = 340;
const svgH = 165;

const PlanAreaChart = ({ chartPoints, maxVal }) => {
  const [hoverData, setHoverData] = useState(null);

  const N = chartPoints.length;
  const lastIdx = N - 1;

  const xCoords = chartPoints.map((_, idx) => paddingLeft + idx * (chartW / lastIdx));
  const y1Coords = chartPoints.map(p => svgH - paddingBottom - (p.y1 / maxVal) * chartH);
  const y2Coords = chartPoints.map(p => svgH - paddingBottom - (p.y2 / maxVal) * chartH);
  const y3Coords = chartPoints.map(p => svgH - paddingBottom - (p.y3 / maxVal) * chartH);

  // Path formulations (cumulative stacks)
  // Layer 3 (Investments + Deposits + Cash - Top)
  const d3 = `M ${xCoords[0]} ${y3Coords[0]} ` +
             xCoords.map((x, i) => `L ${x} ${y3Coords[i]}`).join(' ') +
             ` L ${xCoords[lastIdx]} ${svgH - paddingBottom} L ${xCoords[0]} ${svgH - paddingBottom} Z`;

  // Layer 2 (Deposits + Cash - Middle)
  const d2 = `M ${xCoords[0]} ${y2Coords[0]} ` +
             xCoords.map((x, i) => `L ${x} ${y2Coords[i]}`).join(' ') +
             ` L ${xCoords[lastIdx]} ${svgH - paddingBottom} L ${xCoords[0]} ${svgH - paddingBottom} Z`;

  // Layer 1 (Base Cash - Bottom)
  const d1 = `M ${xCoords[0]} ${y1Coords[0]} ` +
             xCoords.map((x, i) => `L ${x} ${y1Coords[i]}`).join(' ') +
             ` L ${xCoords[lastIdx]} ${svgH - paddingBottom} L ${xCoords[0]} ${svgH - paddingBottom} Z`;

  // Path line curves overlay
  const line3Path = `M ${xCoords[0]} ${y3Coords[0]} ` + xCoords.map((x, i) => `L ${x} ${y3Coords[i]}`).join(' ');
  const line2Path = `M ${xCoords[0]} ${y2Coords[0]} ` + xCoords.map((x, i) => `L ${x} ${y2Coords[i]}`).join(' ');
  const line1Path = `M ${xCoords[0]} ${y1Coords[0]} ` + xCoords.map((x, i) => `L ${x} ${y1Coords[i]}`).join(' ');

  // Grid levels
  const gridLinesCount = 3;
  const gridLines = Array.from({ length: gridLinesCount }, (_, idx) => {
    return (maxVal / (gridLinesCount + 1)) * (idx + 1);
  });

  const handleChartMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    
    // Scale standard dimensions to match container width
    const svgScaledRatio = rect.width / svgW;
    const chartLeftPx = paddingLeft * svgScaledRatio;
    const chartRightPx = (svgW - 15) * svgScaledRatio;

    if (relativeX >= chartLeftPx && relativeX <= chartRightPx) {
      const fraction = (relativeX - chartLeftPx) / (chartRightPx - chartLeftPx);
      const index = Math.round(fraction * lastIdx);
      
      setHoverData({
        x: xCoords[index],
        y: y3Coords[index],
        index
      });
    } else {
      setHoverData(null);
    }
  };

  const handleChartMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div className="relative w-full flex flex-col gap-2">
      {/* SVG Chart */}
      <div 
        className="relative w-full h-[165px] mt-2 cursor-crosshair"
        onMouseMove={handleChartMouseMove}
        onMouseLeave={handleChartMouseLeave}
      >
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Layer Gradients */}
            <linearGradient id="gradInvestments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E1251B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#E1251B" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradDeposits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {gridLines.map((val, idx) => {
            const yVal = svgH - paddingBottom - (val / maxVal) * chartH;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={yVal}
                  x2={svgW - 15}
                  y2={yVal}
                  stroke="#E4E4E7"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={yVal + 3}
                  textAnchor="end"
                  className="text-[8px] font-extrabold text-zinc-400 fill-zinc-400"
                >
                  {`$${Math.round(val / 1000)}k`}
                </text>
              </g>
            );
          })}

          {/* Cumulative Fills */}
          <path d={d3} fill="url(#gradInvestments)" />
          <path d={d2} fill="url(#gradDeposits)" />
          <path d={d1} fill="url(#gradBase)" />

          {/* Stiff lines on top of fills */}
          <path d={line3Path} fill="none" stroke="#E1251B" strokeWidth="2.2" strokeLinecap="round" />
          <path d={line2Path} fill="none" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" />
          <path d={line1Path} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />

          {/* Year Labels along the X-Axis */}
          {chartPoints.map((p, idx) => {
            const xVal = xCoords[idx];
            return (
              <text
                key={idx}
                x={xVal}
                y={svgH - 8}
                textAnchor="middle"
                className="text-[9px] font-extrabold text-zinc-400 fill-zinc-400"
              >
                {p.year}
              </text>
            );
          })}

          {/* Interactive cursor line */}
          {hoverData && (
            <g>
              <line
                x1={hoverData.x}
                y1={15}
                x2={hoverData.x}
                y2={svgH - paddingBottom}
                stroke="#718096"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoverData.x}
                cy={hoverData.y}
                r="4.5"
                fill="#E1251B"
                stroke="white"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Dynamic hover details box */}
        {hoverData && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoverData.x / svgW) * 100}%`,
              top: `${(hoverData.y / svgH) * 100 - 32}%`,
              transform: hoverData.index === 0 
                ? 'translateX(-15%)' 
                : hoverData.index === lastIdx 
                  ? 'translateX(-85%)' 
                  : 'translateX(-50%)'
            }}
            className="bg-zinc-950/90 text-white rounded-xl p-2 text-[9px] font-medium pointer-events-none shadow-md z-30 flex flex-col gap-0.5 min-w-[95px] backdrop-blur-sm border border-white/10"
          >
            <span className="font-extrabold text-zinc-300 border-b border-zinc-800 pb-0.5 mb-1 text-center">
              Year {chartPoints[hoverData.index].year}
            </span>
            <div className="flex justify-between gap-2">
              <span className="text-zinc-400 font-bold">Total:</span>
              <span className="font-black text-brand-primary">
                ${chartPoints[hoverData.index].y3.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-2 text-[8px]">
              <span className="text-zinc-500 font-bold">Invests:</span>
              <span className="text-zinc-300">
                ${(chartPoints[hoverData.index].y3 - chartPoints[hoverData.index].y2).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-2 text-[8px]">
              <span className="text-zinc-500 font-bold">Deposits:</span>
              <span className="text-zinc-300">
                ${(chartPoints[hoverData.index].y2 - chartPoints[hoverData.index].y1).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-2 text-[8px]">
              <span className="text-zinc-500 font-bold">Cash Base:</span>
              <span className="text-zinc-300">
                ${chartPoints[hoverData.index].y1.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-4 mt-1 pt-2 border-t border-zinc-200/20 text-[9px] font-bold text-zinc-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          <span>Investments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Smart Deposits</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Cash Reserve</span>
        </div>
      </div>
    </div>
  );
};

export default PlanAreaChart;
