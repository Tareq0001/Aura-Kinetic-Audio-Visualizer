import { AudioFrequencyBands } from '../types';

export class AudioContextManager {
  private static instance: AudioContextManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private freqData: Uint8Array | null = null;
  private timeData: Uint8Array | null = null;
  private isUnlocked: boolean = false;

  private constructor() {}

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  public async init(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Compressor to prevent clipping
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      // High-precision Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.82;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      // Algorithmic Lush Reverb
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.generateImpulseResponse(this.ctx, 2.5, 2.0);

      // Routing: Synth -> Compressor -> Analyser -> Master Gain -> Destination
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyser.fftSize);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isUnlocked = true;
    return this.ctx;
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getMasterInput(): AudioNode | null {
    return this.compressor;
  }

  public getReverbNode(): ConvolverNode | null {
    return this.reverbNode;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public isAudioActive(): boolean {
    return this.isUnlocked && this.ctx?.state === 'running';
  }

  public setMasterVolume(val: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.03);
    }
  }

  public getFrequencyBands(): AudioFrequencyBands {
    if (!this.analyser || !this.freqData) {
      return { bass: 0, mid: 0, treble: 0, overall: 0 };
    }

    (this.analyser.getByteFrequencyData as (arr: Uint8Array) => void)(this.freqData);
    const binCount = this.analyser.frequencyBinCount;
    const nyquist = (this.ctx?.sampleRate || 44100) / 2;
    const hzPerBin = nyquist / binCount;

    let bassSum = 0, bassCount = 0;
    let midSum = 0, midCount = 0;
    let trebleSum = 0, trebleCount = 0;
    let totalSum = 0;

    for (let i = 0; i < binCount; i++) {
      const freq = i * hzPerBin;
      const val = this.freqData[i] / 255;
      totalSum += val;

      if (freq >= 20 && freq <= 250) {
        bassSum += val;
        bassCount++;
      } else if (freq > 250 && freq <= 3000) {
        midSum += val;
        midCount++;
      } else if (freq > 3000 && freq <= 16000) {
        trebleSum += val;
        trebleCount++;
      }
    }

    return {
      bass: bassCount > 0 ? (bassSum / bassCount) * 1.6 : 0,
      mid: midCount > 0 ? (midSum / midCount) * 1.4 : 0,
      treble: trebleCount > 0 ? (trebleSum / trebleCount) * 1.8 : 0,
      overall: (totalSum / binCount) * 1.5
    };
  }

  public getTimeDomainData(buffer: Uint8Array): void {
    if (this.analyser) {
      (this.analyser.getByteTimeDomainData as (arr: Uint8Array) => void)(buffer);
    }
  }

  public getRawFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.freqData) return null;
    (this.analyser.getByteFrequencyData as (arr: Uint8Array) => void)(this.freqData);
    return this.freqData;
  }

  private generateImpulseResponse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = (length - i) / length;
      const envelope = Math.pow(n, decay);
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  }
}
