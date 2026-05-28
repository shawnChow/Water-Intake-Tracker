/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  CheckCircle, 
  MessageCircle, 
  Lock, 
  Compass, 
  Menu,
  ChevronDown,
  BellRing
} from 'lucide-react';
import { SimulatedNotification } from '../types';

interface PhoneSimulatorProps {
  platform: 'ios' | 'android' | 'web';
  children: React.ReactNode;
  activeNotification: SimulatedNotification | null;
  onClearNotification: () => void;
}

export default function PhoneSimulator({
  platform,
  children,
  activeNotification,
  onClearNotification,
}: PhoneSimulatorProps) {
  const [timeStr, setTimeStr] = useState('09:41');
  const [batteryLevel, setBatteryLevel] = useState(88);

  useEffect(() => {
    // Update local simulated clock
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Automatically dismiss notification after 5 seconds
  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        onClearNotification();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [activeNotification, onClearNotification]);

  // If platform is pure 'web', we don't render the decorative physical phone shell.
  if (platform === 'web') {
    return (
      <div className="relative w-full h-full min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        {/* Floating In-App Notify Toast for Web Mode */}
        {activeNotification && (
          <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 p-4 animate-bounce flex items-start gap-3 duration-300">
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BellRing className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Water Reminder</p>
                <span className="text-xs text-slate-400">Just now</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{activeNotification.body}</p>
            </div>
          </div>
        )}
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  const isIOS = platform === 'ios';

  return (
    <div className="relative w-full max-w-[400px] h-[820px] bg-black rounded-[54px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[4px] border-neutral-800 ring-15 ring-neutral-900 ring-offset-2 flex flex-col overflow-hidden select-none">
      
      {/* 1. TOP HARDWARE BAR / CAMERA NOTCH SIMULATIONS */}
      {isIOS ? (
        /* iOS Dynamic Island / Notch */
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center border border-neutral-900/60 transition-all duration-300">
          <div className="absolute right-3.5 w-2 h-2 rounded-full bg-slate-950/90 border border-emerald-950 flex items-center justify-center">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      ) : (
        /* Android Punch Hole */
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 flex items-center justify-center border border-neutral-900 transition-all duration-300">
          <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full"></div>
        </div>
      )}

      {/* 2. DEVICE STATS HEADER (STATUS BAR) */}
      <div className="relative h-8 flex justify-between items-center px-6 pt-1 text-slate-100 text-xs font-medium z-40">
        <div>
          {isIOS ? (
            <span className="text-[11px] font-semibold tracking-tight">{timeStr}</span>
          ) : (
            <span className="text-[11px] font-semibold tracking-tight">{timeStr}</span>
          )}
        </div>
        
        {/* Status icons right */}
        <div className="flex items-center gap-1.5">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[9px] font-medium opacity-90">{batteryLevel}%</span>
          <div className="relative w-5 h-2.5 border border-white/60 rounded-sm flex items-center p-0.5">
            <div className="h-full bg-white rounded-2xs" style={{ width: `${batteryLevel}%` }}></div>
            <div className="absolute -right-1 top-1 w-0.5 h-1 bg-white/60 rounded-r-3xs"></div>
          </div>
        </div>
      </div>

      {/* 3. SIMULATED PHYSICAL APP VOLUME BODY */}
      <div className="flex-1 w-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col relative">
        {/* SCREEN INTERACTION AREA */}
        <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar pb-6 bg-[#0B1528] text-white">
          {children}
        </div>

        {/* 4. OVERLAY GLIDING NATIVE PUSH NOTIFICATION BANNER */}
        {activeNotification && (
          <div className="absolute top-2 left-3 right-3 z-50">
            {isIOS ? (
              /* iOS Push Notification Card */
              <div 
                className="w-full bg-slate-100/95 backdrop-blur-md text-[#1c1c1e] rounded-2xl p-3 shadow-xl border border-white/10 flex items-start gap-2.5 animate-slide-down transform duration-500 ease-out cursor-pointer"
                id="ios-notification"
                onClick={onClearNotification}
              >
                {/* Simulated app logo spacer */}
                <div className="p-1.5 bg-blue-500 rounded-lg text-white shrink-0 shadow-sm">
                  <span className="text-[9px] font-bold block leading-none">H2O</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-xs tracking-tight">Water Intake</h4>
                    <span className="text-[9px] text-[#8e8e93]">now</span>
                  </div>
                  <h5 className="font-semibold text-[11px] text-slate-800 mt-0.5 leading-tight">
                    {activeNotification.title}
                  </h5>
                  <p className="text-[11px] text-[#3a3a3c] leading-tight mt-0.5">
                    {activeNotification.body}
                  </p>
                </div>
              </div>
            ) : (
              /* Android Material Push Notification Card */
              <div 
                className="w-full bg-[#1e2533] text-[#e3e2e6] rounded-xl p-3 shadow-xl border border-blue-500/20 flex items-start gap-3 animate-slide-down transform duration-500 ease-out cursor-pointer"
                id="android-notification"
                onClick={onClearNotification}
              >
                {/* Simulated Notification dot/icon wrapper */}
                <div className="p-1.5 bg-sky-200 text-sky-950 rounded-full shrink-0">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-sky-300 font-semibold uppercase tracking-wider">Hydration Hub</span>
                    <span className="text-[9px] text-slate-400">now</span>
                  </div>
                  <h4 className="font-medium text-xs mt-0.5 leading-snug text-white">
                    {activeNotification.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-normal mt-0.5">
                    {activeNotification.body}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. VIRTUAL HARDWARE BOTTOM PILL SWIPE NAVIGATION BAR */}
        {isIOS ? (
          <div className="absolute bottom-1 w-full flex justify-center z-40 pointer-events-none">
            <div className="w-32 h-1 bg-white/70 rounded-full"></div>
          </div>
        ) : (
          <div className="absolute bottom-1.5 w-full flex justify-around items-center px-12 py-1 text-slate-400/50 text-xs z-40">
            <span className="text-[9px] font-bold">◀</span>
            <span className="w-3 h-3 rounded-full border border-slate-400/50 block"></span>
            <span className="text-[9px] font-bold">■</span>
          </div>
        )}
      </div>
    </div>
  );
}
