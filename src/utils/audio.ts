let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playTickSound = () => {
  const ctx = initAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

export const playWinSound = () => {
  const ctx = initAudio();
  if (!ctx) return;
  
  const playNote = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = ctx.currentTime;
  playNote(440, now, 0.3); // A4
  playNote(554.37, now + 0.1, 0.3); // C#5
  playNote(659.25, now + 0.2, 0.5); // E5
  playNote(880, now + 0.3, 0.8); // A5
};
