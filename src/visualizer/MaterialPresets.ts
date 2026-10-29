import * as THREE from 'three';
import { MaterialTheme } from '../types';

export interface MaterialConfig {
  id: MaterialTheme;
  modeInt: number;
  baseColor: THREE.Color;
  secondaryColor: THREE.Color;
  accentColor: THREE.Color;
  particleColor: THREE.Color;
  roughness: number;
  glowIntensity: number;
  ambientLightColor: THREE.Color;
  pointLight1Color: THREE.Color;
  pointLight2Color: THREE.Color;
  backgroundGradient: string;
}

export const MATERIAL_CONFIGS: Record<MaterialTheme, MaterialConfig> = {
  chrome: {
    id: 'chrome',
    modeInt: 0,
    baseColor: new THREE.Color('#94a3b8'),
    secondaryColor: new THREE.Color('#e2e8f0'),
    accentColor: new THREE.Color('#38bdf8'),
    particleColor: new THREE.Color('#7dd3fc'),
    roughness: 0.08,
    glowIntensity: 1.2,
    ambientLightColor: new THREE.Color('#1e293b'),
    pointLight1Color: new THREE.Color('#38bdf8'),
    pointLight2Color: new THREE.Color('#f43f5e'),
    backgroundGradient: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)'
  },
  iridescent: {
    id: 'iridescent',
    modeInt: 1,
    baseColor: new THREE.Color('#f472b6'),
    secondaryColor: new THREE.Color('#38bdf8'),
    accentColor: new THREE.Color('#a855f7'),
    particleColor: new THREE.Color('#e879f9'),
    roughness: 0.15,
    glowIntensity: 1.4,
    ambientLightColor: new THREE.Color('#2e1065'),
    pointLight1Color: new THREE.Color('#ec4899'),
    pointLight2Color: new THREE.Color('#06b6d4'),
    backgroundGradient: 'radial-gradient(circle at 50% 50%, #1e1136 0%, #090314 100%)'
  },
  gold: {
    id: 'gold',
    modeInt: 2,
    baseColor: new THREE.Color('#d97706'),
    secondaryColor: new THREE.Color('#fef08a'),
    accentColor: new THREE.Color('#fbbf24'),
    particleColor: new THREE.Color('#fde047'),
    roughness: 0.12,
    glowIntensity: 1.5,
    ambientLightColor: new THREE.Color('#451a03'),
    pointLight1Color: new THREE.Color('#f59e0b'),
    pointLight2Color: new THREE.Color('#fbbf24'),
    backgroundGradient: 'radial-gradient(circle at 50% 50%, #201404 0%, #080501 100%)'
  },
  emerald: {
    id: 'emerald',
    modeInt: 3,
    baseColor: new THREE.Color('#064e3b'),
    secondaryColor: new THREE.Color('#10b981'),
    accentColor: new THREE.Color('#34d399'),
    particleColor: new THREE.Color('#6ee7b7'),
    roughness: 0.18,
    glowIntensity: 1.6,
    ambientLightColor: new THREE.Color('#022c22'),
    pointLight1Color: new THREE.Color('#10b981'),
    pointLight2Color: new THREE.Color('#06b6d4'),
    backgroundGradient: 'radial-gradient(circle at 50% 50%, #04241d 0%, #010d0a 100%)'
  },
  obsidian: {
    id: 'obsidian',
    modeInt: 4,
    baseColor: new THREE.Color('#09090b'),
    secondaryColor: new THREE.Color('#27272a'),
    accentColor: new THREE.Color('#818cf8'),
    particleColor: new THREE.Color('#c084fc'),
    roughness: 0.04,
    glowIntensity: 1.3,
    ambientLightColor: new THREE.Color('#09090b'),
    pointLight1Color: new THREE.Color('#6366f1'),
    pointLight2Color: new THREE.Color('#a855f7'),
    backgroundGradient: 'radial-gradient(circle at 50% 50%, #120e24 0%, #05040a 100%)'
  }
};
