// ...existing code...
type RGB = { r: number; g: number; b: number };

export function parseColor(input?: string): RGB | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();

  // ignora transparents o heretats
  if (['transparent', 'inherit', 'initial', 'unset'].includes(s)) return null;

  // hex
  if (s.startsWith('#')) {
    const h = s.slice(1);
    const full =
      h.length === 3
        ? h.split('').map(c => c + c).join('')
        : h.length === 6
        ? h
        : null;
    if (!full) return null;

    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }

  // rgb/rgba
  const m = s.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (m) {
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  return null;
}

function linearizeChannel(v: number) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function getLuminance(rgb: RGB) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(linearizeChannel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isDark(input?: string, fallbackBg: string = '#ffffff') {
  const rgb = parseColor(input) ?? parseColor(fallbackBg);
  if (!rgb) return false; // impossible, però per seguretat
  return getLuminance(rgb) < 0.5;
}

export function textColorClassForBackground(input?: string, fallbackBg: string = '#ffffff') {
  return isDark(input, fallbackBg) ? 'text-white' : 'text-gray-800';
}

// 🔹 Nova funció per calcular el color del border
export function getBorderColor(bg?: string, fallback: string = '#ffffff') {
  if (!bg) return '#000000';

  if (bg.startsWith('linear-gradient')) {
    const m = bg.match(/#([0-9a-f]{3,6})/i);
    const firstColor = m ? `#${m[1]}` : fallback;
    return isDark(firstColor, fallback) ? '#ffffff' : '#000000';
  }

  return isDark(bg, fallback) ? '#ffffff' : '#000000';
}


// ...existing code...
