export type MaterialTheme = 'chrome' | 'iridescent' | 'gold' | 'emerald' | 'obsidian';

export type MusicalScaleId = 'hijaz' | 'bayati' | 'pentatonic' | 'celestial';

export interface VisualParams {
  noiseFrequency: number;
  rippleAmplitude: number;
  morphSpeed: number;
  metallicRoughness: number;
  particleCount: number;
  glowIntensity: number;
  wireframe: boolean;
  material: MaterialTheme;
}

export interface ScaleNote {
  note: string;
  nameAr: string;
  nameEn: string;
  freq: number;
  keyMap: string;
}

export interface MusicalScale {
  id: MusicalScaleId;
  nameAr: string;
  nameEn: string;
  root: string;
  notes: ScaleNote[];
  descriptionAr: string;
  descriptionEn: string;
}

export interface AudioFrequencyBands {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
}

export interface SequencerTrack {
  id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  synthType: 'sine' | 'triangle' | 'sawtooth' | 'square';
  baseFreq: number;
  pattern: boolean[];
}
