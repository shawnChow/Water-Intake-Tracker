/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function playWaterSound() {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  
  // Create multiple bubbles at rapid intervals to simulate water pouring
  const playBubble = (delay: number, pitchOffset: number) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Rising pitch for water filling up
      const startFreq = 180 + pitchOffset;
      const endFreq = 280 + pitchOffset;
      
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    }, delay);
  };

  // Trigger bubble notes
  playBubble(0, 50);
  playBubble(80, 70);
  playBubble(160, 95);
  playBubble(240, 120);
}

export function playNotificationSound(platform: 'ios' | 'android') {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();

  if (platform === 'ios') {
    // Elegant, bright high-pitched tri-tone-like cue
    const notes = [587.33, 659.25, 783.99]; // D5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.25);
      
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
    });
  } else {
    // Smooth Android dual-frequency warm bell ring
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
    osc1.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.2); // C5
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    
    gain2.gain.setValueAtTime(0.06, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);
    
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.4);
  }
}
