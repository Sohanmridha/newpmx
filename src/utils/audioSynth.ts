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

// 21. FOREST BIRDS CHIRPING (পাখির কিচিরমিচির)
export function startBirdsSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  
  // Background forest wind
  const windNode = ctx.createBufferSource();
  windNode.buffer = createNoiseBuffer(ctx, 'pink');
  windNode.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 350;
  const windGain = ctx.createGain();
  windGain.gain.value = volume * 0.04;
  windNode.connect(filter);
  filter.connect(windGain);
  windGain.connect(ctx.destination);
  windNode.start();
  currentNodes.sources.push(windNode);
  currentNodes.gains.push(windGain);

  const chirp = () => {
    if (Math.random() > 0.4) {
      const count = Math.floor(Math.random() * 3) + 2;
      let startTime = ctx.currentTime;
      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        
        const baseFreq = 2200 + Math.random() * 800;
        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 500, startTime + 0.05);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.06, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);
        
        osc.start(startTime);
        osc.stop(startTime + 0.07);
        startTime += 0.08 + Math.random() * 0.06;
      }
    }
  };

  chirp();
  const interval = setInterval(chirp, 1600);
  currentNodes.intervals.push(interval);
}

// 22. COZY STORM & COLD RAIN (মেঘাচ্ছন্ন বৃষ্টি ও বজ্রপাত)
export function startCozyRainSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const rainNode = ctx.createBufferSource();
  rainNode.buffer = createNoiseBuffer(ctx, 'pink');
  rainNode.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 550;
  const rainGain = ctx.createGain();
  rainGain.gain.value = volume * 0.22;
  rainNode.connect(filter);
  filter.connect(rainGain);
  rainGain.connect(ctx.destination);
  rainNode.start();
  currentNodes.sources.push(rainNode);
  currentNodes.gains.push(rainGain);

  const thunder = () => {
    if (Math.random() > 0.6) {
      const osc = ctx.createOscillator();
      const tGain = ctx.createGain();
      const tFilter = ctx.createBiquadFilter();
      osc.connect(tFilter);
      tFilter.connect(tGain);
      tGain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(15, ctx.currentTime + 3.0);
      
      tFilter.type = 'lowpass';
      tFilter.frequency.setValueAtTime(60, ctx.currentTime);
      
      tGain.gain.setValueAtTime(0, ctx.currentTime);
      tGain.gain.linearRampToValueAtTime(volume * 0.28, ctx.currentTime + 0.6);
      tGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 3.6);
    }
  };

  const interval = setInterval(thunder, 4500);
  currentNodes.intervals.push(interval);
}

// 23. DEEP FOCUS RETENTION SYMPHONY (মনোযোগ ধরে রাখার মিউজিক)
export function startDeepFocusSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();
  
  const playPad = (freq: number, startDelay: number, duration: number, voiceVol: number) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const fGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(fGain);
    fGain.connect(ctx.destination);
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq - 1.2, ctx.currentTime + startDelay);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime + startDelay);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, ctx.currentTime + startDelay);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + startDelay + duration / 2);
    filter.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + startDelay + duration - 0.4);
    
    fGain.gain.setValueAtTime(0, ctx.currentTime + startDelay);
    fGain.gain.linearRampToValueAtTime(voiceVol * volume * 0.22, ctx.currentTime + startDelay + 1.2);
    fGain.gain.linearRampToValueAtTime(0, ctx.currentTime + startDelay + duration);
    
    osc1.start(ctx.currentTime + startDelay);
    osc2.start(ctx.currentTime + startDelay);
    osc1.stop(ctx.currentTime + startDelay + duration);
    osc2.stop(ctx.currentTime + startDelay + duration);
  };

  const chordProgression = [
    [130.81, 164.81, 196.00, 246.94], // C maj7 (C3, E3, G3, B3)
    [146.83, 174.61, 220.00, 261.63], // D min7 (D3, F3, A3, C4)
    [110.00, 130.81, 164.81, 196.00], // A min7 (A2, C3, E3, G3)
    [130.81, 174.61, 220.00, 261.63]  // F maj7
  ];

  let currentChordIdx = 0;
  const triggerNextChord = () => {
    const notes = chordProgression[currentChordIdx];
    notes.forEach((freq) => {
      playPad(freq, 0, 7.8, 0.2);
    });
    currentChordIdx = (currentChordIdx + 1) % chordProgression.length;
  };

  triggerNextChord();
  const interval = setInterval(triggerNextChord, 8000);
  currentNodes.intervals.push(interval);
}

