import * as THREE from 'three';
import { AudioFrequencyBands } from '../types';

export class ParticleSwarm {
  private count: number = 2400;
  private points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private positions: Float32Array;
  private originalRadii: Float32Array;
  private angles: Float32Array;
  private speeds: Float32Array;
  private yVels: Float32Array;
  private baseColor: THREE.Color = new THREE.Color('#7dd3fc');

  constructor(scene: THREE.Scene, initialCount: number = 2400) {
    this.count = initialCount;
    this.positions = new Float32Array(this.count * 3);
    this.originalRadii = new Float32Array(this.count);
    this.angles = new Float32Array(this.count);
    this.speeds = new Float32Array(this.count);
    this.yVels = new Float32Array(this.count);

    const glowTexture = this.createParticleTexture();

    this.geometry = new THREE.BufferGeometry();
    this.initParticles();

    this.material = new THREE.PointsMaterial({
      size: 0.12,
      map: glowTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: this.baseColor
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  private createParticleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  private initParticles(): void {
    for (let i = 0; i < this.count; i++) {
      const radius = 2.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.85;

      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);

      this.positions[i * 3] = x;
      this.positions[i * 3 + 1] = y;
      this.positions[i * 3 + 2] = z;

      this.originalRadii[i] = radius;
      this.angles[i] = theta;
      this.speeds[i] = (0.3 + Math.random() * 0.7) * (Math.random() > 0.5 ? 1 : -1);
      this.yVels[i] = (Math.random() - 0.5) * 0.02;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
  }

  public setCount(newCount: number): void {
    this.count = Math.max(500, Math.min(5000, newCount));
    this.positions = new Float32Array(this.count * 3);
    this.originalRadii = new Float32Array(this.count);
    this.angles = new Float32Array(this.count);
    this.speeds = new Float32Array(this.count);
    this.yVels = new Float32Array(this.count);
    this.initParticles();
  }

  public setColor(color: THREE.Color): void {
    this.baseColor.copy(color);
    this.material.color.copy(color);
  }

  public update(delta: number, bands: AudioFrequencyBands): void {
    const pos = this.geometry.attributes.position.array as Float32Array;
    const bassPush = bands.bass * 1.5;
    const trebleJitter = bands.treble * 0.08;

    for (let i = 0; i < this.count; i++) {
      // Rotate around Y axis
      this.angles[i] += this.speeds[i] * delta * (1.0 + bands.overall * 1.2);

      const baseRad = this.originalRadii[i] + bassPush;
      const currentY = pos[i * 3 + 1] + this.yVels[i];

      // Oscillate vertically in bounds
      let y = currentY;
      if (Math.abs(y) > 2.8) {
        this.yVels[i] *= -1;
      }

      const x = Math.cos(this.angles[i]) * baseRad + (Math.random() - 0.5) * trebleJitter;
      const z = Math.sin(this.angles[i]) * baseRad + (Math.random() - 0.5) * trebleJitter;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.material.size = 0.12 + bands.mid * 0.1 + bands.treble * 0.08;
    this.material.opacity = 0.7 + bands.bass * 0.3;
  }
}
