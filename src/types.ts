/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlatformType = 'ios' | 'android' | 'web';

export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: string; // ISO string
  source: 'quick_cup' | 'quick_bottle' | 'quick_flask' | 'custom';
}

export interface DailyHistory {
  date: string; // YYYY-MM-DD
  logs: WaterLog[];
  goal: number; // user goal on that day
}

export interface ReminderSetting {
  enabled: boolean;
  intervalMinutes: number; // 30, 60, 120, etc.
  startTime: string; // "08:00"
  endTime: string; // "22:00"
  soundEnabled: boolean;
}

export interface SimulatedNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  platform: 'ios' | 'android';
  category: 'reminder' | 'achievement' | 'alert';
}

export interface BeverageOption {
  id: string;
  name: string;
  amount: number; // ml
  icon: string; // icon key for lucide
  color: string; // tailwind color configuration
}