// 24. DEEP RELAXATION DRONE (গভীর শিথিলতা রাগ)
export function startDeepRelaxSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const masterGain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.value = 87.31; // F2
  osc2.type = 'triangle';
  osc2.frequency.value = 130.81; // C3

  filter.type = 'lowpass';
  filter.frequency.value = 140;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.04;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 70;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  masterGain.gain.value = volume * 0.32;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  lfo.start();
  osc1.start();
  osc2.start();

  currentNodes.sources.push(osc1, osc2, lfo);
  currentNodes.gains.push(masterGain);
}

// 25. STUDY COGNITIVE COGNIZANCE (গামা স্টাডি তরঙ্গ)
export function startStudyWaveSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const oscL = ctx.createOscillator();
  const oscR = ctx.createOscillator();
  const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const masterGain = ctx.createGain();

  oscL.type = 'sine';
  oscL.frequency.value = 220; // 220Hz

  oscR.type = 'sine';
  oscR.frequency.value = 260; // 260Hz (40Hz Gamma differential)

  masterGain.gain.value = volume * 0.25;

  if (pannerL && pannerR) {
    pannerL.pan.value = -1;
    pannerR.pan.value = 1;
    oscL.connect(pannerL);
    pannerL.connect(masterGain);
    oscR.connect(pannerR);
    pannerR.connect(masterGain);
  } else {
    oscL.connect(masterGain);
    oscR.connect(masterGain);
  }

  masterGain.connect(ctx.destination);

  oscL.start();
  oscR.start();

  currentNodes.sources.push(oscL, oscR);
  currentNodes.gains.push(masterGain);
}

// 26. SHANTI MINIMALIST PIANO CHORDS (শান্ত পিয়ানো সুর)
export function startPianoStudySynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playPianoNote = (freq: number, velocity: number = 0.5) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(velocity * volume * 0.22, ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.3);
  };

  const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic C
  const autoPlay = () => {
    if (Math.random() > 0.3) {
      const randomNote = scale[Math.floor(Math.random() * scale.length)];
      playPianoNote(randomNote, 0.4 + Math.random() * 0.3);
    }
  };

  autoPlay();
  const interval = setInterval(autoPlay, 1300);
  currentNodes.intervals.push(interval);
}

// 27. BUBBLING NATURE STREAM (পাহাড়ি ঝর্ণা ও বাতাস)
export function startNatureStreamSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const streamBase = ctx.createBufferSource();
  streamBase.buffer = createNoiseBuffer(ctx, 'pink');
  streamBase.loop = true;
  const sFilter = ctx.createBiquadFilter();
  sFilter.type = 'bandpass';
  sFilter.frequency.value = 420;
  const sGain = ctx.createGain();
  sGain.gain.value = volume * 0.12;
  streamBase.connect(sFilter);
  sFilter.connect(sGain);
  sGain.connect(ctx.destination);
  streamBase.start();
  currentNodes.sources.push(streamBase);
  currentNodes.gains.push(sGain);

  const makeBubble = () => {
    const osc = ctx.createOscillator();
    const bGain = ctx.createGain();
    osc.connect(bGain);
    bGain.connect(ctx.destination);
    
    osc.type = 'sine';
    const baseF = 380 + Math.random() * 400;
    osc.frequency.setValueAtTime(baseF, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseF * 1.7, ctx.currentTime + 0.07);
    
    bGain.gain.setValueAtTime(0, ctx.currentTime);
    bGain.gain.linearRampToValueAtTime(volume * 0.08, ctx.currentTime + 0.01);
    bGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const interval = setInterval(() => {
    if (Math.random() > 0.25) {
      makeBubble();
    }
  }, 380);
  currentNodes.intervals.push(interval);
}

