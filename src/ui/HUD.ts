import { Language, translations, Translations } from '../i18n';
import { VisualParams, MaterialTheme, MusicalScaleId } from '../types';
import { SceneManager } from '../visualizer/SceneManager';
import { SynthEngine, SCALES } from '../audio/SynthEngine';
import { Sequencer } from '../audio/Sequencer';
import { AudioContextManager } from '../audio/AudioContextManager';

export class HUD {
  private container: HTMLElement;
  private sceneManager: SceneManager;
  private synthEngine: SynthEngine;
  private sequencer: Sequencer;
  private audioManager: AudioContextManager;

  private currentLang: Language = 'ar';
  private isDarkTheme: boolean = true;
  private isHUDCollapsed: boolean = false;
  private params: VisualParams;

  private spectrumCanvas: HTMLCanvasElement | null = null;
  private spectrumCtx: CanvasRenderingContext2D | null = null;
  private activeStepIndicator: number = -1;

  constructor(container: HTMLElement, sceneManager: SceneManager, initialParams: VisualParams) {
    this.container = container;
    this.sceneManager = sceneManager;
    this.params = initialParams;
    this.synthEngine = SynthEngine.getInstance();
    this.sequencer = Sequencer.getInstance();
    this.audioManager = AudioContextManager.getInstance();

    this.render();
    this.bindEvents();
    this.startSpectrumVisualizer();
  }

  private t(): Translations {
    return translations[this.currentLang];
  }

