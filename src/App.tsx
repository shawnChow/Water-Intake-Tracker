/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Sparkles, 
  Smartphone, 
  Activity, 
  Trash2, 
  BellRing, 
  RefreshCw,
  Sliders,
  Compass,
  Heart,
  Volume2,
  Trash,
  SlidersHorizontal,
  SmartphoneNfc,
  Plus
} from 'lucide-react';
import { PlatformType, WaterLog, DailyHistory, ReminderSetting, SimulatedNotification } from './types';
import PhoneSimulator from './components/PhoneSimulator';
import IOSInterface from './components/iOSInterface';
import AndroidInterface from './components/AndroidInterface';
import StatsView from './components/StatsView';
import ReminderSettings from './components/ReminderSettings';
import { playWaterSound, playNotificationSound } from './utils/audio';
import { generateHistoricalData, getPastDateString } from './utils/dummyData';

export default function App() {
  // 1. STATE INITIALIZATION
  const [platform, setPlatform] = useState<PlatformType>('ios');
  const [history, setHistory] = useState<DailyHistory[]>([]);
  const [currentGoal, setCurrentGoal] = useState<number>(2000);
  const [customAmount, setCustomAmount] = useState<number>(350);
  const [activeTab, setActiveTab] = useState<'tracker' | 'stats' | 'settings'>('tracker');
  const [activeNotification, setActiveNotification] = useState<SimulatedNotification | null>(null);
  
  const [settings, setSettings] = useState<ReminderSetting>({
    enabled: true,
    intervalMinutes: 60,
    startTime: "08:00",
    endTime: "22:00",
    soundEnabled: true,
  });

  // 2. RETRIEVE PERSISTED STORAGE VALUES
  useEffect(() => {
    // Current Daily Target
    const storedGoal = localStorage.getItem('water_tracker_goal');
    if (storedGoal) {
      setCurrentGoal(Number(storedGoal));
    }

    // Reminder Config
    const storedSettings = localStorage.getItem('water_tracker_settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("Error reading stored settings", e);
      }
    }

    // Daily Logs History
    const storedHistory = localStorage.getItem('water_tracker_history');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory) as DailyHistory[];
        // Check if today is present in history, if not append it
        const todayStr = getPastDateString(0);
        const hasToday = parsed.some(d => d.date === todayStr);
        if (!hasToday) {
          parsed.push({
            date: todayStr,
            logs: [],
            goal: storedGoal ? Number(storedGoal) : 2000
          });
        }
        setHistory(parsed);
      } catch (e) {
        console.error("Error loading water history", e);
      }
    } else {
      // First launch: Generate 6 days of beautiful mock charts history + today
      const goalVal = storedGoal ? Number(storedGoal) : 2000;
      const initialLogs = generateHistoricalData(goalVal);
      initialLogs.push({
        date: getPastDateString(0),
        logs: [],
        goal: goalVal
      });
      setHistory(initialLogs);
      localStorage.setItem('water_tracker_history', JSON.stringify(initialLogs));
    }
  }, []);

  // 3. PERSIST STATE WRITES IN REAL-TIME
  const saveHistory = (newHistory: DailyHistory[]) => {
    setHistory(newHistory);
    localStorage.setItem('water_tracker_history', JSON.stringify(newHistory));
  };

  const handleUpdateSettings = (updates: Partial<ReminderSetting>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    localStorage.setItem('water_tracker_settings', JSON.stringify(updated));
  };

  const handleUpdateGoal = (newGoal: number) => {
    const validatedGoal = Math.max(500, Math.min(newGoal, 8000));
    setCurrentGoal(validatedGoal);
    localStorage.setItem('water_tracker_goal', String(validatedGoal));

    // Update today's goal in history too
    const todayStr = getPastDateString(0);
    const updatedHist = history.map(day => {
      if (day.date === todayStr) {
        return { ...day, goal: validatedGoal };
      }
      return day;
    });
    saveHistory(updatedHist);
  };

  // Adjust goal by increment
  const handleAdjustGoal = (increment: number) => {
    handleUpdateGoal(currentGoal + increment);
  };

  // 4. MAIN ACTION: ADD WATER DRINK LOG
  const handleAddWater = (amount: number, source: 'quick_cup' | 'quick_bottle' | 'quick_flask' | 'custom') => {
    const todayStr = getPastDateString(0);
    
    // Play synthesized liquid bubble pour sound
    if (settings.soundEnabled) {
      playWaterSound();
    }

    const newLog: WaterLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount,
      timestamp: new Date().toISOString(),
      source,
    };

    // Locate active logs array for today
    const updatedHist = history.map(day => {
      if (day.date === todayStr) {
        const previousTotal = day.logs.reduce((sum, log) => sum + log.amount, 0);
        const currentTotal = previousTotal + amount;
        
        // Trigger congratulations trigger push if we just reached goal!
        if (previousTotal < day.goal && currentTotal >= day.goal) {
          setTimeout(() => {
            handleTriggerSimulatedNotification(
              'Hydrated Goal Reached! 🎉',
              `Spectacular job! Today's water target of ${day.goal}ml has been fully logged!`,
              'achievement'
            );
          }, 600);
        }
        
        return {
          ...day,
          logs: [...day.logs, newLog]
        };
      }
      return day;
    });

    saveHistory(updatedHist);
  };

  // DELETE LOG ACTIONS
  const handleRemoveLog = (id: string) => {
    const todayStr = getPastDateString(0);
    const updatedHist = history.map(day => {
      if (day.date === todayStr) {
        return {
          ...day,
          logs: day.logs.filter(log => log.id !== id)
        };
      }
      return day;
    });
    saveHistory(updatedHist);
  };

  // CLEAR ALL LOGS FOR TODAY (DEMO RESET)
  const handleResetToday = () => {
    const todayStr = getPastDateString(0);
    const updatedHist = history.map(day => {
      if (day.date === todayStr) {
        return {
          ...day,
          logs: []
        };
      }
      return day;
    });
    saveHistory(updatedHist);
    
    // Quick indicator notify
    handleTriggerSimulatedNotification(
      'Progress Reset 🔄',
      "Today's fluid intake history logs have been cleared. Ready for a fresh start!",
      'alert'
    );
  };

  // 5. SIMULATED CLIENT PUSH REMINDER ALERTS
  const handleTriggerSimulatedNotification = (
    title: string, 
    body: string, 
    category: 'reminder' | 'achievement' | 'alert'
  ) => {
    // Generate simulated notification model
    const notify: SimulatedNotification = {
      id: `notif-${Date.now()}`,
      title,
      body,
      timestamp: new Date(),
      platform: platform === 'android' ? 'android' : 'ios',
      category
    };

    setActiveNotification(notify);

    // Play corresponding iOS/Android chime synth if sound is enabled
    if (settings.soundEnabled) {
      playNotificationSound(platform === 'android' ? 'android' : 'ios');
    }

    // Fire standard native HTML5 system notifications if permission is active
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png'
          });
        } catch (e) {
          console.warn("Sub-frame native Notification triggered error", e);
        }
      }
    }
  };

  // Compute Today's Sum
  const todayStr = getPastDateString(0);
  const todayData = history.find(day => day.date === todayStr);
  const todayLogs = todayData ? todayData.logs : [];
  const currentIntake = todayLogs.reduce((sum, log) => sum + log.amount, 0);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden font-sans select-none">
      
      {/* GLOWING ABSTRACT COSMIC WATER BACKGROUND BLURS */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-cyan-700/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* =======================================================
          LEFT PANEL: COMPREHENSIVE WORKSPACE DESKTOP CONTROLS
          ======================================================= */}
      <div className="flex-1 max-w-full md:max-w-md lg:max-w-lg p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950/70 backdrop-blur-md relative z-20">
        
        <div className="space-y-6">
          {/* Main Title branding */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl text-white shadow-lg animate-pulse">
                <Droplet className="w-5 h-5 fill-current" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                H2O Hydration Companion
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Multiplatform Tracker for Android & iOS with custom SVG statistics, real-time push reminder simulations, and browser sound synthesis.
            </p>
          </div>

          {/* Quick Setup Options card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-white">Interactive Controls</p>
              <p className="text-[10px] text-slate-400">Calibrate simulation states to review responsiveness:</p>
            </div>

            {/* Quick Logging sliders */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex justify-between">
                  <span>Standard Daily Target:</span>
                  <span className="text-cyan-400 font-mono">{currentGoal}ml</span>
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range"
                    min="1000"
                    max="4500"
                    step="250"
                    value={currentGoal}
                    onChange={(e) => handleUpdateGoal(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                </div>
              </div>

              {/* Grid buttons to manually push water levels for review */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleAddWater(500, 'quick_flask')}
                  className="py-2.5 px-3 bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-950/80 rounded-xl text-xs font-medium text-indigo-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Log 500ml Now
                </button>

                <button
                  onClick={handleResetToday}
                  className="py-2.5 px-3 bg-red-950/30 border border-red-900/30 hover:bg-red-950/70 rounded-xl text-xs font-medium text-red-300 flex items-center justify-center gap-1.5 transition-all"
                  title="Wipe today's progress to test from 0%"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Dry Logs (0%)
                </button>
              </div>
            </div>
          </div>

          {/* Platform Toggle Selector Bar */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 space-y-3.5">
            <div>
              <p className="text-xs font-semibold text-white">System Environment Skin</p>
              <p className="text-[10px] text-slate-400">View exact layouts representing native operating systems:</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPlatform('ios')}
                className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${platform === 'ios' ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-bold scale-[1.02]' : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-[11px] font-bold"> Apple iOS</span>
                <span className="text-[9px] text-[#22D3EE] font-medium leading-none">Fitness Rings</span>
              </button>

              <button
                onClick={() => setPlatform('android')}
                className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${platform === 'android' ? 'bg-teal-950/60 border-teal-500 text-teal-300 font-bold scale-[1.02]' : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-[11px] font-bold">🤖 Android MD</span>
                <span className="text-[9px] text-teal-300 font-medium leading-none">Wave Fluid Liquid</span>
              </button>

              <button
                onClick={() => setPlatform('web')}
                className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${platform === 'web' ? 'bg-slate-900/80 border-slate-700 text-slate-100 font-bold scale-[1.02]' : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-[11px] font-bold">🌐 Full Web</span>
                <span className="text-[9px] text-slate-400 font-medium leading-none">Fluid Grid Layout</span>
              </button>
            </div>
          </div>

          {/* Quick Notification simulator deck */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 space-y-3">
            <div>
              <p className="text-xs font-semibold text-white">Push Alert Dispatcher</p>
              <p className="text-[10px] text-slate-400">Verify system banner popups and audio chimes instantly:</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleTriggerSimulatedNotification(
                  'Drink Water Reminder! 💧',
                  'Stay focused and energized. Log a fresh glass of water to keep your hydration streak alive!',
                  'reminder'
                )}
                className="flex-1 py-2 px-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-[10px] font-semibold rounded-xl text-slate-300 flex items-center justify-center gap-1 transition-all select-none"
              >
                <BellRing className="w-3.5 h-3.5 text-sky-400 animate-bounce" /> Dispatch Alert
              </button>

              <button
                onClick={() => handleTriggerSimulatedNotification(
                  'Today\'s Goal Surpassed! 🌟',
                  'Fabulous job! You completed 100% of your hydration target. Your body will thank you!',
                  'achievement'
                )}
                className="flex-1 py-2 px-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-[10px] font-semibold rounded-xl text-slate-300 flex items-center justify-center gap-1 transition-all select-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Goal Success Chime
              </button>
            </div>
          </div>

        </div>

        {/* Footer brand and info */}
        <div className="pt-6 border-t border-slate-900/60 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-[9px]"><Heart className="w-3 h-3 text-red-500 fill-red-500" /> Healthy Habit Tracker</span>
          <span>v2.1.0 Offline-First</span>
        </div>
      </div>

      {/* =======================================================
          MIDDLE PANEL: THE PHONE SIMULATOR CONTAINER
          ======================================================= */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#070913] border-b md:border-b-0 md:border-r border-slate-900">
        <div className="flex flex-col items-center space-y-4">
          
          {platform !== 'web' && (
            <p className="text-[10px] font-semibold tracking-widest text-[#7C3AED] uppercase bg-purple-950/65 border border-purple-900/50 px-3.5 py-1 rounded-full text-center">
              Active Multiplatform Sandbox Shell
            </p>
          )}

          <PhoneSimulator
            platform={platform}
            activeNotification={activeNotification}
            onClearNotification={() => setActiveNotification(null)}
          >
            {platform === 'ios' ? (
              <IOSInterface
                currentIntake={currentIntake}
                goal={currentGoal}
                logs={todayLogs}
                onAddWater={handleAddWater}
                onRemoveLog={handleRemoveLog}
                onAdjustGoal={handleAdjustGoal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                childrenStats={<StatsView history={history} currentGoal={currentGoal} />}
                childrenReminderSettings={
                  <ReminderSettings
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                    onTriggerSimulatedNotification={handleTriggerSimulatedNotification}
                    platform={platform}
                    onChangePlatform={setPlatform}
                  />
                }
              />
            ) : platform === 'android' ? (
              <AndroidInterface
                currentIntake={currentIntake}
                goal={currentGoal}
                logs={todayLogs}
                onAddWater={handleAddWater}
                onRemoveLog={handleRemoveLog}
                onAdjustGoal={handleAdjustGoal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                childrenStats={<StatsView history={history} currentGoal={currentGoal} />}
                childrenReminderSettings={
                  <ReminderSettings
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                    onTriggerSimulatedNotification={handleTriggerSimulatedNotification}
                    platform={platform}
                    onChangePlatform={setPlatform}
                  />
                }
              />
            ) : (
              /* Fluid Web Layout when emulator shell is folded away */
              <div className="p-6 space-y-6 container mx-auto max-w-4xl font-sans text-slate-100 min-h-screen bg-[#111827]">
                
                {/* Header detail */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <Droplet className="w-7 h-7 text-sky-400 fill-sky-400/20" /> Fluid Web App
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Responsive browser dashboard designed to behave natively.</p>
                  </div>
                  
                  <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 shrink-0">
                    {['tracker', 'stats', 'settings'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? 'bg-sky-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub components depending on view */}
                {activeTab === 'tracker' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress Circle & Goal card */}
                    <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] text-sky-400 uppercase font-bold font-mono">Today's Goal</span>
                        <h2 className="text-3xl font-extrabold font-mono text-white mt-1">
                          {currentIntake} <span className="text-base text-slate-500">/ {currentGoal} ml</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Goal is {Math.min(Math.round((currentIntake / currentGoal) * 100), 100)}% complete.</p>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((currentIntake / currentGoal) * 100, 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAdjustGoal(-250)}
                          className="flex-1 py-1 px-2.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-xs font-semibold"
                        >
                          Reduce Target
                        </button>
                        <button 
                          onClick={() => handleAdjustGoal(250)}
                          className="flex-1 py-1 px-2.5 bg-sky-500 text-slate-950 rounded-lg hover:bg-sky-400 text-xs font-bold"
                        >
                          Increase Target
                        </button>
                      </div>
                    </div>

                    {/* Quick Adding Column */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Log Standard Portions</h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button 
                          onClick={() => handleAddWater(250, 'quick_cup')}
                          className="p-4 bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl text-center transition-all"
                        >
                          <span className="font-mono font-bold block text-sm">250ml</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">Glass</span>
                        </button>
                        
                        <button 
                          onClick={() => handleAddWater(330, 'quick_bottle')}
                          className="p-4 bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl text-center transition-all"
                        >
                          <span className="font-mono font-bold block text-sm">330ml</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">Mug</span>
                        </button>

                        <button 
                          onClick={() => handleAddWater(500, 'quick_flask')}
                          className="p-4 bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl text-center transition-all"
                        >
                          <span className="font-mono font-bold block text-sm">500ml</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">Flask</span>
                        </button>

                        <button 
                          onClick={() => handleAddWater(750, 'custom')}
                          className="p-4 bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl text-center transition-all"
                        >
                          <span className="font-mono font-bold block text-sm">750ml</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">Large Shaker</span>
                        </button>
                      </div>

                      {/* Log custom slider */}
                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:flex-1 space-y-1">
                          <label className="text-[10px] text-slate-450 uppercase font-bold block">Accurate Custom Portion: <strong className="text-sky-400 font-mono">{customAmount} ml</strong></label>
                          <input 
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(Number(e.target.value))}
                            className="w-full accent-sky-400 h-1 rounded bg-slate-800 appearance-none cursor-pointer"
                          />
                        </div>
                        <button 
                          onClick={() => handleAddWater(customAmount, 'custom')}
                          className="w-full sm:w-auto px-5 py-2.5 bg-sky-500 text-slate-950 rounded-xl font-bold text-xs"
                        >
                          Pour custom
                        </button>
                      </div>
                    </div>

                    {/* Log list details */}
                    <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Chronological Items</h3>
                      {todayLogs.length === 0 ? (
                        <p className="text-xs text-slate-500 py-3">No cups logged so far today. Reach for your hydration goal now!</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto no-scrollbar">
                          {[...todayLogs].reverse().map(l => (
                            <div key={l.id} className="bg-slate-950/70 border border-slate-850 p-3 rounded-xl flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-cyan-400">+{l.amount}ml</span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button 
                                onClick={() => handleRemoveLog(l.id)}
                                className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-900"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="max-w-2xl bg-slate-900 border border-slate-800 p-6 rounded-3xl mx-auto space-y-4">
                    <StatsView history={history} currentGoal={currentGoal} />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-xl bg-slate-900 border border-slate-800 p-6 rounded-3xl mx-auto space-y-4">
                    <ReminderSettings
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                      onTriggerSimulatedNotification={handleTriggerSimulatedNotification}
                      platform={platform}
                      onChangePlatform={setPlatform}
                    />
                  </div>
                )}

              </div>
            )}
          </PhoneSimulator>
        </div>
      </div>

      {/* =======================================================
          RIGHT PANEL: COMPREHENSIVE SIMULATOR METADATA RUN LOGS
          ======================================================= */}
      <div className="hidden lg:flex w-80 p-6 flex-col justify-between border-l border-slate-900 bg-slate-950/70 backdrop-blur-md relative z-20">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <SmartphoneNfc className="w-5 h-5 text-purple-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Simulator Logs
            </h3>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3.5 text-xs text-slate-300">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase font-mono">Current Platform Mode</p>
              <p className="text-xs font-bold text-sky-400 font-mono mt-0.5 capitalize">{platform} Skin</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase font-mono">Simulated UTC Time</p>
              <p className="text-xs font-bold text-white font-mono mt-0.5">2026-05-28 04:01 UTC</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase font-mono">Notification Queue Status</p>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                {activeNotification ? (
                  <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                    ● Active Banner Triggered
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono">○ Idle / Waiting for interval ...</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase font-mono">Chime Synthesis Status</p>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                {settings.soundEnabled ? (
                  <span className="text-cyan-400 font-medium font-mono flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> High-Fidelity Audio Active
                  </span>
                ) : (
                  <span className="text-slate-550 font-mono">Muted via preferences</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-2">
            <h4 className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              ★ Testing Strategies
            </h4>
            <ul className="text-[10px] text-slate-400 space-y-2 leading-relaxed list-disc list-inside">
              <li>Click <strong className="text-white">Dry Logs</strong> to clear history, then quick log to fill up progress indicators.</li>
              <li>Manually configure different portions to verify the <strong className="text-white">Weekly SVG Stats columns</strong> adjust high-scales dynamically.</li>
              <li>Toggle between Cupertino  and Material You 🤖 layout skins instantly using the simulator deck.</li>
              <li>Click <strong className="text-white">Goal Victory</strong> to hear audio celebration bells and view progress milestone alerts list down.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900/60 pt-4.5 space-y-1">
          <p className="text-[9px] text-slate-500 font-mono">AI Studio Build Applet</p>
          <p className="text-[9px] text-slate-500 font-mono">Secure Sandboxed Architecture</p>
        </div>
      </div>

    </div>
  );
}
