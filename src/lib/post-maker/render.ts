// Draws a 1080x1350 (Instagram 4:5) schedule post onto a canvas.
import type { PostConfig, PostEvent, ThemeId } from './defaults';

export const W = 1080;
export const H = 1350;

const DISPLAY = 'Anton, Impact, sans-serif';
const BODY = 'Oswald, "Arial Narrow", sans-serif';

interface Theme {
  bg: string;
  primary: string;
  accent: string;
  glow: string;
}

export const THEMES: Record<ThemeId, Theme & { label: string }> = {
  tomahawks: { label: 'Tomahawks purple & gold', bg: '#0e0818', primary: '#5a2d91', accent: '#f5b82e', glow: 'rgba(110,55,180,0.55)' },
  choate: { label: 'Choate blue & gold', bg: '#06142e', primary: '#003478', accent: '#d4ab2b', glow: 'rgba(20,80,170,0.6)' },
};

export interface Assets {
  photo: HTMLImageElement | null;
  tomahawks: HTMLImageElement | null;
  choate: HTMLImageElement | null;
}

const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m: m - 1, d };
}

export function formatEventDate(e: PostEvent): { day: string; month: string } {
  if (!e.date) return { day: 'TBD', month: '' };
  const a = parseDate(e.date);
  if (!e.endDate || e.endDate === e.date) return { day: String(a.d).padStart(2, '0'), month: MONTHS[a.m] };
  const b = parseDate(e.endDate);
  if (a.m === b.m) return { day: `${a.d}–${b.d}`, month: MONTHS[a.m] };
  return { day: `${a.d}–${b.d}`, month: `${MONTHS[a.m].slice(0, 3)} / ${MONTHS[b.m].slice(0, 3)}` };
}

export function sortedEvents(events: PostEvent[]) {
  return [...events].filter((e) => e.name.trim()).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
}

// Largest font size (stepping down) at which text fits maxWidth.
function fitSize(ctx: CanvasRenderingContext2D, text: string, font: (s: number) => string, maxWidth: number, start: number, min: number) {
  let size = start;
  ctx.font = font(size);
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = font(size);
  }
  return size;
}