// 28. TIBETAN PRAYER BELLS (তিব্বতি প্রার্থনা ঘণ্টা)
export function startTibetanBellSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playBowl = () => {
    const osc = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const mGain = ctx.createGain();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    mod.connect(mGain);
    mGain.connect(osc.frequency);

    osc.type = 'sine';
    osc.frequency.value = 293.66; // D4

    mod.type = 'sine';
    mod.frequency.value = 3.2;
    mGain.gain.value = 3.5;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.2);

    mod.start();
    osc.start();
    mod.stop(ctx.currentTime + 4.3);
    osc.stop(ctx.currentTime + 4.3);
  };

  playBowl();
  const interval = setInterval(playBowl, 5200);
  currentNodes.intervals.push(interval);
}

// 29. GLITTERY COSMIC CHIMES (মহাজাগতিক ঝংকার)
export function startCosmicChimesSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playChimeNote = (freq: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.1, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.7);
  };

  const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
  const interval = setInterval(() => {
    if (Math.random() > 0.45) {
      const notesToPlay = Math.random() > 0.75 ? 2 : 1;
      for (let i = 0; i < notesToPlay; i++) {
        const f = scale[Math.floor(Math.random() * scale.length)];
        const delay = Math.random() * 0.12;
        setTimeout(() => {
          if (!ctx || ctx.state === 'closed') return;
          playChimeNote(f);
        }, delay * 1000);
      }
    }
  }, 1200);
  currentNodes.intervals.push(interval);
}

// 30. DEEP JAPANESE ZEN HARP (জেন্টল জেন হার্প)
export function startZenHarpSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  const playPluck = (freq: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.24, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  const scale = [196.00, 220.00, 293.66, 329.63, 392.00, 440.00, 587.33];
  const autoHarp = () => {
    if (Math.random() > 0.35) {
      const note = scale[Math.floor(Math.random() * scale.length)];
      playPluck(note);
    }
  };

  autoHarp();
  const interval = setInterval(autoHarp, 1600);
  currentNodes.intervals.push(interval);
}

// 31. RAIN ON WINDOW (জানালায় রিমঝিম বৃষ্টি)
export function startRainWindowSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  // Dense rain on background
  const rainNode = ctx.createBufferSource();
  rainNode.buffer = createNoiseBuffer(ctx, 'pink');
  rainNode.loop = true;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 450;
  
  const rainGain = ctx.createGain();
  rainGain.gain.value = volume * 0.16;
  
  rainNode.connect(filter);
  filter.connect(rainGain);
  rainGain.connect(ctx.destination);
  rainNode.start();
  currentNodes.sources.push(rainNode);
  currentNodes.gains.push(rainGain);

  // Droplet hits on the glass pane
  const playGlassDrip = () => {
    if (Math.random() > 0.3) {
      const osc = ctx.createOscillator();
      const dripGain = ctx.createGain();
      const dripFilter = ctx.createBiquadFilter();

      osc.type = 'sine';
      const f = 150 + Math.random() * 80;
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 0.4, ctx.currentTime + 0.12);

      dripFilter.type = 'lowpass';
      dripFilter.frequency.setValueAtTime(250, ctx.currentTime);

      dripGain.gain.setValueAtTime(0, ctx.currentTime);
      dripGain.gain.linearRampToValueAtTime(volume * 0.14, ctx.currentTime + 0.01);
      dripGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(dripFilter);
      dripFilter.connect(dripGain);
      dripGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    }
  };

  const interval = setInterval(playGlassDrip, 450);
  currentNodes.intervals.push(interval);
}