  public render(): void {
    const t = this.t();
    const isRtl = this.currentLang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLang;

    this.container.innerHTML = `
      <!-- TOP NAV / HEADER HUD -->
      <header class="hud-top-bar glass-panel animate-slide-down">
        <div class="brand-group">
          <div class="logo-aura">
            <span class="pulsing-core"></span>
            <div class="logo-text">
              <h1 class="logo-title">${t.appTitle}</h1>
              <p class="logo-sub">${t.appSubtitle}</p>
            </div>
          </div>
          <div class="creator-badge">
            <span class="creator-label">${t.creatorTag}:</span>
            <span class="creator-name">${t.authorName}</span>
          </div>
        </div>

        <!-- Realtime Spectrum Mini-Canvas -->
        <div class="spectrum-box" title="Real-time Audio Spectrum">
          <canvas id="spectrum-canvas" width="220" height="42"></canvas>
        </div>

        <!-- Header Actions -->
        <div class="hud-actions">
          <button id="btn-ambient" class="hud-btn ambient-btn ${this.synthEngine.isAmbientActive() ? 'active' : ''}" title="${t.ambientEngine}">
            <span class="ambient-pulse"></span>
            <span class="btn-text">${this.synthEngine.isAmbientActive() ? t.ambientActive : t.ambientEngine}</span>
          </button>

          <button id="btn-snapshot" class="hud-btn highlight-btn" title="${t.snapshotBtn}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span class="btn-text">${t.snapshotBtn}</span>
          </button>

          <button id="btn-lang" class="hud-btn" title="${t.toggleLang}">
            <span class="btn-text">${this.currentLang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button id="btn-theme" class="hud-btn icon-only" title="${t.toggleTheme}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          </button>

          <button id="btn-fullscreen" class="hud-btn icon-only" title="${t.toggleFullscreen}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>

          <button id="btn-collapse" class="hud-btn icon-only" title="Toggle HUD visibility">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
        </div>
      </header>

      <!-- MAIN HUD CONTAINER -->
      <main class="hud-body ${this.isHUDCollapsed ? 'collapsed' : ''}">
        
        <!-- LEFT PANEL: KINETIC CONTROLS & MATERIALS -->
        <section class="hud-panel glass-panel left-panel animate-slide-left">
          <div class="panel-header">
            <h2>${t.visualControls}</h2>
            <span class="badge">WebGL 3D</span>
          </div>

          <!-- Materials Switcher -->
          <div class="control-group">
            <label class="group-label">${t.materialsTitle}</label>
            <div class="materials-grid">
              <button class="mat-card ${this.params.material === 'chrome' ? 'active' : ''}" data-mat="chrome">
                <span class="mat-preview chrome-bg"></span>
                <span class="mat-name">${t.matChrome}</span>
              </button>
              <button class="mat-card ${this.params.material === 'iridescent' ? 'active' : ''}" data-mat="iridescent">
                <span class="mat-preview iridescent-bg"></span>
                <span class="mat-name">${t.matIridescent}</span>
              </button>
              <button class="mat-card ${this.params.material === 'gold' ? 'active' : ''}" data-mat="gold">
                <span class="mat-preview gold-bg"></span>
                <span class="mat-name">${t.matGold}</span>
              </button>
              <button class="mat-card ${this.params.material === 'emerald' ? 'active' : ''}" data-mat="emerald">
                <span class="mat-preview emerald-bg"></span>
                <span class="mat-name">${t.matEmerald}</span>
              </button>
              <button class="mat-card ${this.params.material === 'obsidian' ? 'active' : ''}" data-mat="obsidian">
                <span class="mat-preview obsidian-bg"></span>
                <span class="mat-name">${t.matObsidian}</span>
              </button>
            </div>
          </div>

          <!-- Kinetic Sliders -->
          <div class="sliders-list">
            <div class="slider-item">
              <div class="slider-info">
                <span>${t.noiseFreq}</span>
                <span id="val-noise" class="val-tag">${this.params.noiseFrequency.toFixed(2)}</span>
              </div>
              <input type="range" id="slider-noise" min="0.2" max="2.5" step="0.05" value="${this.params.noiseFrequency}">
            </div>

            <div class="slider-item">
              <div class="slider-info">
                <span>${t.rippleAmp}</span>
                <span id="val-ripple" class="val-tag">${this.params.rippleAmplitude.toFixed(2)}</span>
              </div>
              <input type="range" id="slider-ripple" min="0.05" max="0.75" step="0.02" value="${this.params.rippleAmplitude}">
            </div>

            <div class="slider-item">
              <div class="slider-info">
                <span>${t.morphSpeed}</span>
                <span id="val-morph" class="val-tag">${this.params.morphSpeed.toFixed(2)}</span>
              </div>
              <input type="range" id="slider-morph" min="0.2" max="2.5" step="0.05" value="${this.params.morphSpeed}">
            </div>

            <div class="slider-item">
              <div class="slider-info">
                <span>${t.roughness}</span>
                <span id="val-roughness" class="val-tag">${this.params.metallicRoughness.toFixed(2)}</span>
              </div>
              <input type="range" id="slider-roughness" min="0.0" max="1.0" step="0.02" value="${this.params.metallicRoughness}">
            </div>

            <div class="slider-item">
              <div class="slider-info">
                <span>${t.particleDensity}</span>
                <span id="val-particles" class="val-tag">${this.params.particleCount}</span>
              </div>
              <input type="range" id="slider-particles" min="600" max="4800" step="200" value="${this.params.particleCount}">
            </div>

            <div class="slider-item">
              <div class="slider-info">
                <span>${t.glowPower}</span>
                <span id="val-glow" class="val-tag">${this.params.glowIntensity.toFixed(1)}</span>
              </div>
              <input type="range" id="slider-glow" min="0.5" max="3.0" step="0.1" value="${this.params.glowIntensity}">
            </div>

            <div class="toggle-row">
              <span>${t.wireframeMode}</span>
              <label class="switch">
                <input type="checkbox" id="check-wireframe" ${this.params.wireframe ? 'checked' : ''}>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- RIGHT PANEL: SYNTH KEYBOARD & KINETIC SEQUENCER -->
        <section class="hud-panel glass-panel right-panel animate-slide-right">
          
          <!-- Scales Header -->
          <div class="panel-header">
            <h2>${t.synthLab}</h2>
            <div class="scale-tags">
              ${Object.values(SCALES).map(scale => `
                <button class="scale-chip ${scale.id === this.synthEngine.getScale().id ? 'active' : ''}" data-scale="${scale.id}">
                  ${this.currentLang === 'ar' ? scale.nameAr : scale.nameEn}
                </button>
              `).join('')}
            </div>
          </div>

          <p class="scale-desc-text">
            ${this.currentLang === 'ar' ? this.synthEngine.getScale().descriptionAr : this.synthEngine.getScale().descriptionEn}
          </p>

          <!-- Interactive Synth Keyboard Pads -->
          <div class="keyboard-section">
            <div class="keyboard-pads">
              ${this.synthEngine.getScale().notes.map((note) => `
                <button class="synth-key" data-freq="${note.freq}" data-key="${note.keyMap}">
                  <span class="key-name">${this.currentLang === 'ar' ? note.nameAr : note.nameEn}</span>
                  <span class="key-shortcut">[${note.keyMap}]</span>
                  <span class="key-ripple"></span>
                </button>
              `).join('')}
            </div>
            <div class="keyboard-hint">${t.keyboardHint}</div>
          </div>

          <!-- 16-Step Kinetic Sequencer -->
          <div class="sequencer-section">
            <div class="sequencer-bar">
              <div class="seq-actions">
                <button id="btn-seq-play" class="seq-btn ${this.sequencer.getIsPlaying() ? 'active' : ''}">
                  <span class="seq-icon">${this.sequencer.getIsPlaying() ? '⏸' : '▶'}</span>
                  <span>${this.sequencer.getIsPlaying() ? t.pauseSeq : t.playSeq}</span>
                </button>
                <button id="btn-seq-random" class="seq-btn-sec">${t.randomSeq}</button>
                <button id="btn-seq-clear" class="seq-btn-sec">${t.clearSeq}</button>
              </div>

              <div class="bpm-control">
                <span>${t.bpm}: <b id="val-bpm">${this.sequencer.getBpm()}</b></span>
                <input type="range" id="slider-bpm" min="60" max="160" step="1" value="${this.sequencer.getBpm()}">
              </div>
            </div>

            <!-- Sequencer Grid (4 tracks x 16 steps) -->
            <div class="seq-grid">
              ${this.sequencer.tracks.map((track, tIdx) => `
                <div class="seq-row" data-track="${tIdx}">
                  <div class="track-label" style="border-right-color: ${track.color};">
                    ${this.currentLang === 'ar' ? track.nameAr : track.nameEn}
                  </div>
                  <div class="steps-row">
                    ${track.pattern.map((active, sIdx) => `
                      <button class="step-cell ${active ? 'active' : ''} ${sIdx % 4 === 0 ? 'beat-marker' : ''}" 
                              data-track="${tIdx}" 
                              data-step="${sIdx}"
                              style="${active ? `background: ${track.color}; box-shadow: 0 0 10px ${track.color};` : ''}">
                      </button>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </section>

      </main>

      <!-- FLOATING ACTION HINT -->
      <footer class="hud-footer">
        <div class="hud-hint-pill">
          <span class="pill-dot"></span>
          <span>${t.clickOrPress}</span>
        </div>
      </footer>
    `;

    this.spectrumCanvas = document.getElementById('spectrum-canvas') as HTMLCanvasElement;
    if (this.spectrumCanvas) {
      this.spectrumCtx = this.spectrumCanvas.getContext('2d');
    }

    // Attach sequencer step listener to highlight the active column
    this.sequencer.setOnStepListener((step) => {
      this.activeStepIndicator = step;
      const allCells = this.container.querySelectorAll('.step-cell');
      allCells.forEach(cell => {
        const s = parseInt(cell.getAttribute('data-step') || '-1', 10);
        if (s === step) {
          cell.classList.add('playing');
        } else {
          cell.classList.remove('playing');
        }
      });
    });
  }

  private bindEvents(): void {
    // Top Bar Actions
    this.container.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;

      // Ambient Engine
      if (target.closest('#btn-ambient')) {
        await this.audioManager.init();
        const active = this.synthEngine.toggleAmbientEngine();
        const btn = document.getElementById('btn-ambient');
        if (btn) {
          btn.classList.toggle('active', active);
          const txt = btn.querySelector('.btn-text');
          if (txt) {
            txt.textContent = active ? this.t().ambientActive : this.t().ambientEngine;
          }
        }
        return;
      }

      // Snapshot 4K
      if (target.closest('#btn-snapshot')) {
        await this.sceneManager.capture4KSnapshot();
        return;
      }

      // Language Toggle
      if (target.closest('#btn-lang')) {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.render();
        return;
      }

      // Theme Toggle
      if (target.closest('#btn-theme')) {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('light-theme', !this.isDarkTheme);
        return;
      }

      // Fullscreen
      if (target.closest('#btn-fullscreen')) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        return;
      }

      // Collapse HUD
      if (target.closest('#btn-collapse')) {
        this.isHUDCollapsed = !this.isHUDCollapsed;
        const body = this.container.querySelector('.hud-body');
        if (body) {
          body.classList.toggle('collapsed', this.isHUDCollapsed);
        }
        return;
      }

      // Materials selection
      const matCard = target.closest('.mat-card');
      if (matCard) {
        const mat = matCard.getAttribute('data-mat') as MaterialTheme;
        if (mat) {
          this.params.material = mat;
          this.sceneManager.setMaterialTheme(mat);
          this.container.querySelectorAll('.mat-card').forEach(c => c.classList.remove('active'));
          matCard.classList.add('active');
        }
        return;
      }

      // Scale selection
      const scaleChip = target.closest('.scale-chip');
      if (scaleChip) {
        const scaleId = scaleChip.getAttribute('data-scale') as MusicalScaleId;
        if (scaleId) {
          this.synthEngine.setScale(scaleId);
          this.render();
        }
        return;
      }

      // Synth Keys Click
      const synthKey = target.closest('.synth-key');
      if (synthKey) {
        const freq = parseFloat(synthKey.getAttribute('data-freq') || '440');
        await this.audioManager.init();
        this.synthEngine.triggerNote(freq, 0.8, 'triangle', 0.9);
        this.sceneManager.triggerShockwave(0, 0, 1.2);

        synthKey.classList.add('pressed');
        setTimeout(() => synthKey.classList.remove('pressed'), 250);
        return;
      }

      // Sequencer Play / Pause
      if (target.closest('#btn-seq-play')) {
        await this.audioManager.init();
        const playing = await this.sequencer.toggle();
        const btn = document.getElementById('btn-seq-play');
        if (btn) {
          btn.classList.toggle('active', playing);
          const icon = btn.querySelector('.seq-icon');
          const span = btn.querySelector('span:last-child');
          if (icon) icon.textContent = playing ? '⏸' : '▶';
          if (span) span.textContent = playing ? this.t().pauseSeq : this.t().playSeq;
        }
        return;
      }

      // Sequencer Randomize
      if (target.closest('#btn-seq-random')) {
        this.sequencer.randomize();
        this.render();
        return;
      }

      // Sequencer Clear
      if (target.closest('#btn-seq-clear')) {
        this.sequencer.clear();
        this.render();
        return;
      }

      // Sequencer Step Toggle
      const stepCell = target.closest('.step-cell');
      if (stepCell) {
        const tIdx = parseInt(stepCell.getAttribute('data-track') || '0', 10);
        const sIdx = parseInt(stepCell.getAttribute('data-step') || '0', 10);
        const active = this.sequencer.toggleStep(tIdx, sIdx);
        stepCell.classList.toggle('active', active);
        const trackColor = this.sequencer.tracks[tIdx].color;
        if (active) {
          (stepCell as HTMLElement).style.background = trackColor;
          (stepCell as HTMLElement).style.boxShadow = `0 0 10px ${trackColor}`;
        } else {
          (stepCell as HTMLElement).style.background = '';
          (stepCell as HTMLElement).style.boxShadow = '';
        }
        return;
      }
    });