// Draws text vertically centred on cy using the glyphs' real bounds.
function centredText(ctx: CanvasRenderingContext2D, text: string, x: number, cy: number) {
  ctx.textBaseline = 'alphabetic';
  const m = ctx.measureText(text);
  ctx.fillText(text, x, cy + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function poly(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawNet(ctx: CanvasRenderingContext2D, alpha: number) {
  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 2;
  for (let i = -H; i < W + H; i += 46) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.moveTo(i, H);
    ctx.lineTo(i + H, 0);
    ctx.stroke();
  }
  ctx.restore();
}

// The photo panel's slanted right edge: x at the top and bottom.
const SLANT_TOP = 660;
const SLANT_BOTTOM = 520;
const slantX = (y: number) => SLANT_TOP - ((SLANT_TOP - SLANT_BOTTOM) * y) / H;

function drawPhoto(ctx: CanvasRenderingContext2D, cfg: PostConfig, t: Theme, photo: HTMLImageElement | null) {
  ctx.save();
  poly(ctx, [[0, 0], [SLANT_TOP, 0], [SLANT_BOTTOM, H], [0, H]]);
  ctx.clip();
  if (photo) {
    const s = Math.max(SLANT_TOP / photo.naturalWidth, H / photo.naturalHeight) * cfg.photoZoom;
    const dw = photo.naturalWidth * s;
    const dh = photo.naturalHeight * s;
    ctx.drawImage(photo, (SLANT_TOP - dw) * cfg.photoX, (H - dh) * cfg.photoY, dw, dh);
  } else {
    ctx.fillStyle = t.primary;
    ctx.fillRect(0, 0, SLANT_TOP, H);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `48px ${DISPLAY}`;
    ctx.textAlign = 'center';
    centredText(ctx, 'ADD A PHOTO', 300, H / 2);
  }
  // Darken top and bottom so the title and number stay readable.
  let g = ctx.createLinearGradient(0, 0, 0, 420);
  g.addColorStop(0, 'rgba(0,0,0,0.3)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SLANT_TOP, 420);
  g = ctx.createLinearGradient(0, 960, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 960, SLANT_TOP, H - 960);
  ctx.restore();

  // Gold then theme-colour stripes along the slanted edge.
  ctx.fillStyle = t.accent;
  poly(ctx, [[SLANT_TOP, 0], [SLANT_TOP + 18, 0], [SLANT_BOTTOM + 18, H], [SLANT_BOTTOM, H]]);
  ctx.fill();
  ctx.fillStyle = t.primary;
  poly(ctx, [[SLANT_TOP + 30, 0], [SLANT_TOP + 42, 0], [SLANT_BOTTOM + 42, H], [SLANT_BOTTOM + 30, H]]);
  ctx.fill();
}

// Title blocks sit in the right column so they never cover the action in the photo.
function drawTitle(ctx: CanvasRenderingContext2D, cfg: PostConfig, t: Theme, top: number): number {
  const right = 1056;
  ctx.save();
  ctx.translate(820, top + 120);
  ctx.rotate(-0.045);
  ctx.translate(-820, -(top + 120));
  ctx.textAlign = 'left';
  const shadow = () => {
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
  };

  let y = top;
  if (cfg.titleTop.trim()) {
    const s1 = fitSize(ctx, cfg.titleTop, (s) => `${s}px ${DISPLAY}`, 360, 128, 50);
    const w1 = ctx.measureText(cfg.titleTop).width + 56;
    const h1 = s1 * 1.08;
    const x1 = right - 70 - w1;
    shadow();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x1, y, w1, h1);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = t.primary;
    centredText(ctx, cfg.titleTop, x1 + 28, y + h1 / 2);
    y += h1 - 6;
  }
  if (cfg.titleBottom.trim()) {
    const s2 = fitSize(ctx, cfg.titleBottom, (s) => `${s}px ${DISPLAY}`, 440, 108, 44);
    const w2 = ctx.measureText(cfg.titleBottom).width + 52;
    const h2 = s2 * 1.08;
    shadow();
    ctx.fillStyle = t.accent;
    ctx.fillRect(right - w2, y, w2, h2);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#111111';
    centredText(ctx, cfg.titleBottom, right - w2 + 26, y + h2 / 2);
    y += h2;
  }
  ctx.restore();
  return y;
}

function drawLogos(ctx: CanvasRenderingContext2D, cfg: PostConfig, t: Theme, a: Assets): number {
  const showT = cfg.showTomahawks && a.tomahawks;
  const showC = cfg.showChoate && a.choate;
  const x = 724;
  const y = 36;
  const w = 326;
  const h = 176;
  if (showT || showC) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x, y, w, h, 26);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 5;
    roundRect(ctx, x, y, w, h, 26);
    ctx.stroke();

    const pad = 18;
    if (showT && showC) {
      // Same height for both logos, as tall as the card allows.
      const gap = 30;
      const rT = a.tomahawks!.naturalWidth / a.tomahawks!.naturalHeight;
      const rC = a.choate!.naturalWidth / a.choate!.naturalHeight;
      const lh = Math.min(h - pad * 2, (w - pad * 2 - gap) / (rT + rC));
      const used = lh * (rT + rC) + gap;
      const lx = x + (w - used) / 2;
      const ly = y + (h - lh) / 2;
      ctx.drawImage(a.tomahawks!, lx, ly, lh * rT, lh);
      ctx.fillStyle = '#d9d9d9';
      ctx.fillRect(lx + lh * rT + gap / 2 - 1, y + 30, 2, h - 60);
      ctx.drawImage(a.choate!, lx + lh * rT + gap, ly, lh * rC, lh);
    } else if (showT) {
      drawContain(ctx, a.tomahawks!, x + pad, y + pad, w - pad * 2, h - pad * 2);
    } else {
      drawContain(ctx, a.choate!, x + pad, y + pad, w - pad * 2, h - pad * 2);
    }
  }

  const lines = [
    { text: cfg.teamLine, color: '#ffffff', size: 30 },
    { text: cfg.schoolLine, color: t.accent, size: 26 },
  ].filter((l) => l.text.trim());
  let ly = showT || showC ? y + h + 40 : 50;
  ctx.textAlign = 'left';
  for (const l of lines) {
    fitSize(ctx, l.text.toUpperCase(), (s) => `600 ${s}px ${BODY}`, 1050 - 716, l.size, 18);
    ctx.fillStyle = l.color;
    centredText(ctx, l.text.toUpperCase(), 716, ly);
    ly += l.size + 10;
  }
  return ly;
}

