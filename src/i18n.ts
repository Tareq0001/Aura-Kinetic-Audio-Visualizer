export type Language = 'ar' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  creatorTag: string;
  authorName: string;
  authorRole: string;
  
  // HUD Sections
  synthLab: string;
  visualControls: string;
  scalesTitle: string;
  materialsTitle: string;
  sequencerTitle: string;
  ambientEngine: string;
  ambientActive: string;
  ambientInactive: string;
  
  // Visual Sliders
  noiseFreq: string;
  rippleAmp: string;
  morphSpeed: string;
  roughness: string;
  particleDensity: string;
  glowPower: string;
  wireframeMode: string;
  
  // Materials
  matChrome: string;
  matChromeDesc: string;
  matIridescent: string;
  matIridescentDesc: string;
  matGold: string;
  matGoldDesc: string;
  matEmerald: string;
  matEmeraldDesc: string;
  matObsidian: string;
  matObsidianDesc: string;

  // Scales
  scaleHijaz: string;
  scaleHijazDesc: string;
  scaleBayati: string;
  scaleBayatiDesc: string;
  scalePentatonic: string;
  scalePentatonicDesc: string;
  scaleCelestial: string;
  scaleCelestialDesc: string;

  // Sequencer & Keyboard
  playSeq: string;
  pauseSeq: string;
  bpm: string;
  clearSeq: string;
  randomSeq: string;
  keyboardHint: string;
  clickOrPress: string;

  // Actions & Tools
  snapshotBtn: string;
  snapshotToast: string;
  toggleTheme: string;
  toggleLang: string;
  toggleFullscreen: string;
  resetDefaults: string;
  audioWarning: string;
  startAudio: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appTitle: "أَورا | معمل الصوت السائل والمؤثرات التوليدية",
    appSubtitle: "محاكاة حركية ثلاثية الأبعاد للموائع الصوتية والفيزياء التوليدية",
    creatorTag: "ابتكار وهندسة المنظومة",
    authorName: "أ. طارق ابوعشي",
    authorRole: "كبير مهندسي النظم التفاعلية والتقنيات الإبداعية",

    synthLab: "لوحة السِنث التفاعلية",
    visualControls: "التحكم الحركي والفيزيائي",
    scalesTitle: "المقامات والسلالِم الموسيقية",
    materialsTitle: "خامات السائل الطيفية",
    sequencerTitle: "الموزع الإيقاعي الحركي (16 خطوة)",
    ambientEngine: "المحرك الأثيري التوليدي",
    ambientActive: "مفعّل - تدفق صوتي مستمر",
    ambientInactive: "متوقف - انقر للتفعيل",

    noiseFreq: "التردد التوليدي",
    rippleAmp: "سعة التموجات السائلة",
    morphSpeed: "سرعة الانسياب الحركي",
    roughness: "خشونة السطح وبريقه",
    particleDensity: "كثافة السرب الأثيري",
    glowPower: "شدة التوهج والبريق",
    wireframeMode: "نمط الشبكة الهندسية",

    matChrome: "كروم سائل مصقول",
    matChromeDesc: "انعكاس مرآوي فائق مع تموجات معدنية سائلة",
    matIridescent: "لؤلؤي نيون متوهج",
    matIridescentDesc: "تدرج طيفي ديناميكي يتغير بتغير زاوية الرؤية والصوت",
    matGold: "ذهب عيار 24 منصهر",
    matGoldDesc: "سائل ذهبي ملكي دافئ عالي الكثافة مع وهج عنبري",
    matEmerald: "زمرد الأعماق المتألق",
    matEmeraldDesc: "مادة حيوية مضيئة تحاكي أعماق المحيط السحيقة",
    matObsidian: "مرآة الأوبسيديان",
    matObsidianDesc: "حجر بركاني أسود فاحم بانعكاسات بنفسجية غامضة",

    scaleHijaz: "مقام الحجاز الأصيل",
    scaleHijazDesc: "طابع شرقي مهيب يجمع بين الشجن والعمق الأسطوري",
    scaleBayati: "مقام البياتي العريق",
    scaleBayatiDesc: "نغمة عربية تراثية أصيلة متوازنة ودافئة",
    scalePentatonic: "خماسي سيبراني",
    scalePentatonicDesc: "سُلّم إلكتروني مستقبلي مستوحى من نيون السايبربانك",
    scaleCelestial: "أثيري كوني (Lydian)",
    scaleCelestialDesc: "أبعاد فلكية رحبة تمنح شعوراً بالتحليق والتأمل",

    playSeq: "تشغيل الإيقاع",
    pauseSeq: "إيقاف مؤقت",
    bpm: "السرعة (BPM)",
    clearSeq: "مسح الموزع",
    randomSeq: "توليد عشوائي",
    keyboardHint: "استخدم لوحة المفاتيح [A-K] أو [Q-U] أو انقر مباشرة على الأوتار",
    clickOrPress: "انقر للتفاعل السائل وإطلاق الصدمات الحركية",

    snapshotBtn: "التقاط 4K فائق الدقة",
    snapshotToast: "تم حفظ اللوحة التوليدية بنجاح!",
    toggleTheme: "تبديل المظهر",
    toggleLang: "English",
    toggleFullscreen: "ملء الشاشة",
    resetDefaults: "إعادة الضبط",
    audioWarning: "انقر في أي مكان لبدء المحرك الصوتي التوليدي",
    startAudio: "تفعيل الصوت"
  },
  en: {
    appTitle: "AURA | Liquid Audio & Kinetic Visual Synth Lab",
    appSubtitle: "Real-time 3D WebGL Fluid Dynamics & Procedural Sound Synthesis",
    creatorTag: "Conceived & Architected by",
    authorName: "Tareq Abuashi",
    authorRole: "Lead Interactive Systems Architect & Creative Technologist",

    synthLab: "Interactive Synth Keyboard",
    visualControls: "Kinetic Fluid Controls",
    scalesTitle: "Harmonic Scales",
    materialsTitle: "Liquid Spectral Shaders",
    sequencerTitle: "16-Step Kinetic Sequencer",
    ambientEngine: "Procedural Ambient Core",
    ambientActive: "Active - Evolving Soundscape",
    ambientInactive: "Paused - Click to activate",

    noiseFreq: "Noise Frequency",
    rippleAmp: "Ripple Amplitude",
    morphSpeed: "Morph Fluid Speed",
    roughness: "Surface Roughness",
    particleDensity: "Quantum Swarm Count",
    glowPower: "Bloom & Glow Power",
    wireframeMode: "Wireframe Topology",

    matChrome: "Molten Chrome",
    matChromeDesc: "Ultra-specular liquid mercury with metallic rippling",
    matIridescent: "Neon Iridescent Pearl",
    matIridescentDesc: "Prismatic rainbow shift reacting to angle and acoustic peaks",
    matGold: "24K Molten Gold",
    matGoldDesc: "Heavy viscous pure liquid gold with warm amber luminosity",
    matEmerald: "Bioluminescent Emerald",
    matEmeraldDesc: "Deep-sea radiant turquoise organism emitting pulsating light",
    matObsidian: "Obsidian Mirror",
    matObsidianDesc: "Vitreous volcanic obsidian glass with violet chromatic glints",

    scaleHijaz: "Hijaz Arabic Scale",
    scaleHijazDesc: "Mystical Middle-Eastern mode rich in historic resonance",
    scaleBayati: "Bayati Heritage",
    scaleBayatiDesc: "Authentic oriental soul scale with rich emotive warmth",
    scalePentatonic: "Cyber Pentatonic",
    scalePentatonicDesc: "Futuristic synthetic scale engineered for cyberpunk grooves",
    scaleCelestial: "Celestial Ambient (Lydian)",
    scaleCelestialDesc: "Airy harmonic dreamscape tuned for deep immersion",

    playSeq: "Play Sequencer",
    pauseSeq: "Pause",
    bpm: "Tempo (BPM)",
    clearSeq: "Clear Grid",
    randomSeq: "Randomize",
    keyboardHint: "Play using keys [A-K] / [Q-U] or click the dynamic touch pads",
    clickOrPress: "Hover & drag to propagate fluid kinetic shockwaves",

    snapshotBtn: "Capture 4K Frame",
    snapshotToast: "Artwork frame captured in ultra-high resolution!",
    toggleTheme: "Toggle Theme",
    toggleLang: "العربية",
    toggleFullscreen: "Fullscreen",
    resetDefaults: "Reset Presets",
    audioWarning: "Click anywhere to ignite the procedural audio engine",
    startAudio: "Enable Audio"
  }
};
