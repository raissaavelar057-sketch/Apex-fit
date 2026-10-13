/**
 * Synthesizes an alert chime using Web Audio API
 * Guaranteed to work offline with zero external network assets.
 */
export function playRestTimerBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // Play 3 quick rhythmic chimes (gym timer style)
    [0, 0.18, 0.36].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 2 ? 880 : 587.33, now + offset); // D5 -> D5 -> A5

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.16);
    });
  } catch {
    // Graceful fallback if audio is not permitted yet by user interaction
  }
}
