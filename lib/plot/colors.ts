import { ColorMapName } from '@/lib/plot/types';

const DEFAULT_COLOR: [number, number, number] = [0.145, 0.388, 0.922];

export const COLOR_MAPS: Record<ColorMapName, string[]> = {
  viridis: ['#440154', '#3b528b', '#21908d', '#5dc863', '#fde725'],
  plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89441', '#f0f921'],
  inferno: ['#000004', '#420a68', '#932667', '#dd513a', '#fba60a'],
  magma: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d'],
  cividis: ['#00204c', '#424c6f', '#7b7b78', '#bca76f', '#fee838'],
};

export function hexToRgbNormalized(hex: string): [number, number, number] | null {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 3 && normalized.length !== 6) {
    return null;
  }

  const expanded = normalized.length === 3
    ? normalized.split('').map((ch) => `${ch}${ch}`).join('')
    : normalized;

  const parsed = Number.parseInt(expanded, 16);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return [
    ((parsed >> 16) & 255) / 255,
    ((parsed >> 8) & 255) / 255,
    (parsed & 255) / 255,
  ];
}

export function parseCssColorToRgbNormalized(
  color: string | undefined,
  fallback: [number, number, number] = DEFAULT_COLOR,
): [number, number, number] {
  if (!color) {
    return fallback;
  }

  const value = color.trim();
  if (value.startsWith('#')) {
    return hexToRgbNormalized(value) ?? fallback;
  }

  const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgbMatch) {
    return fallback;
  }

  const parts = rgbMatch[1].split(',').map((part) => Number.parseFloat(part.trim()));
  if (parts.length < 3 || parts.slice(0, 3).some((component) => Number.isNaN(component))) {
    return fallback;
  }

  return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
}

export function sampleColorMap(name: ColorMapName, ratio: number): string {
  const palette = COLOR_MAPS[name] ?? COLOR_MAPS.viridis;
  if (palette.length === 1) {
    return palette[0];
  }

  const t = Math.min(1, Math.max(0, ratio));
  const scaled = t * (palette.length - 1);
  const leftIndex = Math.floor(scaled);
  const rightIndex = Math.min(palette.length - 1, leftIndex + 1);
  const localRatio = scaled - leftIndex;

  const left = hexToRgbNormalized(palette[leftIndex]);
  const right = hexToRgbNormalized(palette[rightIndex]);
  if (!left || !right) {
    return palette[leftIndex];
  }

  const mixed = [
    left[0] + (right[0] - left[0]) * localRatio,
    left[1] + (right[1] - left[1]) * localRatio,
    left[2] + (right[2] - left[2]) * localRatio,
  ];

  return `rgb(${Math.round(mixed[0] * 255)}, ${Math.round(mixed[1] * 255)}, ${Math.round(mixed[2] * 255)})`;
}

export function buildColorMapStops(name: ColorMapName): Array<{ position: number; color: [number, number, number] }> {
  const palette = COLOR_MAPS[name] ?? COLOR_MAPS.viridis;
  const denominator = Math.max(1, palette.length - 1);

  return palette
    .map((hex, index) => ({
      position: index / denominator,
      color: hexToRgbNormalized(hex),
    }))
    .filter((entry): entry is { position: number; color: [number, number, number] } => Boolean(entry.color));
}