function drawEvents(ctx: CanvasRenderingContext2D, cfg: PostConfig, t: Theme, top: number) {
  const events = sortedEvents(cfg.events).slice(0, 6);
  if (!events.length) return;
  const bottom = 1075;
  const rh = Math.min(170, (bottom - top) / events.length);
  const startY = top + (bottom - top - rh * events.length) / 2;

  events.forEach((e, i) => {
    const y = startY + i * rh;
    const cy = y + rh / 2;
    const x0 = slantX(cy) + 64;
    const { day, month } = formatEventDate(e);

    // Date column
    const dateW = 160;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    const daySize = fitSize(ctx, day, (s) => `${s}px ${DISPLAY}`, dateW, Math.min(92, rh * 0.58), 30);
    centredText(ctx, day, x0 + dateW / 2, cy - (month ? rh * 0.1 : 0));
    if (month) {
      ctx.fillStyle = t.accent;
      fitSize(ctx, month, (s) => `700 ${s}px ${BODY}`, dateW + 10, Math.min(28, rh * 0.18), 14);
      centredText(ctx, month, x0 + dateW / 2, cy + daySize * 0.42 + 4);
    }

    // Divider bar
    ctx.fillStyle = t.accent;
    ctx.fillRect(x0 + dateW + 16, cy - rh * 0.3, 6, rh * 0.6);

    // Name + location
    const tx = x0 + dateW + 40;
    const maxW = W - 24 - tx;
    const name = e.name.toUpperCase();
    const loc = e.location.toUpperCase();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    const nameStart = Math.min(46, rh * 0.3);
    let nameSize = fitSize(ctx, name, (s) => `${s}px ${DISPLAY}`, maxW, nameStart, 28);
    const nameLines: string[] = [];
    if (ctx.measureText(name).width > maxW) {
      // Too long for one line: split into two at the most balanced space.
      const words = name.split(' ');
      let best = 1;
      let bestDiff = Infinity;
      for (let k = 1; k < words.length; k++) {
        const diff = Math.abs(ctx.measureText(words.slice(0, k).join(' ')).width - ctx.measureText(words.slice(k).join(' ')).width);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = k;
        }
      }
      nameLines.push(words.slice(0, best).join(' '), words.slice(best).join(' '));
      const longest = nameLines.reduce((a, b) => (ctx.measureText(a).width > ctx.measureText(b).width ? a : b));
      nameSize = fitSize(ctx, longest, (s) => `${s}px ${DISPLAY}`, maxW, nameStart * 0.8, 18);
    } else {
      nameLines.push(name);
    }
    const lineH = nameSize * 1.12;
    const locSize = Math.min(26, rh * 0.17);
    const blockH = lineH * nameLines.length + (loc ? locSize + 8 : 0);
    let ny = cy - blockH / 2 + lineH / 2;
    ctx.font = `${nameSize}px ${DISPLAY}`;
    for (const l of nameLines) {
      centredText(ctx, l, tx, ny);
      ny += lineH;
    }
    if (loc) {
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      fitSize(ctx, loc, (s) => `500 ${s}px ${BODY}`, maxW, locSize, 14);
      centredText(ctx, loc, tx, ny - lineH / 2 + locSize / 2 + 12);
    }

    // Row separator
    if (i < events.length - 1) {
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(slantX(y + rh) + 48, y + rh - 1, W, 2);
    }
  });
}

