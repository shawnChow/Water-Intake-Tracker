/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  Trash2, 
  Settings, 
  Coffee, 
  Sparkles,
  RefreshCw,
  PlusCircle,
  Clock,
  Sliders,
  ChevronRight,
  User
} from 'lucide-react';
import { WaterLog, BeverageOption } from '../types';

interface iOSInterfaceProps {
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

export default function iOSInterface({
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
}: iOSInterfaceProps) {
  const [customAmount, setCustomAmount] = useState<number>(350);
  const percent = Math.min(Math.round((currentIntake / goal) * 100), 400);

  // Circular progress specs
  const radius = 64;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(percent, 100) / 100) * circumference;

  const quickOptions: BeverageOption[] = [
    { id: '1', name: 'Glass', amount: 250, icon: 'GlassWater', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: '2', name: 'Standard Mug', amount: 330, icon: 'Coffee', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { id: '3', name: 'Sports Flask', amount: 500, icon: 'Droplet', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: '4', name: 'Big Shaker', amount: 750, icon: 'Sparkles', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0E1A] text-slate-100 font-sans" id="ios-app">
      {/* 1. APP HERO HEADER */}
      <div className="px-5 pt-4 pb-2 flex justify-between items-center bg-[#0D1325]/40 backdrop-blur-md border-b border-white/5">
        <div>
          <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-widest block">iOS Edition</span>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            <Droplet className="w-5 h-5 text-sky-400 fill-sky-400/20" /> Hydrate Me
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] font-medium text-slate-400">Sync Active</span>
        </div>
      </div>

      {/* 2. BODY SECTION */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
        
        {activeTab === 'tracker' && (
          <>
            {/* iOS RING INTERACTIVE HEADER */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden backdrop-blur-md">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Main Goal</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-white font-mono">{currentIntake}</span>
                  <span className="text-xs text-slate-400 font-mono">/ {goal} ml</span>
                </div>
                <div className="pt-2 flex gap-1">
                  <button 
                    onClick={() => onAdjustGoal(-250)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800/80 rounded-full hover:bg-slate-700 font-bold text-xs"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => onAdjustGoal(250)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800/80 rounded-full hover:bg-slate-700 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative flex items-center justify-center">
                <svg
                  height={radius * 2}
                  width={radius * 2}
                  className="transform -rotate-90"
                >
                  {/* Track Circle */}
                  <circle
                    stroke="#1e293b"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  {/* Animated Progress Circle */}
                  <circle
                    stroke="#38bdf8"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Center text details */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-base font-bold text-white font-mono">{percent}%</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Done</span>
                </div>
              </div>
            </div>

            {/* QUICK WATER LOG DECK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tap to Quick Log</h3>
                <span className="text-[10px] text-sky-400">Pour Sound Synthesized</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
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
                      className={`p-3.5 rounded-xl border flex flex-col items-start gap-1 justify-between text-left transition-all active:scale-[0.97] hover:border-white/10 ${opt.color}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                        {opt.id === '1' && <Plus className="w-4 h-4" />}
                        {opt.id === '2' && <Coffee className="w-4 h-4" />}
                        {opt.id === '3' && <Droplet className="w-4 h-4" />}
                        {opt.id === '4' && <Sparkles className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-medium block text-slate-300 leading-tight">{opt.name}</span>
                        <span className="text-xs font-bold font-mono tracking-tight text-white block mt-0.5">+{opt.amount}ml</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOM LOG CONTAINER */}
            <div className="bg-[#0D1325]/60 border border-white/5 rounded-2xl p-4 space-y-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" /> Custom Pour Size
                </span>
                <span className="text-xs font-bold font-mono text-cyan-400">{customAmount} ml</span>
              </div>
              
              <input 
                type="range"
                min="50"
                max="1000"
                step="50"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />

              <button 
                onClick={() => onAddWater(customAmount, 'custom')}
                className="w-full h-10 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-98 transition-all font-semibold rounded-xl text-xs text-white shadow-lg flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Pour Custom Amount
              </button>
            </div>

            {/* INTERACTIVE COMPREHENSIVE DAILY CHRONICLE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Hydration Log</span>
                <span className="text-[9px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {logs.length} entry{logs.length === 1 ? '' : 'ies'}
                </span>
              </div>

              {logs.length === 0 ? (
                <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-xl p-6 text-center">
                  <p className="text-xs text-slate-500">No logs listed for today. Reach for your first cup glass!</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5 no-scrollbar">
                  {[...logs].reverse().map((log) => {
                    const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div 
                        key={log.id}
                        className="bg-slate-900/40 border border-slate-800/40 hover:border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <div>
                            <p className="text-[11px] font-semibold text-white font-mono">+{log.amount}ml</p>
                            <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" /> {time}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveLog(log.id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 bg-slate-800/40 rounded-lg hover:bg-slate-800 opacity-80 hover:opacity-100 transition-all"
                          title="Delete drink"
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

        {/* 4. SETTINGS REMINDERS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Notification & Framework</h3>
            {childrenReminderSettings}
          </div>
        )}

      </div>

      {/* 5. IOS FLOATING BOTTOM APPLICATION TAB BAR */}
      <div className="bg-[#0D1325]/85 backdrop-blur-xl border-t border-white/5 py-2 px-6 flex justify-between items-center z-30 shrink-0">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'tracker' ? 'text-sky-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Droplet className={`w-5 h-5 ${activeTab === 'tracker' ? 'fill-sky-400/20' : ''}`} />
          <span className="text-[9px] font-semibold tracking-wider">Hydrate</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'stats' ? 'text-sky-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-[9px] font-semibold tracking-wider">Progress</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'settings' ? 'text-sky-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-semibold tracking-wider">Reminders</span>
        </button>
      </div>

    </div>
  );
}
