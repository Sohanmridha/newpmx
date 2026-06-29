// High-Fidelity Web Audio API Synthesizer for Focus, Study & Reflection
// 100% Offline, lightweight, zero-network footprint, and extremely robust.
// Includes 20 procedurally synthesized soundscapes & focus environments.

let audioCtx: AudioContext | null = null;
let currentNodes: {
  sources: AudioNode[];
  intervals: NodeJS.Timeout[];
  gains: GainNode[];
} = { sources: [], intervals: [], gains: [] };

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Auto-unlock helper on first human touch/click interaction inside iframe
    const unlock = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          console.log("AudioContext successfully unlocked via user interaction event.");
          removeListeners();
        }).catch(err => console.warn("AudioContext unlock failed:", err));
      } else if (audioCtx && audioCtx.state === 'running') {
        removeListeners();
      }
    };
    
    const removeListeners = () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(e => console.warn("Failed to resume AudioContext inside function:", e));
  }
  return audioCtx;
}

// Clean up helper to stop all running nodes instantly
export function stopAllSynthSounds() {
  try {
    currentNodes.sources.forEach(source => {
      try {
        (source as any).stop();
      } catch (e) {}
    });
    currentNodes.intervals.forEach(interval => clearInterval(interval));
    currentNodes.gains.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {}
    });
    currentNodes = { sources: [], intervals: [], gains: [] };
  } catch (err) {
    console.warn("Stopping audio synth nodes warning:", err);
  }
}

// Helper to create white noise buffer
function createNoiseBuffer(ctx: AudioContext, type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // correction
      b6 = white * 0.115926;
    }
  } else { // brown
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // compensation
    }
  }
  return buffer;
}

// 1. SILENCE / NONE (handled at App level directly by calling stopAllSynthSounds)

// 2. SOFT RAIN (Ambient Rain with sweeping filter)
export function startRainSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 'pink');
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 850;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // slow breath

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 250;

  const masterGain = ctx.createGain();
  masterGain.gain.value = volume * 0.22;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  noise.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  lfo.start();
  noise.start();

  currentNodes.sources.push(noise, lfo);
  currentNodes.gains.push(masterGain);
}

// 3. BINUARAL COSMIC THETA (100Hz / 106Hz Deep Delta/Theta Therapy)
export function startCosmicSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.value = 110;
  
  osc2.type = 'sine';
  osc2.frequency.value = 116; // 6Hz Theta differential

  gain.gain.value = volume * 0.35;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 140;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start();
  osc2.start();

  currentNodes.sources.push(osc1, osc2);
  currentNodes.gains.push(gain);
}

// 4. METRONOME ANALOGUE CLOCK
export function startClockSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  let tick = true;

  const playTick = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(tick ? 1200 : 900, ctx.currentTime);
    tick = !tick;

    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 10;

    gain.gain.setValueAtTime(volume * 0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  };

  playTick();
  const interval = setInterval(playTick, 1000);
  currentNodes.intervals.push(interval);
}

// 5. ZEN FLUTE (Triangle wave breathing sound)
export function startFluteSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.value = 220; // A3 note

  // Modulate frequency to create wind sweep vibrato
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.2; // very slow blow
  
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 1.8;

  filter.type = 'lowpass';
  filter.frequency.value = 350;

  gain.gain.value = volume * 0.25;

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  lfo.start();
  osc.start();

  currentNodes.sources.push(osc, lfo);
  currentNodes.gains.push(gain);
}

// 6. COFFEE SHOP HUM (Procedural ambient chatter & mug clinks)
export function startCafeSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  
  // Brown noise background hub
  const background = ctx.createBufferSource();
  background.buffer = createNoiseBuffer(ctx, 'brown');
  background.loop = true;

  const bgFilter = ctx.createBiquadFilter();
  bgFilter.type = 'lowpass';
  bgFilter.frequency.value = 150;

  const bgGain = ctx.createGain();
  bgGain.gain.value = volume * 0.45;

  background.connect(bgFilter);
  bgFilter.connect(bgGain);
  bgGain.connect(ctx.destination);
  background.start();
  currentNodes.sources.push(background);

  // Random clinking sounds
  const playClink = () => {
    if (Math.random() > 0.4) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 1800 + Math.random() * 800;
      
      gain.gain.setValueAtTime(volume * 0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  };

  const interval = setInterval(playClink, 1500);
  currentNodes.intervals.push(interval);
}

// 7. FOREST SWEEPING WIND
export function startWindSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 'pink');
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 200;
  filter.Q.value = 4.0;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08; // extremely slow wind sweep

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 180;

  const masterGain = ctx.createGain();
  masterGain.gain.value = volume * 0.45;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  noise.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  lfo.start();
  noise.start();

  currentNodes.sources.push(noise, lfo);
  currentNodes.gains.push(masterGain);
}

