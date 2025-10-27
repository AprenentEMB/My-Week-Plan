// ...existing code...
type RGB = { r: number; g: number; b: number };

// Accepta "#fff", "#ffffff", "rgb(255,255,255)" o "rgba(255,255,255,1)"
export function parseColor(input?: string): RGB | null {
  if (!input) return null;
  const s = input.trim();
  // hex
  if (s[0] === "#") {
    const h = s.slice(1);
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  // rgb/rgba
  const m = s.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
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

// retorna true si el color és "fosc"
export function isDark(input?: string) {
  const rgb = parseColor(input);
  if (!rgb) return false;
  return getLuminance(rgb) < 0.5;
}

// retorna classe Tailwind per al text segons fons
export function textColorClassForBackground(input?: string) {
  return isDark(input) ? "text-white" : "text-gray-900";
}
// ...existing code...