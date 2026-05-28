/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Droplet, 
  Trash2, 
  Settings, 
  Compass, 
  Sparkles,
  BarChart2,
  Sliders,
  ChevronRight,
  Plus,
  PlusCircle,
  BellRing,
  Lightbulb
} from 'lucide-react';
import { WaterLog, BeverageOption } from '../types';

interface AndroidInterfaceProps {
  currentIntake: number;
  goal: number;
  logs: WaterLog[];
  onAddWater: (amount: number, source: 'quick_cup' | 'quick_bottle' | 'quick_flask' | 'custom') => void;
  onRemoveLog: (id: string) => void;
  onAdjustGoal: (increment: number) => void;
  activeTab: 'tracker' | 'stats' | 'settings';
  setActiveTab: (tab: 'tracker' | 'stats' | 'settings') => void;
  childrenStats: React.ReactNode;
  childrenReminderSettings: React.ReactNode;
}

export default function AndroidInterface({
  currentIntake,
  goal,
  logs,
  onAddWater,
  onRemoveLog,
  onAdjustGoal,
  activeTab,
  setActiveTab,
  childrenStats,
  childrenReminderSettings,
}: AndroidInterfaceProps) {
  const [customAmount, setCustomAmount] = useState<number>(400);
  const percent = Math.min(Math.round((currentIntake / goal) * 100), 100);

  const quickOptions: BeverageOption[] = [
    { id: '1', name: 'Glass', amount: 250, icon: 'GlassWater', color: 'bg-emerald-900/40 border border-emerald-800/40 text-emerald-300' },
    { id: '2', name: 'Bottle', amount: 330, icon: 'Coffee', color: 'bg-teal-900/40 border border-teal-800/40 text-teal-300' },
    { id: '3', name: 'Thermos', amount: 500, icon: 'Droplet', color: 'bg-blue-900/40 border border-blue-800/40 text-blue-300' },
    { id: '4', name: 'Gallon', amount: 750, icon: 'Sparkles', color: 'bg-indigo-900/40 border border-indigo-800/40 text-indigo-300' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#12131A] text-[#e3e2e6] font-sans" id="android-app">
      {/* 1. MATERIAL APP BAR */}
      <div className="px-5 pt-3 pb-3 flex justify-between items-center bg-[#1a1b24] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
            H2O
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-teal-300 font-bold block leading-none">Android Edition</span>
            <h1 className="text-base font-semibold tracking-tight text-white mt-0.5">Hydration Companion</h1>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="px-2 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/60 text-[10px] text-teal-300 font-semibold">
            Google Fit
          </span>
        </div>
      </div>

      {/* 2. MAIN VOLUME */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4.5 no-scrollbar">

        {activeTab === 'tracker' && (
          <>
            {/* MATERIAL INTERACTIVE FLOATING WAVE CONTAINER */}
            <div className="bg-[#1a1b24] border border-slate-800 rounded-3xl p-4.5 flex gap-4.5 relative overflow-hidden shadow-lg">
              <div className="flex-1 flex flex-col justify-between py-1.5">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Daily Progress</p>
                  <p className="text-2xl font-bold font-mono text-white mt-1">
                    {currentIntake} <span className="text-xs text-slate-500">of {goal} ml</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                      {percent}% hydrated
                    </span>
                  </div>

                  {/* Goal Increment adjust deck */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => onAdjustGoal(-250)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold rounded-lg text-slate-300"
                    >
                      Reduce
                    </button>
                    <button 
                      onClick={() => onAdjustGoal(250)}
                      className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-xs font-semibold rounded-lg text-slate-950"
                    >
                      Increase
                    </button>
                  </div>
                </div>
              </div>

              {/* Fluids Wave Capsule Cylinder */}
              <div className="w-20 h-32 bg-[#12131A] border-2 border-slate-800 rounded-full select-none relative overflow-hidden flex flex-col justify-end shadow-inner">
                {/* wave effect animated markup */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500/80 to-cyan-400 transition-all duration-700 overflow-hidden"
                  style={{ height: `${percent}%` }}
                >
                  {/* Waver design */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-teal-400/30 animate-pulse rounded-full opacity-60"></div>
                  {/* Foam highlight bubble particles */}
                  <div className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-6 right-4 w-1 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Counter reading inline the beaker */}
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-white mix-blend-difference drop-shadow">
                  {percent}%
                </div>
              </div>
            </div>

            {/* MATERIAL QUICK ADD GRID */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Quick logging</h3>
              <div className="grid grid-cols-4 gap-2">
                {quickOptions.map((opt) => {
                  const source = opt.id === '1' 
                    ? 'quick_cup' 
                    : opt.id === '2' 
                      ? 'quick_bottle' 
                      : opt.id === '3' 
                        ? 'quick_flask' 
                        : 'custom';
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onAddWater(opt.amount, source)}
                      className={`py-3.5 px-1.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all active:scale-90 ${opt.color}`}
                    >
                      <Droplet className="w-5 h-5 mb-1.5" />
                      <span className="text-[9px] font-bold tracking-tight block uppercase">{opt.name}</span>
                      <span className="text-[10px] font-mono font-bold block mt-0.5">{opt.amount}ml</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SLIDER FOR DETAILED CUSTOM LOG */}
            <div className="bg-[#1a1b24] border border-slate-800 rounded-3xl p-4.5 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-teal-400 animate-pulse" /> Accurate Log Setting
                </span>
                <span className="text-xs font-bold font-mono text-teal-400 bg-teal-950/70 py-1 px-2.5 rounded-lg border border-teal-900">
                  {customAmount} ml
                </span>
              </div>

              <input 
                type="range"
                min="50"
                max="1000"
                step="50"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />

              <button 
                onClick={() => onAddWater(customAmount, 'custom')}
                className="w-full h-11 bg-teal-400 hover:bg-teal-300 active:scale-[0.98] transition-all font-bold rounded-2xl text-xs text-slate-950 shadow-lg flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4.5 h-4.5" /> Log Custom Amount
              </button>
            </div>

            {/* MATERIAL DAILY LOG FEED */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Chronological Logs</p>
              {logs.length === 0 ? (
                <div className="bg-[#1a1b24]/40 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-xs text-slate-500">Water companion is ready. Complete your first cup log above.</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-0.5 no-scrollbar">
                  {[...logs].reverse().map((log) => {
                    const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div 
                        key={log.id}
                        className="bg-[#1a1b24] ring-1 ring-white/5 hover:ring-teal-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 bg-slate-800 text-teal-300 rounded-full">
                            <Droplet className="w-3 h-3 fill-current" />
                          </span>
                          <div>
                            <p className="text-[11px] font-bold text-white font-mono">{log.amount} ml</p>
                            <p className="text-[9px] text-[#94a3b8] mt-0.5">Logged today {time}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveLog(log.id)}
                          className="text-[#94a3b8] hover:text-red-400 p-2 hover:bg-slate-800 rounded-full transition-all"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </>
        )}

        {/* 3. VISUAL INSIGHTS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fadeIn">
            {childrenStats}
          </div>
        )}

        {/* 4. NOTIFICATION RULES TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Notification & Framework</h3>
            {childrenReminderSettings}
          </div>
        )}

      </div>

      {/* 3. MATERIAL THREE-TAB SYSTEM NAVIGATION RAIL */}
      <div className="bg-[#1a1b24] border-t border-white/5 py-2.5 px-4 flex justify-between items-center z-30 shrink-0">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'tracker' ? 'text-teal-300 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <Droplet className={`w-5 h-5 ${activeTab === 'tracker' ? 'text-teal-400 fill-teal-400/20' : ''}`} />
          <span className="text-[9px] font-semibold tracking-wide uppercase">Companion</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'stats' ? 'text-teal-300 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[9px] font-semibold tracking-wide uppercase">Insights</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'settings' ? 'text-teal-300 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-semibold tracking-wide uppercase">Reminders</span>
        </button>
      </div>

    </div>
  );
}