// 8. CRASHING OCEAN WAVES (Low frequency swept swell)
export function startOceanSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 'brown');
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 350;

  // LFO modulates the master volume to mimic wave tide (around 5 seconds)
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.16; // 6sec period

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.4;

  const masterGain = ctx.createGain();
  masterGain.gain.value = volume * 0.18;

  lfo.connect(lfoGain);
  // Modulate masterGain directly!
  lfoGain.connect(masterGain.gain);
  noise.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  lfo.start();
  noise.start();

  currentNodes.sources.push(noise, lfo);
  currentNodes.gains.push(masterGain);
}

// 9. CAMPFIRE CRACKLE (Pink noise background + fast impulses)
export function startCampfireSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  // Low rumble
  const rumble = ctx.createBufferSource();
  rumble.buffer = createNoiseBuffer(ctx, 'brown');
  rumble.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 80;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = volume * 0.35;

  rumble.connect(filter);
  filter.connect(rumbleGain);
  rumbleGain.connect(ctx.destination);
  rumble.start();
  currentNodes.sources.push(rumble);

  // Fast random crackles
  const playCrackle = () => {
    if (Math.random() > 0.3) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const crackleFilter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = 400 + Math.random() * 2000;
      
      crackleFilter.type = 'highpass';
      crackleFilter.frequency.value = 1000;

      gain.gain.setValueAtTime(volume * 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.008);

      osc.connect(crackleFilter);
      crackleFilter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    }
  };

  const interval = setInterval(playCrackle, 80);
  currentNodes.intervals.push(interval);
}

// 10. LOFI STUDY BEAT CO-PILOT (Rhythmic lofi loops)
export function startLofiSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  let step = 0;

  // Soothing background pad
  const pad1 = ctx.createOscillator();
  const padGain = ctx.createGain();
  pad1.type = 'sine';
  pad1.frequency.value = 146.83; // D3 note
  padGain.gain.value = volume * 0.12;
  pad1.connect(padGain);
  padGain.connect(ctx.destination);
  pad1.start();
  currentNodes.sources.push(pad1);

  const playBeat = () => {
    const isKick = step % 4 === 0;
    const isSnare = step % 4 === 2;

    if (isKick) {
      // Synth Kick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (isSnare) {
      // Soft Snare
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 'pink');
      const gain = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 900;
      noise.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(volume * 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      noise.start();
      noise.stop(ctx.currentTime + 0.12);
    } else {
      // Soft Hihat
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 8000;
      gain.gain.setValueAtTime(volume * 0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }

    step++;
  };

  playBeat();
  // Roughly 75 BPM lofi (800ms)
  const interval = setInterval(playBeat, 800);
  currentNodes.intervals.push(interval);
}

// 11. ACADEMIC LIBRARY BACKGROUND HUM
export function startLibrarySynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const masterGain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.value = 120;
  osc2.type = 'sine';
  osc2.frequency.value = 120.4; // super slow chorus beating

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 110;

  masterGain.gain.value = volume * 0.25;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start();
  osc2.start();

  currentNodes.sources.push(osc1, osc2);
  currentNodes.gains.push(masterGain);
}

// 12. BINAURAL ALPHA CONCENTRATION (150Hz / 160Hz - 10Hz Alpha State)
export function startAlphaSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const left = ctx.createOscillator();
  const right = ctx.createOscillator();
  const master = ctx.createGain();

  left.type = 'sine';
  left.frequency.value = 150; // left ear
  
  right.type = 'sine';
  right.frequency.value = 160; // right ear (10Hz focus alpha shift)

  master.gain.value = volume * 0.32;

  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 180;

  left.connect(f);
  right.connect(f);
  f.connect(master);
  master.connect(ctx.destination);

  left.start();
  right.start();

  currentNodes.sources.push(left, right);
  currentNodes.gains.push(master);
}

// 13. PLAIN WHITE NOISE (Pure static isolation)
export function startWhiteNoiseSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  const src = ctx.createBufferSource();
  src.buffer = createNoiseBuffer(ctx, 'white');
  src.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.08;

  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();

  currentNodes.sources.push(src);
}

// 14. PLAIN PINK NOISE (Balanced low frequency biased)
export function startPinkNoiseSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  const src = ctx.createBufferSource();
  src.buffer = createNoiseBuffer(ctx, 'pink');
  src.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.18;

  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();

  currentNodes.sources.push(src);
}

// 15. PLAIN BROWN NOISE (Deepest heavy rumble)
export function startBrownNoiseSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  const src = ctx.createBufferSource();
  src.buffer = createNoiseBuffer(ctx, 'brown');
  src.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.35;

  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();

  currentNodes.sources.push(src);
}

// 16. TIBETAN SINGING BOWL (FM Resonator struck bell)
export function startSingingBowlSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playStrike = () => {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const mainGain = ctx.createGain();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(144, ctx.currentTime); // D3 chord

    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(3.5, ctx.currentTime); // slow beating feel

    modGain.gain.setValueAtTime(1.5, ctx.currentTime);
    mainGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.9);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(mainGain);
    mainGain.connect(ctx.destination);

    carrier.start();
    modulator.start();
    carrier.stop(ctx.currentTime + 5.0);
    modulator.stop(ctx.currentTime + 5.0);
  };

  playStrike();
  const interval = setInterval(playStrike, 5000);
  currentNodes.intervals.push(interval);
}

