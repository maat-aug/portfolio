// Gerador de rachaduras dos elementos atingidos.

export type CrackLine = {
  readonly d: string;
  /** Espessura em px (os paths usam `vector-effect: non-scaling-stroke`). */
  readonly width: number;
  /** Atraso em ms, para a rachadura parecer se espalhar a partir do impacto. */
  readonly delay: number;
};

type Point = [number, number];

const SEGMENTS = 5;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const fmt = (p: Point) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

function branch(start: Point, angle: number, length: number, width: number, delay: number): CrackLine {
  let p = start;
  let d = `M${fmt(p)}`;
  for (let s = 0; s < 3; s++) {
    angle += rand(-0.5, 0.5);
    p = [p[0] + (Math.cos(angle) * length) / 3, p[1] + (Math.sin(angle) * length) / 3];
    d += ` L${fmt(p)}`;
  }
  return { d, width, delay };
}

/** Raios irregulares com galhos, um anel em volta do impacto e um miolo estilhaçado. */
export function crackLines(ox: number, oy: number, reach: number, rays: number, width: number): CrackLine[] {
  const lines: CrackLine[] = [];
  const ring: Point[] = [];
  const ringAt = 1 + Math.floor(Math.random() * 2);
  const stepDelay = 35;

  for (let i = 0; i < rays; i++) {
    let angle = (i / rays) * Math.PI * 2 + rand(-0.35, 0.35);
    const step = (reach * rand(0.55, 1)) / SEGMENTS;
    let p: Point = [ox, oy];
    let d = `M${fmt(p)}`;
    for (let s = 0; s < SEGMENTS; s++) {
      angle += rand(-0.45, 0.45);
      p = [p[0] + Math.cos(angle) * step, p[1] + Math.sin(angle) * step];
      d += ` L${fmt(p)}`;
      if (s === ringAt) ring.push(p);
      if (s > 0 && s < SEGMENTS - 1 && Math.random() < 0.4) {
        const side = Math.random() < 0.5 ? -1 : 1;
        lines.push(branch(p, angle + side * rand(0.5, 1.1), (SEGMENTS - s) * step * 0.5, width * 0.55, s * stepDelay));
      }
    }
    lines.push({ d, width, delay: 0 });
  }

  // Anel concêntrico ligando raios vizinhos, como num vidro atingido.
  if (ring.length >= 3) {
    ring.forEach((a, i) => {
      if (Math.random() < 0.3) return;
      const b = ring[(i + 1) % ring.length]!;
      const mid: Point = [(a[0] + b[0]) / 2 + rand(-3, 3), (a[1] + b[1]) / 2 + rand(-3, 3)];
      lines.push({ d: `M${fmt(a)} L${fmt(mid)} L${fmt(b)}`, width: width * 0.6, delay: (ringAt + 1) * stepDelay });
    });
  }

  // Miolo: riscos curtos e grossos bem no ponto do impacto.
  for (let i = 0; i < 5; i++) {
    const angle = rand(0, Math.PI * 2);
    const length = reach * rand(0.06, 0.12);
    lines.push({ d: `M${fmt([ox, oy])} L${fmt([ox + Math.cos(angle) * length, oy + Math.sin(angle) * length])}`, width: width * 1.3, delay: 0 });
  }
  return lines;
}

