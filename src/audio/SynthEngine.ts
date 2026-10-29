import { AudioContextManager } from './AudioContextManager';
import { MusicalScale, MusicalScaleId } from '../types';

export const SCALES: Record<MusicalScaleId, MusicalScale> = {
  hijaz: {
    id: 'hijaz',
    nameAr: 'مقام الحجاز الأصيل',
    nameEn: 'Hijaz Arabic Scale',
    root: 'D',
    descriptionAr: 'طابع شرقي مهيب يجمع بين الشجن والعمق الأسطوري',
    descriptionEn: 'Mystical Middle-Eastern mode rich in historic resonance',
    notes: [
      { note: 'D4', nameAr: 'دوكاه (D)', nameEn: 'D4', freq: 293.66, keyMap: 'A' },
      { note: 'Eb4', nameAr: 'كرد (Eb)', nameEn: 'Eb4', freq: 311.13, keyMap: 'S' },
      { note: 'F#4', nameAr: 'حجاز (F#)', nameEn: 'F#4', freq: 369.99, keyMap: 'D' },
      { note: 'G4', nameAr: 'نوى (G)', nameEn: 'G4', freq: 392.00, keyMap: 'F' },
      { note: 'A4', nameAr: 'حسيني (A)', nameEn: 'A4', freq: 440.00, keyMap: 'G' },
      { note: 'Bb4', nameAr: 'عجم (Bb)', nameEn: 'Bb4', freq: 466.16, keyMap: 'H' },
      { note: 'C5', nameAr: 'كردان (C)', nameEn: 'C5', freq: 523.25, keyMap: 'J' },
      { note: 'D5', nameAr: 'جواب دوكاه (D)', nameEn: 'D5', freq: 587.33, keyMap: 'K' }
    ]
  },
  bayati: {
    id: 'bayati',
    nameAr: 'مقام البياتي العريق',
    nameEn: 'Bayati Heritage',
    root: 'D',
    descriptionAr: 'نغمة عربية تراثية أصيلة متوازنة ودافئة مع نغمة السيكاه',
    descriptionEn: 'Authentic oriental soul scale with rich emotive quarter-tone warmth',
    notes: [
      { note: 'D4', nameAr: 'دوكاه (D)', nameEn: 'D4', freq: 293.66, keyMap: 'A' },
      { note: 'Eq4', nameAr: 'سيكاه (E-ربع)', nameEn: 'Eq4', freq: 302.27, keyMap: 'S' },
      { note: 'F4', nameAr: 'جهاركاه (F)', nameEn: 'F4', freq: 349.23, keyMap: 'D' },
      { note: 'G4', nameAr: 'نوى (G)', nameEn: 'G4', freq: 392.00, keyMap: 'F' },
      { note: 'A4', nameAr: 'حسيني (A)', nameEn: 'A4', freq: 440.00, keyMap: 'G' },
      { note: 'Bb4', nameAr: 'عجم (Bb)', nameEn: 'Bb4', freq: 466.16, keyMap: 'H' },
      { note: 'C5', nameAr: 'كردان (C)', nameEn: 'C5', freq: 523.25, keyMap: 'J' },
      { note: 'D5', nameAr: 'جواب دوكاه (D)', nameEn: 'D5', freq: 587.33, keyMap: 'K' }
    ]
  },
  pentatonic: {
    id: 'pentatonic',
    nameAr: 'خماسي سيبراني',
    nameEn: 'Cyber Pentatonic',
    root: 'C',
    descriptionAr: 'سُلّم إلكتروني مستقبلي مستوحى من نيون السايبربانك',
    descriptionEn: 'Futuristic synthetic scale engineered for cyberpunk grooves',
    notes: [
      { note: 'C4', nameAr: 'دو (C)', nameEn: 'C4', freq: 261.63, keyMap: 'A' },
      { note: 'Eb4', nameAr: 'مي بيمول (Eb)', nameEn: 'Eb4', freq: 311.13, keyMap: 'S' },
      { note: 'F4', nameAr: 'فا (F)', nameEn: 'F4', freq: 349.23, keyMap: 'D' },
      { note: 'G4', nameAr: 'صول (G)', nameEn: 'G4', freq: 392.00, keyMap: 'F' },
      { note: 'Bb4', nameAr: 'سي بيمول (Bb)', nameEn: 'Bb4', freq: 466.16, keyMap: 'G' },
      { note: 'C5', nameAr: 'دو حاد (C5)', nameEn: 'C5', freq: 523.25, keyMap: 'H' },
      { note: 'Eb5', nameAr: 'مي حاد (Eb5)', nameEn: 'Eb5', freq: 622.25, keyMap: 'J' },
      { note: 'F5', nameAr: 'فا حاد (F5)', nameEn: 'F5', freq: 698.46, keyMap: 'K' }
    ]
  },
  celestial: {
    id: 'celestial',
    nameAr: 'أثيري كوني (Lydian)',
    nameEn: 'Celestial Ambient',
    root: 'C',
    descriptionAr: 'أبعاد فلكية رحبة تمنح شعوراً بالتحليق والتأمل العميق',
    descriptionEn: 'Airy harmonic dreamscape tuned for deep immersion and meditation',
    notes: [
      { note: 'C4', nameAr: 'دو (C)', nameEn: 'C4', freq: 261.63, keyMap: 'A' },
      { note: 'D4', nameAr: 'ري (D)', nameEn: 'D4', freq: 293.66, keyMap: 'S' },
      { note: 'E4', nameAr: 'مي (E)', nameEn: 'E4', freq: 329.63, keyMap: 'D' },
      { note: 'F#4', nameAr: 'فا دييز (F#)', nameEn: 'F#4', freq: 369.99, keyMap: 'F' },
      { note: 'G4', nameAr: 'صول (G)', nameEn: 'G4', freq: 392.00, keyMap: 'G' },
      { note: 'A4', nameAr: 'لا (A)', nameEn: 'A4', freq: 440.00, keyMap: 'H' },
      { note: 'B4', nameAr: 'سي (B)', nameEn: 'B4', freq: 493.88, keyMap: 'J' },
      { note: 'C5', nameAr: 'دو جواب (C5)', nameEn: 'C5', freq: 523.25, keyMap: 'K' }
    ]
  }
};

