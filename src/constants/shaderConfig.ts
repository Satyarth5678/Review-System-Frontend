export const SHADER_CONFIG = {
  swirl: {
    colorA: '#ffffff',
    colorB: '#f0f0f0',
    detail: 1.7
  },
  chromaFlow: {
    baseColor: '#ffffff',
    downColor: '#ff5f03',
    leftColor: '#ff5f03',
    rightColor: '#ff5f03',
    upColor: '#ff5f03',
    momentum: 13,
    radius: 3.5
  },
  flutedGlass: {
    aberration: 0.61,
    angle: 31,
    frequency: 8,
    highlight: 0.12,
    highlightSoftness: 0,
    lightAngle: -90,
    refraction: 4,
    shape: 'rounded' as const,
    softness: 1,
    speed: 0.15
  },
  filmGrain: {
    strength: 0.05
  }
} as const;