// 32. BINAURAL DEEP STUDY (বাইনোরাল ডিপ স্টাডি বিট)
export function startBinauralLofiSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  // 1. 10Hz Alpha / 14Hz Beta study wave differential
  const leftOsc = ctx.createOscillator();
  const rightOsc = ctx.createOscillator();
  const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const waveGain = ctx.createGain();

  leftOsc.type = 'sine';
  leftOsc.frequency.value = 140; // 140Hz
  rightOsc.type = 'sine';
  rightOsc.frequency.value = 152; // 152Hz (12Hz Focus Alpha/Beta boundary)

  waveGain.gain.value = volume * 0.18;

  if (pannerL && pannerR) {
    pannerL.pan.value = -1;
    pannerR.pan.value = 1;
    leftOsc.connect(pannerL);
    pannerL.connect(waveGain);
    rightOsc.connect(pannerR);
    pannerR.connect(waveGain);
  } else {
    leftOsc.connect(waveGain);
    rightOsc.connect(waveGain);
  }
  waveGain.connect(ctx.destination);
  leftOsc.start();
  rightOsc.start();
  currentNodes.sources.push(leftOsc, rightOsc);

  // 2. Slow deep soothing lofi pads
  const playSoothingPad = (freq: number, startDelay: number, duration: number) => {
    const osc = ctx.createOscillator();
    const padGain = ctx.createGain();
    const padFilter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(180, ctx.currentTime + startDelay);
    padFilter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + startDelay + duration / 2);
    padFilter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + startDelay + duration);

    padGain.gain.setValueAtTime(0, ctx.currentTime + startDelay);
    padGain.gain.linearRampToValueAtTime(volume * 0.12, ctx.currentTime + startDelay + 1.5);
    padGain.gain.linearRampToValueAtTime(0, ctx.currentTime + startDelay + duration);

    osc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(ctx.destination);

    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration);
  };

  const padNotes = [130.81, 164.81, 196.00]; // C Major
  let cycle = 0;
  const loopPads = () => {
    const root = cycle % 2 === 0 ? 130.81 : 146.83; // Alternating root notes C3 / D3
    playSoothingPad(root, 0, 7.8);
    playSoothingPad(root * 1.25, 0.5, 7.3); // Minor/Major third
    playSoothingPad(root * 1.5, 1.0, 6.8); // Fifth
    cycle++;
  };

  loopPads();
  const interval = setInterval(loopPads, 8000);
  currentNodes.intervals.push(interval);
}

// 33. WHITE RAIN AMBIENT (সাদা শোরগোল ও বৃষ্টি)
export function startWhiteRainSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  // White noise noise-blocking element
  const whiteNode = ctx.createBufferSource();
  whiteNode.buffer = createNoiseBuffer(ctx, 'white');
  whiteNode.loop = true;
  
  const whiteFilter = ctx.createBiquadFilter();
  whiteFilter.type = 'bandpass';
  whiteFilter.frequency.value = 1000;
  whiteFilter.Q.value = 1.2;
  
  const whiteGain = ctx.createGain();
  whiteGain.gain.value = volume * 0.05;

  whiteNode.connect(whiteFilter);
  whiteFilter.connect(whiteGain);
  whiteGain.connect(ctx.destination);
  whiteNode.start();
  currentNodes.sources.push(whiteNode);
  currentNodes.gains.push(whiteGain);

  // Deep Pink Rain roaring element
  const rainNode = ctx.createBufferSource();
  rainNode.buffer = createNoiseBuffer(ctx, 'pink');
  rainNode.loop = true;
  
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = 'lowpass';
  rainFilter.frequency.value = 750;
  
  const rainGain = ctx.createGain();
  rainGain.gain.value = volume * 0.18;

  rainNode.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(ctx.destination);
  rainNode.start();
  currentNodes.sources.push(rainNode);
  currentNodes.gains.push(rainGain);
}

// 34. DEEP SPACE DRONE (মহাজাগতিক শূন্যতা - নয়েজ ক্যান্সেলেশন)
export function startSpaceDroneSynth(volume: number = 0.5) {
  stopAllSynthSounds();
  const ctx = getAudioContext();

  // Base Brown Noise acting as sub-audio rumble
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 'brown');
  noise.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 95;

  const droneGain = ctx.createGain();
  droneGain.gain.value = volume * 0.45;

  noise.connect(lowpass);
  lowpass.connect(droneGain);
  droneGain.connect(ctx.destination);
  noise.start();
  currentNodes.sources.push(noise);
  currentNodes.gains.push(droneGain);

  // Sub hum oscillators (55Hz / 82.4Hz)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.value = 55.00; // A1
  osc2.type = 'sine';
  osc2.frequency.value = 82.41; // E2

  // Slow LFO sweeping filter for resonance
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.05; // 20s cycle

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 15;

  const humFilter = ctx.createBiquadFilter();
  humFilter.type = 'lowpass';
  humFilter.frequency.value = 70;

  lfo.connect(lfoGain);
  lfoGain.connect(humFilter.frequency);

  oscGain.gain.value = volume * 0.28;

  osc1.connect(humFilter);
  osc2.connect(humFilter);
  humFilter.connect(oscGain);
  oscGain.connect(ctx.destination);

  lfo.start();
  osc1.start();
  osc2.start();

  currentNodes.sources.push(osc1, osc2, lfo);
  currentNodes.gains.push(oscGain);
}