    // Slider inputs
    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      if (target.id === 'slider-noise') {
        const val = parseFloat(target.value);
        this.params.noiseFrequency = val;
        this.sceneManager.setParams({ noiseFrequency: val });
        const tag = document.getElementById('val-noise');
        if (tag) tag.textContent = val.toFixed(2);
      } else if (target.id === 'slider-ripple') {
        const val = parseFloat(target.value);
        this.params.rippleAmplitude = val;
        this.sceneManager.setParams({ rippleAmplitude: val });
        const tag = document.getElementById('val-ripple');
        if (tag) tag.textContent = val.toFixed(2);
      } else if (target.id === 'slider-morph') {
        const val = parseFloat(target.value);
        this.params.morphSpeed = val;
        this.sceneManager.setParams({ morphSpeed: val });
        const tag = document.getElementById('val-morph');
        if (tag) tag.textContent = val.toFixed(2);
      } else if (target.id === 'slider-roughness') {
        const val = parseFloat(target.value);
        this.params.metallicRoughness = val;
        this.sceneManager.setParams({ metallicRoughness: val });
        const tag = document.getElementById('val-roughness');
        if (tag) tag.textContent = val.toFixed(2);
      } else if (target.id === 'slider-particles') {
        const val = parseInt(target.value, 10);
        this.params.particleCount = val;
        this.sceneManager.setParams({ particleCount: val });
        const tag = document.getElementById('val-particles');
        if (tag) tag.textContent = val.toString();
      } else if (target.id === 'slider-glow') {
        const val = parseFloat(target.value);
        this.params.glowIntensity = val;
        this.sceneManager.setParams({ glowIntensity: val });
        const tag = document.getElementById('val-glow');
        if (tag) tag.textContent = val.toFixed(1);
      } else if (target.id === 'check-wireframe') {
        const checked = target.checked;
        this.params.wireframe = checked;
        this.sceneManager.setParams({ wireframe: checked });
      } else if (target.id === 'slider-bpm') {
        const bpm = parseInt(target.value, 10);
        this.sequencer.setBpm(bpm);
        const tag = document.getElementById('val-bpm');
        if (tag) tag.textContent = bpm.toString();
      }
    });

    // Computer Keyboard Shortcuts & Playable Piano Keys
    window.addEventListener('keydown', async (e) => {
      // Avoid interference if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      const key = e.key.toUpperCase();

      // Check Synth Note Key Mapping
      const notes = this.synthEngine.getScale().notes;
      const matched = notes.find(n => n.keyMap === key);
      if (matched) {
        await this.audioManager.init();
        this.synthEngine.triggerNote(matched.freq, 0.8, 'triangle', 0.85);
        this.sceneManager.triggerShockwave(0, 0, 1.2);

        // Highlight matching on-screen pad
        const pad = this.container.querySelector(`.synth-key[data-key="${key}"]`);
        if (pad) {
          pad.classList.add('pressed');
          setTimeout(() => pad.classList.remove('pressed'), 200);
        }
        return;
      }

      // Spacebar: Toggle Sequencer Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        await this.audioManager.init();
        const playing = await this.sequencer.toggle();
        const btn = document.getElementById('btn-seq-play');
        if (btn) {
          btn.classList.toggle('active', playing);
          const icon = btn.querySelector('.seq-icon');
          const span = btn.querySelector('span:last-child');
          if (icon) icon.textContent = playing ? '⏸' : '▶';
          if (span) span.textContent = playing ? this.t().pauseSeq : this.t().playSeq;
        }
        return;
      }

      // 'F': Toggle HUD
      if (key === 'F') {
        this.isHUDCollapsed = !this.isHUDCollapsed;
        const body = this.container.querySelector('.hud-body');
        if (body) {
          body.classList.toggle('collapsed', this.isHUDCollapsed);
        }
        return;
      }

      // 'P': 4K Capture
      if (key === 'P') {
        await this.sceneManager.capture4KSnapshot();
        return;
      }
    });
  }

  private startSpectrumVisualizer(): void {
    const draw = () => {
      requestAnimationFrame(draw);
      if (!this.spectrumCanvas || !this.spectrumCtx) return;

      const w = this.spectrumCanvas.width;
      const h = this.spectrumCanvas.height;
      this.spectrumCtx.clearRect(0, 0, w, h);

      const rawFreq = this.audioManager.getRawFrequencyData();
      if (!rawFreq) return;

      // Draw bars
      const barCount = 28;
      const barWidth = (w / barCount) - 2;
      const step = Math.floor(rawFreq.length / (barCount * 4));

      for (let i = 0; i < barCount; i++) {
        const val = rawFreq[i * step] / 255.0;
        const barHeight = Math.max(3, val * (h - 6));
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        const grad = this.spectrumCtx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#a855f7');

        this.spectrumCtx.fillStyle = grad;
        this.spectrumCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    draw();
  }
}
