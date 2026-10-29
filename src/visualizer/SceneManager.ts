import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { LiquidVertexShader, LiquidFragmentShader } from './LiquidShader';
import { ParticleSwarm } from './ParticleSwarm';
import { MATERIAL_CONFIGS, MaterialConfig } from './MaterialPresets';
import { VisualParams, MaterialTheme } from '../types';
import { AudioContextManager } from '../audio/AudioContextManager';

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private liquidMesh: THREE.Mesh;
  private liquidMaterial: THREE.ShaderMaterial;
  private particleSwarm: ParticleSwarm;

  private ambientLight: THREE.AmbientLight;
  private pointLight1: THREE.PointLight;
  private pointLight2: THREE.PointLight;

  private audioManager: AudioContextManager;
  private clock: THREE.Clock = new THREE.Clock();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private targetMouse: THREE.Vector2 = new THREE.Vector2();
  private shockwaveProgress: number = 1.0;
  private shockwaveCenter: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  private shockwaveStrength: number = 0;

  private currentTheme: MaterialTheme = 'iridescent';
  private params: VisualParams;

  constructor(container: HTMLElement, initialParams: VisualParams) {
    this.container = container;
    this.params = initialParams;
    this.currentTheme = initialParams.material;
    this.audioManager = AudioContextManager.getInstance();

    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const matConfig = MATERIAL_CONFIGS[this.currentTheme];
    this.ambientLight = new THREE.AmbientLight(matConfig.ambientLightColor, 1.2);
    this.scene.add(this.ambientLight);

    this.pointLight1 = new THREE.PointLight(matConfig.pointLight1Color, 3.5, 25);
    this.pointLight1.position.set(3, 3, 3);
    this.scene.add(this.pointLight1);

    this.pointLight2 = new THREE.PointLight(matConfig.pointLight2Color, 2.5, 25);
    this.pointLight2.position.set(-3, -2, -2);
    this.scene.add(this.pointLight2);

    // Liquid Mesh
    const geometry = new THREE.IcosahedronGeometry(1.35, 64);
    this.liquidMaterial = new THREE.ShaderMaterial({
      vertexShader: LiquidVertexShader,
      fragmentShader: LiquidFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uNoiseFreq: { value: this.params.noiseFrequency },
        uRippleAmp: { value: this.params.rippleAmplitude },
        uMorphSpeed: { value: this.params.morphSpeed },
        uRoughness: { value: this.params.metallicRoughness },
        uGlowIntensity: { value: this.params.glowIntensity },
        uAudioBass: { value: 0 },
        uAudioMid: { value: 0 },
        uAudioTreble: { value: 0 },
        uShockwaveCenter: { value: new THREE.Vector3(0, 0, 1) },
        uShockwaveProgress: { value: 1.0 },
        uShockwaveStrength: { value: 0 },
        uBaseColor: { value: matConfig.baseColor },
        uSecondaryColor: { value: matConfig.secondaryColor },
        uAccentColor: { value: matConfig.accentColor },
        uMaterialMode: { value: matConfig.modeInt }
      },
      wireframe: this.params.wireframe
    });

    this.liquidMesh = new THREE.Mesh(geometry, this.liquidMaterial);
    this.scene.add(this.liquidMesh);

    // Particle Swarm
    this.particleSwarm = new ParticleSwarm(this.scene, this.params.particleCount);
    this.particleSwarm.setColor(matConfig.particleColor);

    // Event listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });

    this.animate();
  }

  public setParams(newParams: Partial<VisualParams>): void {
    Object.assign(this.params, newParams);

    if (newParams.noiseFrequency !== undefined) {
      this.liquidMaterial.uniforms.uNoiseFreq.value = newParams.noiseFrequency;
    }
    if (newParams.rippleAmplitude !== undefined) {
      this.liquidMaterial.uniforms.uRippleAmp.value = newParams.rippleAmplitude;
    }
    if (newParams.morphSpeed !== undefined) {
      this.liquidMaterial.uniforms.uMorphSpeed.value = newParams.morphSpeed;
    }
    if (newParams.metallicRoughness !== undefined) {
      this.liquidMaterial.uniforms.uRoughness.value = newParams.metallicRoughness;
    }
    if (newParams.glowIntensity !== undefined) {
      this.liquidMaterial.uniforms.uGlowIntensity.value = newParams.glowIntensity;
    }
    if (newParams.wireframe !== undefined) {
      this.liquidMaterial.wireframe = newParams.wireframe;
    }
    if (newParams.particleCount !== undefined) {
      this.particleSwarm.setCount(newParams.particleCount);
    }
    if (newParams.material !== undefined && newParams.material !== this.currentTheme) {
      this.setMaterialTheme(newParams.material);
    }
  }

  public setMaterialTheme(themeId: MaterialTheme): void {
    if (!MATERIAL_CONFIGS[themeId]) return;
    this.currentTheme = themeId;
    this.params.material = themeId;
    const config: MaterialConfig = MATERIAL_CONFIGS[themeId];

    this.liquidMaterial.uniforms.uMaterialMode.value = config.modeInt;
    this.liquidMaterial.uniforms.uBaseColor.value = config.baseColor;
    this.liquidMaterial.uniforms.uSecondaryColor.value = config.secondaryColor;
    this.liquidMaterial.uniforms.uAccentColor.value = config.accentColor;
    this.liquidMaterial.uniforms.uRoughness.value = config.roughness;
    this.liquidMaterial.uniforms.uGlowIntensity.value = config.glowIntensity;

    this.ambientLight.color.copy(config.ambientLightColor);
    this.pointLight1.color.copy(config.pointLight1Color);
    this.pointLight2.color.copy(config.pointLight2Color);

    this.particleSwarm.setColor(config.particleColor);

    // Dynamic background transition
    document.body.style.background = config.backgroundGradient;
  }

  public getMaterialTheme(): MaterialTheme {
    return this.currentTheme;
  }

  public triggerShockwave(xNdc: number, yNdc: number, strength: number = 1.0): void {
    // Project 2D click point to sphere surface
    const vector = new THREE.Vector3(xNdc, yNdc, 0.5);
    vector.unproject(this.camera);
    vector.sub(this.camera.position).normalize();

    this.shockwaveCenter.copy(vector);
    this.shockwaveProgress = 0.0;
    this.shockwaveStrength = strength;

    this.liquidMaterial.uniforms.uShockwaveCenter.value.copy(this.shockwaveCenter);
    this.liquidMaterial.uniforms.uShockwaveProgress.value = 0.0;
    this.liquidMaterial.uniforms.uShockwaveStrength.value = strength;
  }

  private onMouseMove(e: MouseEvent): void {
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  private onTouchMove(e: TouchEvent): void {
    if (e.touches.length > 0) {
      this.targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  private onPointerDown(e: PointerEvent): void {
    // Avoid triggering when interacting with HUD controls
    if ((e.target as HTMLElement).closest('.hud-panel, .interactive-btn, input, select, button')) {
      return;
    }
    const xNdc = (e.clientX / window.innerWidth) * 2 - 1;
    const yNdc = -(e.clientY / window.innerHeight) * 2 + 1;
    this.triggerShockwave(xNdc, yNdc, 1.4);
  }

  private onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public async capture4KSnapshot(): Promise<void> {
    const origWidth = window.innerWidth;
    const origHeight = window.innerHeight;
    const origPixelRatio = this.renderer.getPixelRatio();

    // Set 4K Ultra-HD Resolution
    const targetW = 3840;
    const targetH = 2160;

    this.camera.aspect = targetW / targetH;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(targetW, targetH);

    // Render one 4K frame
    this.renderer.render(this.scene, this.camera);
    const webglCanvas = this.renderer.domElement;

    // Overlay elegant branding watermark
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = targetW;
    exportCanvas.height = targetH;
    const ctx = exportCanvas.getContext('2d')!;

    // Draw render
    ctx.drawImage(webglCanvas, 0, 0);

    // Watermark Vignette gradient
    const vignette = ctx.createLinearGradient(0, targetH - 300, 0, targetH);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, targetH - 300, targetW, 300);

    // Typography Watermark
    ctx.font = 'bold 48px "Cairo", "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('أَورا | معمل الصوت السائل والمؤثرات التوليدية ثلاثية الأبعاد', targetW - 80, targetH - 120);

    ctx.font = '32px "Inter", "Cairo", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('ابتكار وهندسة: أ. طارق ابوعشي • AURA 3D Kinetic Lab', targetW - 80, targetH - 70);

    ctx.font = '28px "Inter", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'left';
    ctx.fillText('4K ULTRA-HD GENERATIVE FRAME • 3840 x 2160', 80, targetH - 70);

    // Revert renderer to original display
    this.camera.aspect = origWidth / origHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(origPixelRatio);
    this.renderer.setSize(origWidth, origHeight);

    // Download PNG
    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `AURA_Artistic_Capture_4K_${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#a855f7', '#fbbf24', '#10b981']
      });
    }, 'image/png');
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse lerp
    this.mouse.lerp(this.targetMouse, 0.08);

    // Subtle camera parallax
    this.camera.position.x = this.mouse.x * 0.45;
    this.camera.position.y = this.mouse.y * 0.45;
    this.camera.lookAt(0, 0, 0);

    // Mesh organic rotation
    this.liquidMesh.rotation.y = elapsedTime * 0.12;
    this.liquidMesh.rotation.x = Math.sin(elapsedTime * 0.08) * 0.15;

    // Fetch live audio frequencies
    const bands = this.audioManager.getFrequencyBands();

    // Update shockwave expansion
    if (this.shockwaveProgress < 1.0) {
      this.shockwaveProgress += delta * 1.8;
      this.liquidMaterial.uniforms.uShockwaveProgress.value = Math.min(1.0, this.shockwaveProgress);
    }

    // Update shader uniforms
    this.liquidMaterial.uniforms.uTime.value = elapsedTime;
    this.liquidMaterial.uniforms.uAudioBass.value = bands.bass;
    this.liquidMaterial.uniforms.uAudioMid.value = bands.mid;
    this.liquidMaterial.uniforms.uAudioTreble.value = bands.treble;

    // Light pulsing with bass
    this.pointLight1.intensity = 3.5 + bands.bass * 2.5;
    this.pointLight2.intensity = 2.5 + bands.mid * 2.0;

    // Particle update
    this.particleSwarm.update(delta, bands);

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