export class SynthEngine {
  private static instance: SynthEngine;
  private audioManager: AudioContextManager;
  private currentScale: MusicalScale = SCALES.hijaz;
  private ambientTimer: number | null = null;
  private isAmbientPlaying: boolean = false;
  private activeVoices: Map<string, { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode }> = new Map();

  private constructor() {
    this.audioManager = AudioContextManager.getInstance();
  }

  public static getInstance(): SynthEngine {
    if (!SynthEngine.instance) {
      SynthEngine.instance = new SynthEngine();
    }
    return SynthEngine.instance;
  }

  public setScale(scaleId: MusicalScaleId): MusicalScale {
    if (SCALES[scaleId]) {
      this.currentScale = SCALES[scaleId];
    }
    return this.currentScale;
  }

  public getScale(): MusicalScale {
    return this.currentScale;
  }

  public async triggerNote(freq: number, duration: number = 0.8, type: OscillatorType = 'triangle', velocity: number = 0.8): Promise<void> {
    const ctx = await this.audioManager.init();
    const destination = this.audioManager.getMasterInput();
    const reverb = this.audioManager.getReverbNode();
    if (!destination || !reverb) return;

    const now = ctx.currentTime;

    // Dual-oscillator Subtractive / FM Synth Voice
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();

    // Filter Node with dynamic envelope
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(12000, freq * (3 + velocity * 2)), now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.8), now + duration);
    filter.Q.setValueAtTime(3.5, now);

    // Amplitude Envelope (ADSR)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    const attackTime = 0.015;
    const peakGain = 0.35 * velocity;
    gainNode.gain.exponentialRampToValueAtTime(peakGain, now + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.6, now + attackTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Oscillator 1: Primary voice
    osc1.type = type;
    osc1.frequency.setValueAtTime(freq, now);

    // Oscillator 2: Shimmering detuned harmonic
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.004, now); // +7 cents detune

    // Sub-Oscillator: 1 octave below for acoustic weight
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.2, now);
    subOsc.connect(subGain);
    subGain.connect(filter);

    // Reverb Send Gain
    const revSend = ctx.createGain();
    revSend.gain.setValueAtTime(0.35, now);

    // Routing
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);

    gainNode.connect(destination);
    gainNode.connect(revSend);
    revSend.connect(reverb);
    reverb.connect(destination);

    // Start & Stop
    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);

    const stopTime = now + duration + 0.05;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    subOsc.stop(stopTime);
  }

  public triggerPercussion(type: 'kick' | 'snare' | 'hihat' | 'shimmer'): void {
    const ctx = this.audioManager.getContext();
    const destination = this.audioManager.getMasterInput();
    if (!ctx || !destination) return;

    const now = ctx.currentTime;

    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'snare') {
      // Noise burst + tone
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      noise.start(now);
    } else if (type === 'hihat') {
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(8500, now);
      filter.Q.setValueAtTime(4.0, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      noise.start(now);
    }
  }

  public toggleAmbientEngine(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientEngine();
      return false;
    } else {
      this.startAmbientEngine();
      return true;
    }
  }

  public startAmbientEngine(): void {
    if (this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;
    this.audioManager.init();

    const playGenerativeDrone = () => {
      if (!this.isAmbientPlaying) return;

      const scale = this.currentScale;
      // Pick random harmonic chords from the scale
      const noteCount = scale.notes.length;
      const rootIndex = 0;
      const thirdIndex = (rootIndex + 2) % noteCount;
      const fifthIndex = (rootIndex + 4) % noteCount;
      const octaveIndex = (rootIndex + 7) % noteCount;

      const pool = [
        scale.notes[rootIndex].freq * 0.5,
        scale.notes[thirdIndex].freq,
        scale.notes[fifthIndex].freq,
        scale.notes[octaveIndex].freq
      ];

      // Play 1-2 notes with soft long duration
      const randomFreq = pool[Math.floor(Math.random() * pool.length)];
      const dur = 2.5 + Math.random() * 3.0;
      this.triggerNote(randomFreq, dur, 'sine', 0.35 + Math.random() * 0.2);

      // Random high chime
      if (Math.random() > 0.4) {
        const chimeNote = scale.notes[Math.floor(Math.random() * noteCount)].freq * 2;
        setTimeout(() => {
          if (this.isAmbientPlaying) {
            this.triggerNote(chimeNote, 1.8, 'triangle', 0.25);
          }
        }, 600 + Math.random() * 1200);
      }

      const nextInterval = 2000 + Math.random() * 2500;
      this.ambientTimer = window.setTimeout(playGenerativeDrone, nextInterval);
    };

    playGenerativeDrone();
  }

  public stopAmbientEngine(): void {
    this.isAmbientPlaying = false;
    if (this.ambientTimer !== null) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }
}
