// Web Audio API helper for pitch tones, articulation metronome, breath cues and audio feedback

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle Pitch Tone Generator for humming and resonance guide
let activeToneOsc: OscillatorNode | null = null;
let activeToneGain: GainNode | null = null;

export function playGuideTone(frequency: number = 130, durationSec: number = 3) {
  try {
    const ctx = getAudioContext();
    stopGuideTone();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Smooth soft attack & decay
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationSec);

    activeToneOsc = osc;
    activeToneGain = gain;
  } catch (err) {
    console.warn('Audio tone play error:', err);
  }
}

export function stopGuideTone() {
  try {
    if (activeToneGain && audioCtx) {
      activeToneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    }
    if (activeToneOsc) {
      activeToneOsc.stop();
      activeToneOsc.disconnect();
      activeToneOsc = null;
    }
  } catch (e) {
    // ignore
  }
}

// Gentle Pitch Glide for warmups (e.g. 120Hz -> 220Hz -> 120Hz)
export function playPitchGlide(startFreq: number = 120, peakFreq: number = 220, durationSec: number = 4) {
  try {
    const ctx = getAudioContext();
    stopGuideTone();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(peakFreq, ctx.currentTime + (durationSec / 2));
    osc.frequency.exponentialRampToValueAtTime(startFreq, ctx.currentTime + durationSec);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationSec);

    activeToneOsc = osc;
    activeToneGain = gain;
  } catch (err) {
    console.warn('Glide tone error:', err);
  }
}

// Articulation Metronome Click
export function playMetronomeClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // ignore
  }
}

// Breathing in/out soft chime cue
export function playBreathCue(type: 'inhale' | 'exhale' | 'hold') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = type === 'inhale' ? 440 : type === 'hold' ? 520 : 330;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // ignore
  }
}

// Success Celebration Chord
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 1.2);
    });
  } catch (e) {
    // ignore
  }
}

// Microphone Analyser Setup for Real-time Voice Visualizer & Volume
export class LiveVoiceAnalyser {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<boolean> {
    try {
      this.ctx = getAudioContext();
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.source = this.ctx.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);
      this.isRunning = true;
      return true;
    } catch (err) {
      console.warn('Microphone permission or analyser error:', err);
      return false;
    }
  }

  getVolumeLevel(): number {
    if (!this.analyser || !this.isRunning) return 0;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    const avg = sum / data.length;
    return Math.min(100, Math.round((avg / 128) * 100));
  }

  getFrequencyData(array: Uint8Array): void {
    if (this.analyser && this.isRunning) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  getWaveformData(array: Uint8Array): void {
    if (this.analyser && this.isRunning) {
      this.analyser.getByteTimeDomainData(array);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    this.analyser = null;
  }
}