function drawNameplate(ctx: CanvasRenderingContext2D, cfg: PostConfig, t: Theme) {
  const cx = 660;
  // Without a footer line, drop the whole name block lower to use the space.
  const dy = cfg.footer.trim() ? 0 : 34;

  // Big jersey number over the bottom of the photo.
  if (cfg.number.trim()) {
    const num = `#${cfg.number.replace('#', '')}`;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = `190px ${DISPLAY}`;
    ctx.lineWidth = 10;
    ctx.strokeStyle = t.primary;
    ctx.lineJoin = 'round';
    ctx.strokeText(num, 34, 1150 + dy);
    ctx.fillStyle = t.accent;
    ctx.fillText(num, 34, 1150 + dy);
    ctx.restore();
  }

  const info = [cfg.position, cfg.gradYear && `CLASS OF ${cfg.gradYear}`].filter((s) => s && s.trim()).join('  •  ').toUpperCase();
  if (info) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    fitSize(ctx, info, (s) => `700 ${s}px ${BODY}`, 760, 40, 20);
    centredText(ctx, info, cx, 1120 + dy);
  }

  const bx = 260;
  const bw = 800;
  const by = 1160 + dy;
  const bh = 112;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = t.primary;
  roundRect(ctx, bx, by, bw, bh, bh / 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 4;
  roundRect(ctx, bx, by, bw, bh, bh / 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  const name = cfg.name.toUpperCase();
  fitSize(ctx, name, (s) => `${s}px ${DISPLAY}`, bw - 90, 82, 30);
  centredText(ctx, name, bx + bw / 2, by + bh / 2);

  if (cfg.footer.trim()) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    fitSize(ctx, cfg.footer, (s) => `500 ${s}px ${BODY}`, bw, 28, 16);
    centredText(ctx, cfg.footer, bx + bw / 2, 1310);
  }
}

export function drawPost(ctx: CanvasRenderingContext2D, cfg: PostConfig, assets: Assets) {
  const t = THEMES[cfg.theme];
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(880, 720, 40, 880, 720, 760);
  glow.addColorStop(0, t.glow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  drawNet(ctx, 0.05);

  drawPhoto(ctx, cfg, t, assets.photo);
  const logosBottom = drawLogos(ctx, cfg, t, assets);
  const titleBottom = drawTitle(ctx, cfg, t, logosBottom + 6);
  drawEvents(ctx, cfg, t, titleBottom + 24);
  drawNameplate(ctx, cfg, t);
  ctx.restore();
}

export function buildCaption(cfg: PostConfig) {
  const events = sortedEvents(cfg.events)
    .map((e) => {
      const { day, month } = formatEventDate(e);
      const when = month ? `${month.slice(0, 3)} ${day}` : day;
      return `📅 ${when} — ${e.name}${e.location ? ` (${e.location})` : ''}`;
    })
    .join('\n');
  const title = [cfg.titleTop, cfg.titleBottom].filter(Boolean).join(' ').toLowerCase();
  const titleCased = title.charAt(0).toUpperCase() + title.slice(1);
  const who = [cfg.name, cfg.position && cfg.position.charAt(0) + cfg.position.slice(1).toLowerCase(), cfg.gradYear && `Class of ${cfg.gradYear}`, cfg.schoolLine]
    .filter(Boolean)
    .join(' | ');
  const tags = ['#girlslacrosse', '#wlax', '#lacrossegoalie', '#leftygoalie', '#goalie', `#classof${cfg.gradYear}`, `#${cfg.gradYear}recruit`, '#lacrosserecruiting', '#fallball'];
  return [
    `${titleCased}! 🥍💜💛 ${cfg.igTeamHandle}`.trim(),
    '',
    events,
    '',
    who,
    ...(cfg.footer.trim() ? [cfg.footer] : []),
    '',
    tags.join(' '),
  ].join('\n');
}
