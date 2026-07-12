export function lerpHexColor(hexA, hexB, t) {
  const clamp = Math.min(1, Math.max(0, t));
  const a = parseInt(hexA.replace('#', ''), 16);
  const b = parseInt(hexB.replace('#', ''), 16);

  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;

  const rr = Math.round(ar + (br - ar) * clamp);
  const rg = Math.round(ag + (bg - ag) * clamp);
  const rb = Math.round(ab + (bb - ab) * clamp);

  return `rgb(${rr}, ${rg}, ${rb})`;
}
