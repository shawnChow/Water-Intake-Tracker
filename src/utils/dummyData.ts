/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyHistory, WaterLog } from '../types';

export function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

export function generateHistoricalData(dailyGoal: number): DailyHistory[] {
  const data: DailyHistory[] = [];
  
  // Set of typical beverage amounts log and timestamps
  const statsDefaults = [
    { 
      // 6 days ago (Partially hydrated: 1330ml / 2000ml)
      goalOffset: 0,
      logs: [
        { amount: 250, time: "08:15", source: "quick_cup" },
        { amount: 500, time: "11:30", source: "quick_flask" },
        { amount: 250, time: "15:45", source: "quick_cup" },
        { amount: 330, time: "19:20", source: "quick_bottle" },
      ]
    },
    { 
      // 5 days ago (Fully hydrated: 2080ml / 2000ml)
      goalOffset: 0,
      logs: [
        { amount: 330, time: "07:30", source: "quick_bottle" },
        { amount: 500, time: "10:15", source: "quick_flask" },
        { amount: 500, time: "13:20", source: "quick_flask" },
        { amount: 250, time: "16:40", source: "quick_cup" },
        { amount: 500, time: "20:00", source: "quick_flask" },
      ]
    },
    { 
      // 4 days ago (Dehydrated workday: 830ml / 2000ml)
      goalOffset: 0,
      logs: [
        { amount: 500, time: "09:00", source: "quick_flask" },
        { amount: 330, time: "14:15", source: "quick_bottle" },
      ]
    },
    { 
      // 3 days ago (Amazing hydration: 2500ml / 2000ml)
      goalOffset: 0,
      logs: [
        { amount: 500, time: "08:00", source: "quick_flask" },
        { amount: 500, time: "11:00", source: "quick_flask" },
        { amount: 250, time: "14:00", source: "quick_cup" },
        { amount: 500, time: "17:15", source: "quick_flask" },
        { amount: 750, time: "19:45", source: "custom" },
      ]
    },
    { 
      // 2 days ago (Very close: 1830ml / 2000ml)
      goalOffset: 0,
      logs: [
        { amount: 330, time: "08:30", source: "quick_bottle" },
        { amount: 500, time: "11:00", source: "quick_flask" },
        { amount: 250, time: "13:30", source: "quick_cup" },
        { amount: 250, time: "16:15", source: "quick_cup" },
        { amount: 500, time: "21:00", source: "quick_flask" },
      ]
    },
    { 
      // Yesterday (Exceeded goal: 2250ml / 2000ml)
      goalOffset: 0,
      logs: [
        { amount: 500, time: "08:45", source: "quick_flask" },
        { amount: 250, time: "11:15", source: "quick_cup" },
        { amount: 500, time: "14:30", source: "quick_flask" },
        { amount: 500, time: "18:00", source: "quick_flask" },
        { amount: 500, time: "21:15", source: "quick_flask" },
      ]
    }
  ];

  statsDefaults.forEach((dayData, idx) => {
    const daysAgo = 6 - idx;
    const dateStr = getPastDateString(daysAgo);
    
    const logs: WaterLog[] = dayData.logs.map((logItem, logIdx) => ({
      id: `hist-${daysAgo}-${logIdx}`,
      amount: logItem.amount,
      timestamp: `${dateStr}T${logItem.time}:00Z`,
      source: logItem.source as any,
    }));

    data.push({
      date: dateStr,
      logs,
      goal: dailyGoal,
    });
  });

  return data;
}
