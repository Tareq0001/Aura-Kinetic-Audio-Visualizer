import { AudioContextManager } from './AudioContextManager';
import { SynthEngine } from './SynthEngine';
import { SequencerTrack } from '../types';

export class Sequencer {
  private static instance: Sequencer;
  private audioManager: AudioContextManager;
  private synthEngine: SynthEngine;
  private isPlaying: boolean = false;
  private bpm: number = 110;
  private currentStep: number = 0;
  private timerId: number | null = null;
  private nextNoteTime: number = 0;
  private lookahead: number = 25.0; // milliseconds
  private scheduleAheadTime: number = 0.1; // seconds

  private onStepCallback: ((step: number) => void) | null = null;

  public tracks: SequencerTrack[] = [
    {
      id: 'sub',
      nameAr: 'نبض الدوكاه (Bass)',
      nameEn: 'Deep Sub Pulse',
      color: '#6366f1',
      synthType: 'triangle',
      baseFreq: 146.83, // D3
      pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]
    },
    {
      id: 'lead',
      nameAr: 'العازف الطيفي (Lead)',
      nameEn: 'Spectral Lead',
      color: '#06b6d4',
      synthType: 'sawtooth',
      baseFreq: 369.99, // F#4
      pattern: [false, false, true, false, false, true, false, true, false, false, true, false, false, true, true, false]
    },
    {
      id: 'chime',
      nameAr: 'أجراس بلورية (Chime)',
      nameEn: 'Crystal Chimes',
      color: '#ec4899',
      synthType: 'sine',
      baseFreq: 587.33, // D5
      pattern: [false, true, false, false, false, false, true, false, false, true, false, false, false, false, true, false]
    },
    {
      id: 'perc',
      nameAr: 'إيقاع إلكتروني (Perc)',
      nameEn: 'Cyber Groove',
      color: '#10b981',
      synthType: 'square',
      baseFreq: 220.0,
      pattern: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, true]
    }
  ];

  private constructor() {
    this.audioManager = AudioContextManager.getInstance();
    this.synthEngine = SynthEngine.getInstance();
  }

  public static getInstance(): Sequencer {
    if (!Sequencer.instance) {
      Sequencer.instance = new Sequencer();
    }
    return Sequencer.instance;
  }

  public setOnStepListener(cb: (step: number) => void): void {
    this.onStepCallback = cb;
  }

  public setBpm(val: number): void {
    this.bpm = Math.max(50, Math.min(200, val));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public toggleStep(trackIndex: number, stepIndex: number): boolean {
    if (this.tracks[trackIndex] && stepIndex >= 0 && stepIndex < 16) {
      this.tracks[trackIndex].pattern[stepIndex] = !this.tracks[trackIndex].pattern[stepIndex];
      return this.tracks[trackIndex].pattern[stepIndex];
    }
    return false;
  }

  public clear(): void {
    this.tracks.forEach(track => {
      track.pattern = new Array(16).fill(false);
    });
  }

  public randomize(): void {
    this.tracks.forEach((track, tIdx) => {
      track.pattern = Array.from({ length: 16 }, () => {
        const prob = tIdx === 0 ? 0.35 : tIdx === 1 ? 0.4 : 0.25;
        return Math.random() < prob;
      });
    });
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.start();
      return true;
    }
  }

  public async start(): Promise<void> {
    if (this.isPlaying) return;
    const ctx = await this.audioManager.init();
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.scheduler();
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private nextStep(): void {
    const secondsPerBeat = 60.0 / this.bpm;
    const stepDuration = secondsPerBeat / 4.0; // 16th notes
    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  private scheduleNote(step: number, time: number): void {
    // Notify UI for active column highlight
    if (this.onStepCallback) {
      window.requestAnimationFrame(() => {
        if (this.onStepCallback && this.isPlaying) {
          this.onStepCallback(step);
        }
      });
    }

    const scale = this.synthEngine.getScale();
    const notes = scale.notes;

    // Check each track
    this.tracks.forEach((track, tIdx) => {
      if (track.pattern[step]) {
        if (tIdx === 0) {
          // Sub bass / Kick
          this.synthEngine.triggerPercussion('kick');
          const rootFreq = notes[0].freq * 0.5;
          this.synthEngine.triggerNote(rootFreq, 0.4, 'triangle', 0.9);
        } else if (tIdx === 1) {
          // Melodic Lead note based on step index
          const noteIndex = (step * 2) % notes.length;
          const noteFreq = notes[noteIndex].freq;
          this.synthEngine.triggerNote(noteFreq, 0.25, track.synthType, 0.75);
        } else if (tIdx === 2) {
          // High Chime
          const chimeIndex = (step * 3 + 1) % notes.length;
          const noteFreq = notes[chimeIndex].freq * (Math.random() > 0.5 ? 2 : 1.5);
          this.synthEngine.triggerNote(noteFreq, 0.6, 'sine', 0.6);
        } else if (tIdx === 3) {
          // Cyber percussion
          if (step % 4 === 2) {
            this.synthEngine.triggerPercussion('snare');
          } else {
            this.synthEngine.triggerPercussion('hihat');
          }
        }
      }
    });
  }

  private scheduler(): void {
    const ctx = this.audioManager.getContext();
    if (!ctx || !this.isPlaying) return;

    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextStep();
    }

    this.timerId = window.setTimeout(() => this.scheduler(), this.lookahead);
  }
}
