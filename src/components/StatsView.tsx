/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyHistory, WaterLog } from '../types';
import { 
  BarChart, 
  Flame, 
  Calculator, 
  TrendingUp, 
  Droplet,
  ChevronRight,
  Info
} from 'lucide-react';
import { getPastDateString } from '../utils/dummyData';

interface StatsViewProps {
  history: DailyHistory[];
  currentGoal: number;
}

export default function StatsView({ history, currentGoal }: StatsViewProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Read logs of the last 7 days (including today)
  const last7Days = [...history].slice(-7);

  // Compute stats metrics
  const totalVolume = last7Days.reduce((acc, day) => {
    const dayTotal = day.logs.reduce((sum, log) => sum + log.amount, 0);
    return acc + dayTotal;
  }, 0);

  const avgVolume = Math.round(totalVolume / (last7Days.length || 1));

  // Compute streak
  let currentStreak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const totalForDay = history[i].logs.reduce((sum, log) => sum + log.amount, 0);
    if (totalForDay >= history[i].goal) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate coordinates for the custom SVG bar chart
  const padding = 34;
  const width = 310;
  const height = 150;
  
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Find max value logged, enforce a floor scale at user's current goal to make the bars proportional
  const maxDayAmount = Math.max(...last7Days.map(day => day.logs.reduce((sum, log) => sum + log.amount, 0)), currentGoal, 1500);

  // Day names for labeling
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const getDayLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return daysOfWeek[d.getDay()];
    } catch {
      return '?';
    }
  };

  return (
    <div className="w-full space-y-4 px-1" id="stats-section">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Visual Insights</h3>
        <span className="flex items-center gap-1 text-[10px] text-blue-400 font-medium">
          <TrendingUp className="w-3 h-3" />
          Last 7 Days
        </span>
      </div>

      {/* 1. SEVEN-DAY CUSTOM SVG BAR CHART CARD */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-slate-300">Weekly Intake Trend</p>
          <span className="text-[10px] bg-sky-950/80 border border-sky-800/50 text-sky-400 px-2 py-0.5 rounded-full font-mono">
            Goal: {currentGoal}ml
          </span>
        </div>

        {/* The Graphic Bar Container */}
        <div className="relative flex justify-center py-1 bg-slate-950/30 rounded-xl border border-slate-900/40">
          <svg width={width} height={height} className="overflow-visible">
            {/* Grid Lines & Labels */}
            {[0, 0.5, 1.0].map((ratio) => {
              const yVal = padding + chartHeight * (1 - ratio);
              const volumeLabel = Math.round(maxDayAmount * ratio);
              return (
                <g key={ratio} className="opacity-40">
                  <line 
                    x1={padding} 
                    y1={yVal} 
                    x2={width - padding} 
                    y2={yVal} 
                    stroke="#1e293b" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={padding - 6} 
                    y={yVal + 3} 
                    fill="#94a3b8" 
                    fontSize="8" 
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {volumeLabel >= 1000 ? `${(volumeLabel / 1000).toFixed(1)}L` : `${volumeLabel}`}
                  </text>
                </g>
              );
            })}

            {/* Target Goal Threshold Line */}
            {(() => {
              const goalY = padding + chartHeight * (1 - currentGoal / maxDayAmount);
              if (goalY >= padding && goalY <= padding + chartHeight) {
                return (
                  <g>
                    <line 
                      x1={padding} 
                      y1={goalY} 
                      x2={width - padding} 
                      y2={goalY} 
                      stroke="#38bdf8" 
                      strokeWidth="1.5" 
                      strokeDasharray="1 2.5"
                      className="animate-pulse"
                    />
                    <text 
                      x={width - padding + 4} 
                      y={goalY + 2} 
                      fill="#38bdf8" 
                      fontSize="7" 
                      fontWeight="bold"
                    >
                      GOAL
                    </text>
                  </g>
                );
              }
              return null;
            })()}

            {/* Render Bars */}
            {last7Days.map((day, idx) => {
              const daySum = day.logs.reduce((sum, log) => sum + log.amount, 0);
              const barHeight = (daySum / maxDayAmount) * chartHeight;
              const barWidth = 14;
              const spacing = chartWidth / (last7Days.length - 1);
              const xVal = padding + idx * spacing - barWidth / 2;
              const yVal = padding + chartHeight - barHeight;

              const reachedGoal = daySum >= day.goal;
              const barColor = reachedGoal 
                ? 'url(#cyanTealGradient)' 
                : daySum > 500 
                  ? '#0284c7' 
                  : '#1e293b';

              const strokeColor = reachedGoal ? '#22d3ee' : daySum > 500 ? '#38bdf8' : '#334155';

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Invisible broad hitbox for hover accuracy */}
                  <rect 
                    x={xVal - 6} 
                    y={padding} 
                    width={barWidth + 12} 
                    height={chartHeight} 
                    fill="transparent" 
                  />

                  {/* Visual Bar Column */}
                  <rect 
                    x={xVal} 
                    y={yVal} 
                    width={barWidth} 
                    height={Math.max(barHeight, 3)} 
                    rx="6" 
                    fill={barColor}
                    stroke={strokeColor}
                    strokeWidth={daySum > 0 ? 0.75 : 0}
                    className="transition-all duration-300 transform origin-bottom hover:scale-x-110"
                  />

                  {/* Day Letter Mark */}
                  <text 
                    x={xVal + barWidth / 2} 
                    y={padding + chartHeight + 14} 
                    fill={hoveredDay === idx ? '#38bdf8' : '#64748b'} 
                    fontSize="9" 
                    fontWeight={hoveredDay === idx ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {getDayLabel(day.date)}
                  </text>
                </g>
              );
            })}

            {/* Gradient definition for filled goals */}
            <defs>
              <linearGradient id="cyanTealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 2. HOVER POPUP INFOTIP BOX */}
        <div className="h-9 mt-1 flex justify-center items-center">
          {hoveredDay !== null ? (
            <div className="text-[10px] bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 flex items-center gap-2 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="font-medium text-slate-400">
                {last7Days[hoveredDay].date === getPastDateString(0) ? 'Today' : last7Days[hoveredDay].date}:
              </span>
              <span className="text-white font-semibold">
                {last7Days[hoveredDay].logs.reduce((sum, log) => sum + log.amount, 0)} ml
              </span>
              <span className="text-slate-500 text-[9px]">
                ({last7Days[hoveredDay].logs.length} drink{last7Days[hoveredDay].logs.length === 1 ? '' : 's'})
              </span>
            </div>
          ) : (
            <span className="text-[9px] text-slate-500 italic flex items-center gap-1">
              <Info className="w-3 h-3" /> Hover column columns to view volume details
            </span>
          )}
        </div>
      </div>

      {/* 3. CORE HIGHLIGHT BENTO SCORECARDS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak Item */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-orange-950/80 border border-orange-900/50 text-orange-400 rounded-xl">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Streak</p>
            <p className="text-sm font-bold text-white font-mono">{currentStreak} Days</p>
          </div>
        </div>

        {/* Daily average stats item */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-sky-950/80 border border-sky-900/50 text-sky-400 rounded-xl">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">7D Average</p>
            <p className="text-sm font-bold text-white font-mono">{avgVolume} ml</p>
          </div>
        </div>
      </div>

      {/* 4. DRINK BREAKDOWN / LIQUID FACTOID */}
      <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl flex items-center gap-3">
        <span className="text-xs p-1 bg-emerald-900/50 border border-emerald-800 text-emerald-400 rounded text-center shrink-0 font-bold">
          Tip
        </span>
        <p className="text-[10px] text-slate-400 leading-normal">
          Consistent water intake improves cognitive performance and energy levels by up to <strong className="text-emerald-400">15%</strong>. Keep your hydration streak glowing!
        </p>
      </div>

    </div>
  );
}
