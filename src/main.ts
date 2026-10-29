import './style.css';
import gsap from 'gsap';
import { SceneManager } from './visualizer/SceneManager';
import { HUD } from './ui/HUD';
import { AudioContextManager } from './audio/AudioContextManager';
import { VisualParams } from './types';

// Default Visual Parameters
const defaultParams: VisualParams = {
  noiseFrequency: 1.15,
  rippleAmplitude: 0.28,
  morphSpeed: 0.95,
  metallicRoughness: 0.12,
  particleCount: 2400,
  glowIntensity: 1.4,
  wireframe: false,
  material: 'iridescent'
};

document.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.getElementById('canvas-container');
  const hudContainer = document.getElementById('hud-overlay');

  if (!canvasContainer || !hudContainer) {
    console.error('Core containers not found');
    return;
  }

  // 1. Initialize WebGL Liquid Simulation Scene
  const sceneManager = new SceneManager(canvasContainer, defaultParams);

  // 2. Initialize HUD
  const hud = new HUD(hudContainer, sceneManager, defaultParams);

  // 3. Audio Context Unlock on First User Interaction
  const unlockAudio = async () => {
    const audioMgr = AudioContextManager.getInstance();
    await audioMgr.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // 4. GSAP Intro Choreography
  gsap.from('.hud-top-bar', {
    y: -50,
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out'
  });

  gsap.from('.left-panel', {
    x: -60,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: 'power3.out'
  });

  gsap.from('.right-panel', {
    x: 60,
    opacity: 0,
    duration: 1.2,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.from('.hud-footer', {
    y: 30,
    opacity: 0,
    duration: 1.0,
    delay: 0.6,
    ease: 'power3.out'
  });
});