// 17. SUMMER CICADAS (High speed ringing modulated pulses)
export function startCicadasSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playBuzz = () => {
    const osc = ctx.createOscillator();
    const pulse = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    const mainGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 4500;

    pulse.type = 'sine';
    pulse.frequency.value = 35; // buzzing frequency ring modulation

    pulseGain.gain.value = 500;
    mainGain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    pulse.connect(pulseGain);
    pulseGain.connect(osc.frequency);
    osc.connect(mainGain);
    mainGain.connect(ctx.destination);

    osc.start();
    pulse.start();
    osc.stop(ctx.currentTime + 1.3);
    pulse.stop(ctx.currentTime + 1.3);
  };

  playBuzz();
  // Buzz every 2.5 seconds
  const interval = setInterval(playBuzz, 2500);
  currentNodes.intervals.push(interval);
}

// 18. SUBMARINE SONAR (Pings echoing)
export function startSonarSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playPing = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const delay = ctx.createDelay();
    const feedback = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    delay.delayTime.value = 0.25;
    feedback.gain.value = 0.4;

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Echo circuit
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  playPing();
  const interval = setInterval(playPing, 3000);
  currentNodes.intervals.push(interval);
}

// 19. SPACE CABIN COMPUTERS (Cosmic hum with subtle beeps)
export function startSpaceCabinSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  // background drone
  const osc = ctx.createOscillator();
  const droneGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 85;
  droneGain.gain.value = volume * 0.25;
  osc.connect(droneGain);
  droneGain.connect(ctx.destination);
  osc.start();
  currentNodes.sources.push(osc);

  // random mini space beeps
  const playBeep = () => {
    if (Math.random() > 0.4) {
      const beepOsc = ctx.createOscillator();
      const beepGain = ctx.createGain();
      
      beepOsc.type = 'sine';
      beepOsc.frequency.value = 2200 + Math.random() * 1200;
      
      beepGain.gain.setValueAtTime(volume * 0.015, ctx.currentTime);
      beepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      beepOsc.connect(beepGain);
      beepGain.connect(ctx.destination);

      beepOsc.start();
      beepOsc.stop(ctx.currentTime + 0.1);
    }
  };

  const interval = setInterval(playBeep, 1200);
  currentNodes.intervals.push(interval);
}

// 20. PURRING CAT AT WORK
export function startPurrSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const masterGain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 25; // extremely low frequency rumbles

  lfo.type = 'sine';
  lfo.frequency.value = 16; // 16Hz vibration frequency

  lfoGain.gain.value = 12;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 45; // filter out harsh treble, leaving rumbling purr

  masterGain.gain.value = volume * 0.65;

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(lowpass);
  lowpass.connect(masterGain);
  masterGain.connect(ctx.destination);

  lfo.start();
  osc.start();

  currentNodes.sources.push(osc, lfo);
  currentNodes.gains.push(masterGain);
}

// 21. RESTING HEARTBEAT METRONOME (Restful lub-dub pacing)
export function startHeartbeatSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playLubDub = () => {
    // 1st Sound: LUB
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filt1 = ctx.createBiquadFilter();
    
    osc1.connect(filt1);
    filt1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.frequency.setValueAtTime(55, ctx.currentTime);
    filt1.type = 'lowpass';
    filt1.frequency.value = 80;

    gain1.gain.setValueAtTime(volume * 0.45, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.18);

    // 2nd Sound: DUB (starts 220ms after first)
    setTimeout(() => {
      if (!ctx || ctx.state === 'closed') return;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filt2 = ctx.createBiquadFilter();
      
      osc2.connect(filt2);
      filt2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.frequency.setValueAtTime(52, ctx.currentTime);
      filt2.type = 'lowpass';
      filt2.frequency.value = 75;

      gain2.gain.setValueAtTime(volume * 0.40, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.15);
    }, 220);
  };

  playLubDub();
  // Resting heart rate: 60 BPM (1000ms intervals)
  const interval = setInterval(playLubDub, 1000);
  currentNodes.intervals.push(interval);
}

// FITNESS LIVE WORKOUT SYNTH BEAT
export function startWorkoutBeatSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  let beatStep = 0;

  const playBeat = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(beatStep % 4 === 0 ? 110 : 80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
    
    osc.type = 'sine';
    gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);

    if (beatStep % 2 !== 0) {
      const hat = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hat.connect(hatGain);
      hatGain.connect(ctx.destination);

      hat.type = 'sine';
      hat.frequency.value = 6000;
      hatGain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
      hatGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      hat.start();
      hat.stop(ctx.currentTime + 0.05);
    }
    beatStep++;
  };

  playBeat();
  // 130 BPM energetic gym tempo (roughly 460ms intervals)
  const interval = setInterval(playBeat, 460);
  currentNodes.intervals.push(interval);
}
