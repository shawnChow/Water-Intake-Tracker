/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  Volume2, 
  VolumeX, 
  Play, 
  Award,
  Sparkles,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ReminderSetting, PlatformType } from '../types';

interface ReminderSettingsProps {
  settings: ReminderSetting;
  onUpdateSettings: (updates: Partial<ReminderSetting>) => void;
  onTriggerSimulatedNotification: (title: string, body: string, category: 'reminder' | 'achievement' | 'alert') => void;
  platform: PlatformType;
  onChangePlatform: (p: PlatformType) => void;
}

export default function ReminderSettings({
  settings,
  onUpdateSettings,
  onTriggerSimulatedNotification,
  platform,
  onChangePlatform,
}: ReminderSettingsProps) {
  const [nativePermissionState, setNativePermissionState] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const requestNativePermissions = async () => {
    if (typeof Notification === 'undefined') {
      alert('Desktop system notifications are not supported in this browser window.');
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setNativePermissionState(res);
    } catch (e) {
      console.warn("Failed requesting browser notification permission", e);
    }
  };

  const handleTestReminder = () => {
    onTriggerSimulatedNotification(
      'Hydration Alert! 💧',
      'Time to take a sip of refreshing water to stay focused and active!',
      'reminder'
    );
  };

  const handleTestAchievement = () => {
    onTriggerSimulatedNotification(
      'Hydration Milestone Achieved! 🎉',
      'Congratulations! You have completed 100% of your daily water intake goal. Keep glowing!',
      'achievement'
    );
  };

  const intervals = [
    { label: 'Every 30 Mins', value: 30 },
    { label: 'Every 1 Hour', value: 60 },
    { label: 'Every 2 Hours', value: 120 },
    { label: 'Every 3 Hours', value: 180 },
  ];

  return (
    <div className="space-y-4" id="reminders-settings">
      
      {/* 1. NOTIFICATION SETTINGS CONTROLLER */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-900/40 border border-blue-800/40 text-blue-400 rounded-xl">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Periodic Reminders</p>
              <p className="text-[10px] text-slate-400">Receive alerts to keep hydrated</p>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.enabled ? 'bg-sky-400 justify-end' : 'bg-slate-800 justify-start'}`}
          >
            <span className="w-4 h-4 bg-slate-950 rounded-full shadow-md"></span>
          </button>
        </div>

        {settings.enabled && (
          <div className="space-y-3.5 pt-1.5 border-t border-slate-800 animate-fadeIn">
            {/* Interval frequency selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Interval Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {intervals.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => onUpdateSettings({ intervalMinutes: freq.value })}
                    className={`py-2 px-1 text-xs rounded-xl font-medium border text-center transition-all ${settings.intervalMinutes === freq.value ? 'bg-sky-500/10 border-sky-400 text-sky-450' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-850'}`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio chime toggle */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-[11px] text-slate-300">Play Audio Chimes</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className="text-[10px] bg-slate-800 border border-slate-700/65 px-2.5 py-1 rounded-lg hover:bg-slate-750 text-slate-300"
              >
                {settings.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. REAL-TIME TESTING & SIMULATION PANEL (THE CRITICAL ELEMENT FOR DEMO) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 space-y-3">
        <div>
          <p className="text-xs font-semibold text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Immediate Simulation
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">Force trigger notification banners instantly to test animations & chimes:</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTestReminder}
            className="p-2.5 bg-slate-950/60 border border-slate-850 hover:bg-slate-950/90 text-left rounded-xl transition-all font-medium text-xs text-slate-300 flex flex-col gap-1 select-none active:scale-98"
          >
            <Bell className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-white">Daily Reminder</span>
            <span className="text-[9px] text-slate-500 leading-normal">Test periodic reminder alert</span>
          </button>

          <button
            onClick={handleTestAchievement}
            className="p-2.5 bg-slate-950/60 border border-slate-850 hover:bg-slate-950/90 text-left rounded-xl transition-all font-medium text-xs text-slate-300 flex flex-col gap-1 select-none active:scale-98"
          >
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-white">Goal Victory</span>
            <span className="text-[9px] text-slate-500 leading-normal">Simulate milestone completion</span>
          </button>
        </div>
      </div>

      {/* 3. HARDWARE PREVIEW SKIN TOGGLE */}
      <div className="bg-[#0D1325]/10 border border-slate-800/60 rounded-2xl p-4.5 space-y-3">
        <div>
          <p className="text-xs font-semibold text-white flex items-center gap-1">
            <Smartphone className="w-4 h-4 text-blue-400" /> Emulator Shell Skin
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">Toggle visual layout framework skins on the fly:</p>
        </div>

        <div className="flex gap-1.5">
          {[
            { id: 'ios', label: 'Apple iOS' },
            { id: 'android', label: 'Material Android' },
            { id: 'web', label: 'Fluid Web' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => onChangePlatform(theme.id as PlatformType)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-xl text-center border transition-all ${platform === theme.id ? 'bg-sky-400 border-sky-400 text-slate-950 font-bold' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. WEB BROWSER NOTIFICATIONS PERMISSION REGISTRAR */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 flex items-center justify-between text-left gap-3">
        <div className="space-y-0.5 max-w-[190px]">
          <p className="text-[10px] font-semibold text-white flex items-center gap-1">
            <Bell className="w-3 h-3 text-sky-400" /> OS Notifications API
          </p>
          <p className="text-[9px] text-slate-400 leading-tight">
            Toggle real desktop popups outside the iframe view.
          </p>
        </div>
        
        {nativePermissionState === 'granted' ? (
          <span className="text-[9px] bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-2 py-1 rounded font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> ACTIVE
          </span>
        ) : nativePermissionState === 'denied' ? (
          <span className="text-[9px] bg-red-950/40 border border-red-900 text-red-400 px-2 py-1 rounded font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> DENIED
          </span>
        ) : (
          <button
            onClick={requestNativePermissions}
            className="text-[9px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-2.5 py-1.5 rounded transition-all shrink-0"
          >
            REQUEST
          </button>
        )}
      </div>

    </div>
  );
}
