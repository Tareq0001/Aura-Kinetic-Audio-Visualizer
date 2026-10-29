export const LiquidVertexShader = `
// Simplex 3D Noise by Stefan Gustavson
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

uniform float uTime;
uniform float uNoiseFreq;
uniform float uRippleAmp;
uniform float uMorphSpeed;
uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioTreble;
uniform vec3  uShockwaveCenter;
uniform float uShockwaveProgress;
uniform float uShockwaveStrength;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vDisplacement;
varying float vNoise;

float getDisplacement(vec3 pos) {
  float t = uTime * uMorphSpeed;
  
  // Layer 1: Low frequency organic breathing (modulated by Bass)
  float noise1 = snoise(pos * (uNoiseFreq * 0.8) + vec3(t * 0.4, t * 0.3, t * 0.5));
  
  // Layer 2: Mid-frequency fluid turbulence (modulated by Mids)
  float noise2 = snoise(pos * (uNoiseFreq * 1.8) - vec3(t * 0.6, t * 0.5, t * 0.7)) * 0.5;
  
  // Layer 3: High-frequency crystalline shimmer (modulated by Treble)
  float noise3 = snoise(pos * (uNoiseFreq * 3.5) + vec3(t * 1.2)) * 0.25;

  float totalNoise = (noise1 + noise2 + noise3);
  
  // Audio excitation
  float audioAmp = 1.0 + (uAudioBass * 0.9) + (uAudioMid * 0.6) + (uAudioTreble * 0.4);
  float disp = totalNoise * uRippleAmp * audioAmp;

  // Kinetic Mouse Shockwave ring
  if (uShockwaveProgress > 0.0 && uShockwaveProgress < 1.0) {
    float dist = distance(normalize(pos), normalize(uShockwaveCenter));
    float ringRadius = uShockwaveProgress * 2.2;
    float ringWidth = 0.35;
    float ringDist = abs(dist - ringRadius);
    if (ringDist < ringWidth) {
      float shock = sin((ringDist / ringWidth) * 3.14159) * (1.0 - uShockwaveProgress) * uShockwaveStrength;
      disp += shock * 0.45;
    }
  }

  return disp;
}

void main() {
  vNoise = getDisplacement(position);
  vDisplacement = vNoise;

  vec3 displacedPosition = position + normal * vNoise;

  // Compute normal analytically via finite differences
  float eps = 0.015;
  vec3 pX = position + vec3(eps, 0.0, 0.0);
  vec3 pY = position + vec3(0.0, eps, 0.0);
  vec3 pZ = position + vec3(0.0, 0.0, eps);

  vec3 dX = pX + normal * getDisplacement(pX);
  vec3 dY = pY + normal * getDisplacement(pY);
  vec3 dZ = pZ + normal * getDisplacement(pZ);

  vec3 computedNormal = normalize(cross(dY - displacedPosition, dX - displacedPosition));
  if (length(computedNormal) < 0.1) computedNormal = normal;

  vNormal = normalize(normalMatrix * computedNormal);
  vPosition = displacedPosition;

  vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const LiquidFragmentShader = `
uniform float uTime;
uniform vec3  uBaseColor;
uniform vec3  uSecondaryColor;
uniform vec3  uAccentColor;
uniform float uRoughness;
uniform float uGlowIntensity;
uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioTreble;
uniform int   uMaterialMode; // 0=Chrome, 1=Iridescent, 2=Gold, 3=Emerald, 4=Obsidian

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vDisplacement;
varying float vNoise;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Dynamic light directions
  vec3 light1 = normalize(vec3(1.5, 2.0, 1.8));
  vec3 light2 = normalize(vec3(-1.8, -1.2, -1.0));
  vec3 light3 = normalize(vec3(0.0, 2.5, -2.0));

  // Diffuse
  float diff1 = max(dot(normal, light1), 0.0);
  float diff2 = max(dot(normal, light2), 0.0);
  float diff3 = max(dot(normal, light3), 0.0);

  // Specular Blinn-Phong
  vec3 half1 = normalize(light1 + viewDir);
  vec3 half2 = normalize(light2 + viewDir);
  float specPower = mix(128.0, 12.0, uRoughness);
  float spec1 = pow(max(dot(normal, half1), 0.0), specPower);
  float spec2 = pow(max(dot(normal, half2), 0.0), specPower * 0.7);

  // Fresnel rim calculation
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  vec3 finalColor = vec3(0.0);

  if (uMaterialMode == 0) {
    // Liquid Molten Chrome
    vec3 reflection = reflect(-viewDir, normal);
    float skyReflection = smoothstep(-0.2, 0.8, reflection.y);
    vec3 chromeBase = mix(uBaseColor, uSecondaryColor, skyReflection);
    finalColor = chromeBase * (0.3 + diff1 * 0.5 + diff2 * 0.3);
    finalColor += vec3(1.0, 1.0, 1.1) * spec1 * 1.5;
    finalColor += uAccentColor * fresnel * (1.2 + uAudioTreble);
  } 
  else if (uMaterialMode == 1) {
    // Neon Iridescent Pearl: Angle-dependent rainbow interference
    float angle = dot(normal, viewDir);
    vec3 iridescent = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + angle * 6.28 + vDisplacement * 2.0 + uTime * 0.3);
    finalColor = mix(uBaseColor, iridescent, 0.75);
    finalColor *= (0.4 + diff1 * 0.6 + diff2 * 0.4);
    finalColor += vec3(1.0) * spec1 * 1.3;
    finalColor += iridescent * fresnel * (1.6 + uAudioMid);
  }
  else if (uMaterialMode == 2) {
    // 24k Molten Gold: Warm luxurious deep specular
    vec3 goldBase = mix(uBaseColor, uSecondaryColor, diff1);
    finalColor = goldBase * (0.5 + diff1 * 0.6 + diff2 * 0.2);
    finalColor += vec3(1.0, 0.9, 0.5) * spec1 * 1.8;
    finalColor += uAccentColor * fresnel * 1.2;
    // Inner molten core glow modulated by Bass
    finalColor += vec3(0.8, 0.3, 0.0) * max(0.0, -vDisplacement) * (1.5 + uAudioBass * 2.0);
  }
  else if (uMaterialMode == 3) {
    // Bioluminescent Deep Sea Emerald: Subsurface glow & turquoise radiance
    vec3 emeraldBase = mix(uBaseColor, uSecondaryColor, clamp(diff1 + diff3, 0.0, 1.0));
    finalColor = emeraldBase * 0.6;
    finalColor += uAccentColor * (fresnel * 2.2 + max(0.0, vDisplacement) * 1.8) * (1.0 + uAudioBass * 1.2);
    finalColor += vec3(0.6, 1.0, 0.9) * spec1 * 1.2;
  }
  else {
    // Obsidian Mirror: Ultra-deep black volcanic glass with violet sheen
    float body = 0.04 + diff1 * 0.08;
    finalColor = uBaseColor * body;
    finalColor += vec3(1.0, 0.9, 1.0) * spec1 * 2.0;
    finalColor += uAccentColor * fresnel * (1.8 + uAudioTreble * 1.5);
    // Subtle internal chromatic fracture
    finalColor += uSecondaryColor * pow(fresnel, 2.0) * 0.6;
  }

  // Audio Glow Boost
  float audioGlow = (uAudioBass * 0.35 + uAudioMid * 0.25 + uAudioTreble * 0.2) * uGlowIntensity;
  finalColor += uAccentColor * audioGlow;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
