// Engine do easter egg: física, escolha de alvos e destruição em DOM puro. O estado fica fora do
// React e o loop de requestAnimationFrame escreve os estilos direto, sem re-render por frame.

import { crackLines } from "./cracks";

export type Dir = "up" | "down" | "left" | "right";
type Point = [number, number];

export type EngineParts = {
  layer: HTMLElement;
  character: HTMLElement;
  flip: HTMLElement;
  sprite: HTMLElement;
  shadow: HTMLElement;
  /** Elementos que nunca viram alvo (a camada visual e os controles). */
  ignore: readonly Element[];
  onDestroyed: (count: number) => void;
};

export type Engine = {
  press: (dir: Dir) => void;
  release: (dir: Dir) => void;
  releaseAll: () => void;
  jump: () => void;
  waterGun: () => void;
  razorShell: () => void;
  destroy: () => void;
};

const SIZE = 96;
const VIEWBOX_W = 120;
const VIEWBOX_H = 100;
const SPRITE_H = (SIZE * VIEWBOX_H) / VIEWBOX_W;
const MOUTH: Point = [92, 54];
const STATS = { speed: 6.5, accel: 0.2, stepRate: 0.08, jump: 17, gravity: 0.95, radius: 70, shake: 5 };
const BEAM_RANGE = 380;
const BEAM_PIERCE = 3;
const BEAM_COOLDOWN_MS = 700;
const SHELL_REACH = 70;
const SHELL_COOLDOWN_MS = 450;
const MIN_FEET_Y = 70;
const EDGE_SCROLL_ZONE = 160;
const EDGE_SCROLL_MAX = 28;
const MAX_ACTIVE_SHARDS = 160;
// Acima disso só vira alvo o que tem fundo, borda ou texto próprio (um card grande); caixa
// transparente desse tamanho é contêiner de layout (main, seção) e quebrá-la apagaria a página.
const MAX_TARGET_AREA = 0.35;
const CRUNCH_MS = 110;
const HIT_STOP_MS = 70;
const SVG_NS = "http://www.w3.org/2000/svg";
const NO_CRACK_TAGS = new Set(["IMG", "INPUT", "TEXTAREA", "SELECT", "VIDEO", "CANVAS", "IFRAME", "BR", "HR"]);
const POP_WORDS = ["SPLASH!", "SPLOSH!", "OSHA!", "PLOFT!", "TCHÁ!"];
const WATER = "#5EC8F2";

type Spring = { x: number; v: number; target: number };
const spring = (value: number): Spring => ({ x: value, v: 0, target: value });
// Mola amortecida: um "chute" no valor volta para o alvo com um leve elástico.
function stepSpring(s: Spring) {
  s.v = (s.v + (s.target - s.x) * 0.2) * 0.75;
  s.x += s.v;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]!;

export function createEngine(parts: EngineParts, avatar: HTMLElement): Engine {
  const { layer, character, flip, sprite, shadow, ignore, onDestroyed } = parts;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const legsA = [...sprite.querySelectorAll<SVGGElement>(".leg-a")];
  const legsB = [...sprite.querySelectorAll<SVGGElement>(".leg-b")];
  const tail = sprite.querySelector<SVGGElement>(".tail");
  // Elementos que tremem com o impacto; o menu de idioma é fixed e fica de fora.
  const stage = [...document.querySelectorAll<HTMLElement>("body > main, body > footer")];

  const body = { x: 0, y: 0, vx: 0, vy: 0, z: 0, vz: 0, facing: 1 as 1 | -1, phase: 0, airborne: true, pounding: false };
  const pose = { sx: spring(1), sy: spring(1), tilt: spring(0) };
  const held = new Set<Dir>();
  const hits = new WeakMap<Element, number>();
  const destroyed = new WeakSet<Element>();
  const timers = new Set<number>();
  let shakeAnims: Animation[] = [];
  let bonked = new Set<Element>();
  let rafId = 0;
  let destroyedCount = 0;
  let activeShards = 0;
  let edgeScroll = 0;
  let lastBeam = 0;
  let lastShell = 0;
  let crouching = false;
  let entering = true;

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  }

  // ------------------------------------------------------------ alvos

  function toTarget(el: Element): Element | null {
    // Quebra o ícone inteiro, não cada <path>.
    const target = el instanceof SVGElement ? (el.ownerSVGElement ?? el) : el;
    if (target === document.documentElement || target === document.body) return null;
    if (ignore.some((root) => root.contains(target))) return null;
    if (target.classList.contains("osha-crack") || destroyed.has(target)) return null;
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const share = (rect.width * rect.height) / (window.innerWidth * window.innerHeight);
    if (share > MAX_TARGET_AREA && !(target instanceof HTMLElement && hasSurface(target))) {
      return null;
    }
    return target;
  }

  function targetsAt(points: Point[]): Element[] {
    const found = new Set<Element>();
    for (const [px, py] of points) {
      if (px < 0 || py < 0 || px >= window.innerWidth || py >= window.innerHeight) continue;
      for (const el of document.elementsFromPoint(px, py)) {
        const target = toTarget(el);
        if (target) {
          found.add(target);
          break;
        }
      }
    }
    return [...found];
  }

  // Elipse achatada: o chão é visto de lado.
  function groundPoints(cx: number, cy: number, r: number): Point[] {
    const points: Point[] = [[cx, cy]];
    for (let ring = 1; ring <= 3; ring++) {
      const rr = (r * ring) / 3;
      const n = ring * 6;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        points.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.6]);
      }
    }
    return points;
  }

  // ------------------------------------------------------------ efeitos

  function spawn(className: string, x: number, y: number): HTMLDivElement {
    const el = document.createElement("div");
    el.className = `osha-fx ${className}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    layer.appendChild(el);
    return el;
  }

  function play(el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const anim = el.animate(keyframes, options);
    anim.onfinish = () => el.remove();
    return anim;
  }

  function shakeScreen(intensity: number) {
    if (reducedMotion || intensity <= 0) return;
    shakeAnims.forEach((anim) => anim.cancel());
    const frames: Keyframe[] = [];
    for (let i = 0; i <= 8; i++) {
      const m = intensity * (1 - i / 8);
      frames.push({ translate: `${rand(-m, m)}px ${rand(-m, m) * 0.6}px` });
    }
    // `translate` não briga com os `transform` dos elementos que estão caindo.
    shakeAnims = stage.map((el) => el.animate(frames, { duration: 200 + intensity * 30, easing: "ease-out" }));
  }

  function splash(x: number, y: number, size: number) {
    const puff = spawn("osha-splash", x, y);
    puff.style.width = puff.style.height = `${size}px`;
    const dx = -body.facing * rand(8, 20);
    play(
      puff,
      [
        { transform: "translate(-50%, -50%) scale(0.3)", opacity: 0.8 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% - ${rand(6, 14)}px)) scale(1.4)`, opacity: 0 },
      ],
      { duration: 500, easing: "ease-out" },
    );
  }

  function shockwave(x: number, y: number, radius: number) {
    const ring = spawn("osha-shockwave", x, y);
    ring.style.width = `${radius * 2}px`;
    ring.style.height = `${radius * 1.2}px`;
    play(
      ring,
      [
        { transform: "translate(-50%, -50%) scale(0.15)", opacity: 0.9 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
      ],
      { duration: 550, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
    );
    for (let i = 0; i < 6; i++) {
      const a = rand(Math.PI * 0.9, Math.PI * 2.1);
      splash(x + Math.cos(a) * radius * 0.5, y + Math.sin(a) * radius * 0.25, rand(22, 40));
    }
  }

  function debris(rect: DOMRect, color: string, ix: number, iy: number) {
    const count = Math.round(clamp(Math.sqrt(rect.width * rect.height) / 12, 6, 14));
    for (let i = 0; i < count; i++) {
      const bit = spawn("osha-debris", ix + rand(-10, 10), iy + rand(-10, 10));
      // Um em cada três pedaços é uma gota d'água.
      const drop = i % 3 === 0;
      bit.style.background = drop ? WATER : color;
      if (drop) bit.style.borderRadius = "50%";
      bit.style.width = bit.style.height = `${rand(3, 9)}px`;
      const dx = rand(-160, 160);
      const up = rand(-120, -30);
      const spin = rand(-360, 360);
      play(
        bit,
        [
          { transform: "translate(0, 0) rotate(0deg)", easing: "ease-out" },
          { transform: `translate(${dx}px, ${up}px) rotate(${spin}deg)`, offset: 0.25, easing: "ease-in" },
          { transform: `translate(${dx}px, ${up + rand(180, 320)}px) rotate(${spin}deg)`, opacity: 0 },
        ],
        { duration: rand(900, 1300) },
      );
    }
  }

  function popText(x: number, y: number) {
    const pop = spawn("osha-pop", x, y);
    pop.textContent = pick(POP_WORDS);
    const rot = `rotate(${rand(-25, 25)}deg)`;
    play(
      pop,
      [
        { transform: `translate(-50%, -50%) ${rot} scale(0)` },
        { transform: `translate(-50%, -50%) ${rot} scale(1.25)`, offset: 0.15 },
        { transform: `translate(-50%, -50%) ${rot} scale(1)`, offset: 0.25, opacity: 1 },
        { transform: `translate(-50%, -50%) ${rot} scale(1)`, offset: 0.5, opacity: 1, easing: "ease-in" },
        { transform: `translate(-50%, calc(-50% - 50px)) ${rot} scale(1)`, opacity: 0 },
      ],
      { duration: 1000 },
    );
  }

  // ------------------------------------------------------------ quebra

  function hitPoints(rect: DOMRect): number {
    const area = rect.width * rect.height;
    if (area < 4000) return 1;
    if (area < 40000) return 2;
    return 3;
  }

  // `composite: "add"` soma com o transform que o elemento já tem (Tailwind, hover etc.).
  function wobble(el: Element, ix: number, rect: DOMRect) {
    const away = ix < rect.left + rect.width / 2 ? 1 : -1;
    const rot = away * rand(3, 9);
    el.animate(
      [
        { transform: "translateX(0) rotate(0deg)" },
        { transform: `translateX(${away * 8}px) rotate(${rot}deg)` },
        { transform: `translateX(${-away * 4}px) rotate(${rot}deg)` },
        { transform: `translateX(0) rotate(${rot}deg)` },
      ],
      { duration: 300, composite: "add", fill: "forwards" },
    );
  }

  function addCracks(el: HTMLElement, rect: DOMRect, ix: number, iy: number, severity: number) {
    let svg = el.querySelector<SVGSVGElement>(":scope > svg.osha-crack");
    if (!svg) {
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("class", "osha-crack");
      svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      svg.setAttribute("preserveAspectRatio", "none");
      // A rachadura fica dentro do elemento, respeitando o arredondamento dele.
      svg.style.clipPath = `inset(0 round ${getComputedStyle(el).borderRadius})`;
      el.appendChild(svg);
    }
    const ox = clamp(ix - rect.left, rect.width * 0.1, rect.width * 0.9);
    const oy = clamp(iy - rect.top, rect.height * 0.1, rect.height * 0.9);
    // Limitado em px: num bloco grande a rachadura fica local em vez de atravessar a tela.
    const reach = Math.min(Math.max(rect.width, rect.height) * (0.3 + severity * 0.5), 90 + severity * 110);
    const rays = 4 + Math.floor(Math.random() * 3);
    for (const line of crackLines(ox, oy, reach, rays, 1.6 + severity)) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", line.d);
      path.setAttribute("pathLength", "1");
      path.style.strokeWidth = `${line.width}px`;
      svg.appendChild(path);
      path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 220,
        delay: line.delay,
        easing: "ease-out",
        fill: "both",
      });
    }
  }

  // Tem algo visível de si mesmo (fundo, borda ou texto próprio), não é só caixa de layout.
  function hasSurface(el: HTMLElement): boolean {
    const cs = getComputedStyle(el);
    if (cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0) return true;
    if (!/^rgba\(.*,\s*0\)$|^transparent$/.test(cs.backgroundColor)) return true;
    return [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
  }

  function crack(el: Element, rect: DOMRect, ix: number, iy: number, severity: number) {
    el.classList.add("osha-cracked");
    wobble(el, ix, rect);
    // Caixas de layout invisíveis não racham: as linhas ficariam soltas no ar.
    if (el instanceof HTMLElement && !NO_CRACK_TAGS.has(el.tagName) && hasSurface(el)) {
      addCracks(el, rect, ix, iy, severity);
    }
    debris(rect, getComputedStyle(el).color || "#888", ix, iy);
  }

  function snapshotStyle(el: Element, rect: DOMRect): string {
    const cs = getComputedStyle(el);
    let css = "";
    for (let i = 0; i < cs.length; i++) {
      const prop = cs.item(i);
      css += `${prop}:${cs.getPropertyValue(prop)};`;
    }
    return (
      css +
      "position:absolute;left:0;top:0;margin:0;transform:none;translate:none;rotate:none;scale:none;" +
      `width:${rect.width}px;height:${rect.height}px;box-sizing:border-box;visibility:visible;` +
      "animation:none;transition:none;pointer-events:none;"
    );
  }

  // Clarão no ponto de impacto durante a pausa antes de partir.
  function flash(x: number, y: number, size: number) {
    const glow = spawn("osha-flash", x, y);
    glow.style.width = glow.style.height = `${size}px`;
    play(
      glow,
      [
        { transform: "translate(-50%, -50%) scale(0.3)", opacity: 0.95 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
      ],
      { duration: 220, easing: "ease-out" },
    );
  }

  // As linhas por onde o elemento vai se partir acendem por um instante.
  function breakLines(rect: DOMRect, origin: Point, border: Point[], ring: Point[]): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "osha-fx osha-break");
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svg.style.left = `${rect.left}px`;
    svg.style.top = `${rect.top}px`;
    svg.style.width = `${rect.width}px`;
    svg.style.height = `${rect.height}px`;
    const p = (pt: Point) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
    let d = "";
    border.forEach((b, i) => (d += `M${p(origin)} L${p(ring[i]!)} L${p(b)} `));
    d += `M${ring.map(p).join(" L")} Z`;
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);
    layer.appendChild(svg);
    path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: HIT_STOP_MS, fill: "both" });
    return svg;
  }

  function launchShard(rect: DOMRect, source: Node, poly: Point[], origin: Point, inner: boolean, boost = 1) {
    const shard = spawn("osha-shard", rect.left, rect.top);
    shard.style.width = `${rect.width}px`;
    shard.style.height = `${rect.height}px`;
    const piece = document.createElement("div");
    piece.className = "osha-shard-piece";
    piece.style.clipPath = `polygon(${poly.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
    // Cada caco reflete a luz de um jeito, como facetas de vidro.
    piece.style.filter = `brightness(${inner ? rand(1.08, 1.3) : rand(0.78, 1)})`;
    piece.appendChild(source);
    shard.appendChild(piece);
    activeShards++;

    const cx = poly.reduce((sum, [x]) => sum + x, 0) / poly.length;
    const cy = poly.reduce((sum, [, y]) => sum + y, 0) / poly.length;
    const len = Math.hypot(cx - origin[0], cy - origin[1]) || 1;
    const dx = (cx - origin[0]) / len;
    const dy = (cy - origin[1]) / len;
    // Cacos perto do impacto saem mais rápido e mais longe; os de fora caem mais.
    const force = (inner ? rand(110, 190) : rand(40, 100)) * boost;
    const floor = Math.max(window.innerHeight - rect.top - cy - rand(5, 30), 20);
    const x1 = dx * force;
    const y1 = dy * force * 0.6 - (inner ? rand(50, 120) : rand(20, 60));
    const x2 = x1 + dx * rand(20, 60);
    const x3 = x2 + dx * rand(6, 18);
    const r1 = rand(-140, 140);
    const r2 = r1 + rand(-120, 120);
    const r3 = r2 + rand(-15, 15);
    // Gira em 3D no ar e pousa deitado: o giro termina num múltiplo de 180°.
    const fx1 = rand(-220, 220);
    const fy1 = rand(-220, 220);
    const fx2 = Math.round((fx1 + rand(-90, 90)) / 180) * 180;
    const fy2 = Math.round((fy1 + rand(-90, 90)) / 180) * 180;
    const bounce = rand(8, 22);
    const at = (x: number, y: number, r: number, fx: number, fy: number) =>
      `perspective(700px) translate(${x}px, ${y}px) rotate(${r}deg) rotateX(${fx}deg) rotateY(${fy}deg)`;
    shard.style.transformOrigin = `${cx}px ${cy}px`;
    // Voa, cai até o "chão" (fundo da tela), quica, desliza, descansa e some.
    const anim = shard.animate(
      [
        { transform: at(0, 0, 0, 0, 0), easing: "ease-out" },
        { transform: at(x1, y1, r1, fx1, fy1), offset: 0.09, easing: "ease-in" },
        { transform: at(x2, floor, r2, fx2, fy2), offset: 0.31, easing: "ease-out" },
        { transform: at(x2, floor - bounce, r2, fx2, fy2), offset: 0.36, easing: "ease-in" },
        { transform: at(x2, floor, r2, fx2, fy2), offset: 0.4, easing: "ease-out" },
        { transform: at(x3, floor, r3, fx2, fy2), offset: 0.48, opacity: 1 },
        { transform: at(x3, floor, r3, fx2, fy2), offset: 0.8, opacity: 1 },
        { transform: at(x3, floor, r3, fx2, fy2), opacity: 0 },
      ],
      { duration: rand(3000, 3500), delay: inner ? 0 : rand(20, 60), fill: "backwards" },
    );
    anim.onfinish = () => {
      shard.remove();
      activeShards--;
    };
  }

  // Leque do ponto de impacto até a borda, cortado por um anel: cada fatia vira um caco interno e
  // um externo. Antes de partir há uma pausa curta com as linhas de quebra acesas.
  function shatter(el: Element, rect: DOMRect, ix: number, iy: number) {
    const w = rect.width;
    const h = rect.height;
    const origin: Point = [clamp(ix - rect.left, w * 0.15, w * 0.85), clamp(iy - rect.top, h * 0.15, h * 0.85)];
    const border: Point[] = [[0, 0], [w, 0], [w, h], [0, h]];
    const extra = Math.round(clamp(Math.sqrt(w * h) / 45, 2, activeShards > MAX_ACTIVE_SHARDS / 2 ? 2 : 6));
    for (let i = 0; i < extra; i++) {
      const t = Math.random();
      const edge = Math.floor(Math.random() * 4);
      border.push(edge === 0 ? [t * w, 0] : edge === 1 ? [w, t * h] : edge === 2 ? [t * w, h] : [0, t * h]);
    }
    border.sort((a, b) => Math.atan2(a[1] - origin[1], a[0] - origin[0]) - Math.atan2(b[1] - origin[1], b[0] - origin[0]));
    const ring = border.map(([bx, by]): Point => {
      const k = rand(0.3, 0.5);
      return [origin[0] + (bx - origin[0]) * k, origin[1] + (by - origin[1]) * k];
    });

    // Clona antes da pausa, enquanto o elemento ainda está visível e no lugar.
    const source = el.cloneNode(true) as Element;
    source.setAttribute("style", snapshotStyle(el, rect));
    source.removeAttribute("id");

    const lines = breakLines(rect, origin, border, ring);
    flash(rect.left + origin[0], rect.top + origin[1], Math.min(Math.max(w, h), 240));
    later(() => {
      lines.remove();
      (el as HTMLElement).style.visibility = "hidden";
      border.forEach((a, i) => {
        const j = (i + 1) % border.length;
        const b = border[j]!;
        launchShard(rect, source.cloneNode(true), [origin, ring[i]!, ring[j]!], origin, true);
        launchShard(rect, source.cloneNode(true), [ring[i]!, a, b, ring[j]!], origin, false);
      });
    }, HIT_STOP_MS);
  }

  // Mídia não clona bem: só tomba e quica no fundo da tela.
  function topple(el: Element, rect: DOMRect) {
    const fall = Math.max(window.innerHeight - rect.bottom - rand(0, 30), 0);
    const dx = rand(-60, 60);
    const rot = rand(-80, 80);
    el.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", easing: "ease-in" },
        { transform: `translate(${dx}px, ${fall}px) rotate(${rot}deg)`, offset: 0.6, easing: "ease-out" },
        { transform: `translate(${dx}px, ${fall - 24}px) rotate(${rot}deg)`, offset: 0.78, easing: "ease-in" },
        { transform: `translate(${dx}px, ${fall}px) rotate(${rot}deg)` },
      ],
      { duration: rand(1000, 1500), composite: "add", fill: "forwards" },
    );
  }

  function damage(el: Element, power: number, ix: number, iy: number): boolean {
    // Transform não se aplica a caixas inline.
    if (el instanceof HTMLElement && getComputedStyle(el).display === "inline") el.style.display = "inline-block";
    if (el instanceof HTMLElement || el instanceof SVGElement) el.style.transition = "none";
    const rect = el.getBoundingClientRect();
    const hp = hitPoints(rect);
    const dealt = (hits.get(el) ?? 0) + power;
    hits.set(el, dealt);
    if (dealt < hp) {
      crack(el, rect, ix, iy, dealt / hp);
      return false;
    }
    destroyed.add(el);
    destroyedCount += 1;
    onDestroyed(destroyedCount);
    debris(rect, getComputedStyle(el).color || "#888", ix, iy);
    const unclonable = /^(IFRAME|VIDEO|CANVAS)$/.test(el.tagName) || el.querySelector("iframe, video, canvas");
    if (unclonable || activeShards > MAX_ACTIVE_SHARDS) {
      topple(el, rect);
    } else {
      shatter(el, rect, ix, iy);
    }
    el.classList.add("osha-fallen");
    return true;
  }

  function smash(targets: Element[], power: number, ix: number, iy: number): number {
    let count = 0;
    for (const el of targets) if (damage(el, power, ix, iy)) count++;
    return count;
  }

  function bounceNearby(cx: number, cy: number, r: number, height: number) {
    for (const el of targetsAt(groundPoints(cx, cy, r))) {
      if (el.getAnimations().length > 0) continue;
      el.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-height}px)` }, { transform: "translateY(0)" }], {
        duration: 200,
        easing: "ease-out",
        composite: "add",
      });
    }
  }

  // ------------------------------------------------------------ ações

  // Subindo, a cabeça bate no que estiver em cima, como um bloco do Mario.
  function headbutt() {
    const headY = body.y - body.z - SPRITE_H * 0.85;
    const targets = targetsAt([
      [body.x - 18, headY + 10],
      [body.x, headY],
      [body.x + 18, headY + 10],
    ]).filter((el) => !bonked.has(el));
    if (targets.length === 0) return;
    targets.forEach((el) => bonked.add(el));
    const destroyedNow = smash(targets, 1, body.x, headY);
    body.vz = Math.min(body.vz, 1);
    pose.sx.x = 1.2;
    pose.sy.x = 0.8;
    splash(body.x, headY, 30);
    shakeScreen(STATS.shake * 0.5);
    if (destroyedNow > 0) popText(body.x, headY - 30);
  }

  function jump() {
    if (entering) return;
    if (body.airborne) {
      // Segundo toque no ar: ground pound.
      if (body.pounding) return;
      body.pounding = true;
      body.vz = Math.min(body.vz, -STATS.jump * 0.8);
      pose.sx.x = 0.8;
      pose.sy.x = 1.25;
      return;
    }
    if (crouching) return;
    crouching = true;
    pose.sx.target = 1.25;
    pose.sy.target = 0.72;
    later(() => {
      crouching = false;
      pose.sx.target = 1;
      pose.sy.target = 1;
      pose.sx.x = 0.8;
      pose.sy.x = 1.25;
      body.airborne = true;
      body.vz = STATS.jump;
      bonked = new Set();
      splash(body.x, body.y, 36);
    }, 90);
  }

  function land(impactSpeed: number) {
    const pounded = body.pounding;
    body.airborne = false;
    body.pounding = false;
    body.z = 0;
    body.vz = 0;
    const strength = clamp(impactSpeed / STATS.jump, 0.6, 2.4) * (pounded ? 1.3 : 1);
    pose.sx.x = 1 + 0.25 * strength;
    pose.sy.x = 1 - 0.2 * strength;
    const radius = STATS.radius * (0.6 + strength * 0.45);
    const destroyedNow = smash(targetsAt(groundPoints(body.x, body.y - 10, radius)), pounded ? 2 : 1, body.x, body.y);
    bounceNearby(body.x, body.y, radius * 1.8, 6 + strength * 4);
    shockwave(body.x, body.y, radius * 1.4);
    shakeScreen(STATS.shake * strength);
    if (destroyedNow > 0 || pounded) popText(body.x, body.y - 120);
    entering = false;
  }

  function mouthPosition(): Point {
    const scale = SIZE / VIEWBOX_W;
    return [
      body.x + body.facing * (MOUTH[0] - VIEWBOX_W / 2) * scale,
      body.y - body.z - (VIEWBOX_H - MOUTH[1]) * scale,
    ];
  }

  function waterGun() {
    const now = performance.now();
    if (entering || now - lastBeam < BEAM_COOLDOWN_MS) return;
    lastBeam = now;
    sprite.classList.add("is-roaring");
    pose.tilt.target = -9;
    later(fireBeam, 150);
  }

  function fireBeam() {
    const dir = body.facing;
    const [startX, beamY] = mouthPosition();
    const maxWidth = Math.abs(clamp(startX + dir * BEAM_RANGE, 0, window.innerWidth) - startX);
    // Avança a partir da boca; o jato atravessa alguns elementos e para no último.
    const hitsAlong: Array<[Element, number]> = [];
    let width = maxWidth;
    for (let d = 0; d <= maxWidth; d += 16) {
      const px = startX + dir * d;
      for (const el of targetsAt([[px, beamY - 10], [px, beamY + 10]])) {
        if (!hitsAlong.some(([hit]) => hit === el)) hitsAlong.push([el, px]);
      }
      if (hitsAlong.length >= BEAM_PIERCE) {
        width = d + 24;
        break;
      }
    }
    let destroyedNow = 0;
    for (const [el, px] of hitsAlong) if (damage(el, 99, px, beamY)) destroyedNow++;
    const endX = startX + dir * width;
    const beam = spawn("osha-beam", Math.min(startX, endX), beamY);
    beam.style.width = `${width}px`;
    beam.style.transformOrigin = dir === 1 ? "left center" : "right center";
    beam.style.maskImage = `linear-gradient(to ${dir === 1 ? "right" : "left"}, #000 75%, transparent)`;
    play(
      beam,
      [
        { transform: "scale(0, 0.4)", easing: "ease-out" },
        { transform: "scale(1, 1.2)", offset: 0.23 },
        { transform: "scale(1, 1.2)", offset: 0.5, opacity: 1 },
        { transform: "scale(1, 0)", opacity: 0 },
      ],
      { duration: 520 },
    );
    for (let i = 0; i < 4; i++) splash(endX + rand(-12, 12), beamY + rand(-10, 10), rand(18, 32));
    pose.tilt.target = 0;
    pose.tilt.x = 5;
    later(() => sprite.classList.remove("is-roaring"), 420);
    shakeScreen(STATS.shake * 0.6);
    if (destroyedNow > 0) popText(endX, beamY - 40);
  }

  // Golpe com a concha num arco à frente.
  function razorShell() {
    const now = performance.now();
    if (entering || now - lastShell < SHELL_COOLDOWN_MS) return;
    lastShell = now;
    const cx = body.x + body.facing * 30;
    const cy = body.y - body.z - SPRITE_H * 0.45;
    const points: Point[] = [];
    for (const r of [20, 45, SHELL_REACH]) {
      for (let a = -70; a <= 70; a += 35) {
        const rad = (a * Math.PI) / 180;
        points.push([cx + body.facing * Math.cos(rad) * r, cy + Math.sin(rad) * r]);
      }
    }
    const destroyedNow = smash(targetsAt(points), 2, cx + body.facing * SHELL_REACH * 0.6, cy);
    sprite.classList.add("is-slashing");
    later(() => sprite.classList.remove("is-slashing"), 260);
    pose.tilt.x = 10;
    const arc = spawn("osha-shell-arc", cx, cy);
    arc.style.width = arc.style.height = `${SHELL_REACH * 2}px`;
    const flipX = `scaleX(${body.facing})`;
    play(
      arc,
      [
        { transform: `translate(-50%, -50%) ${flipX} rotate(-70deg)`, opacity: 1 },
        { transform: `translate(-50%, -50%) ${flipX} rotate(70deg)`, opacity: 0 },
      ],
      { duration: 260, easing: "ease-out" },
    );
    shakeScreen(STATS.shake * 0.4);
    if (destroyedNow > 0) popText(cx + body.facing * SHELL_REACH, cy - 30);
  }

  function footstep() {
    splash(body.x - body.facing * 14, body.y, 18);
  }

  // ------------------------------------------------------------ foto

  // A foto se encolhe com um brilho e se desfaz: os pixels que sobraram se espalham e somem.
  // Ela não volta; só recarregando a página.
  function breakPhoto() {
    const img = avatar.querySelector("img");
    const rect = (img ?? avatar).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (!reducedMotion) {
      avatar.animate(
        [
          { scale: "1", filter: "brightness(1)" },
          { scale: "0.92", filter: "brightness(1.6)" },
        ],
        { duration: CRUNCH_MS, easing: "ease-in", fill: "forwards" },
      );
    }
    later(() => {
      flash(cx, cy, rect.width * 1.6);
      if (!reducedMotion) {
        for (const pixel of avatar.querySelectorAll<HTMLElement>(".hero-avatar-pixel:not(.is-gone)")) {
          scatterPixel(pixel, cx, cy, rect.width / 2);
        }
        for (let i = 0; i < 24; i++) sparkle(cx, cy, rect.width / 2);
      }
      avatar.getAnimations().forEach((anim) => anim.cancel());
      avatar.style.visibility = "hidden";
      shakeScreen(STATS.shake * 1.4);
      launch(rect);
    }, reducedMotion ? 0 : CRUNCH_MS);
  }

  // Cópia do pixel na camada visual, voando para longe do centro e caindo.
  function scatterPixel(pixel: HTMLElement, cx: number, cy: number, radius: number) {
    const r = pixel.getBoundingClientRect();
    const bit = pixel.cloneNode(true) as HTMLElement;
    bit.className = "osha-fx osha-pixel";
    bit.style.left = `${r.left}px`;
    bit.style.top = `${r.top}px`;
    bit.style.width = `${r.width}px`;
    bit.style.height = `${r.height}px`;
    layer.appendChild(bit);
    const px = r.left + r.width / 2 - cx;
    const py = r.top + r.height / 2 - cy;
    const dist = Math.hypot(px, py) || 1;
    const speed = rand(60, 200);
    const dx = (px / dist) * speed + rand(-25, 25);
    const dy = (py / dist) * speed * 0.6 - rand(40, 120);
    const spin = rand(-180, 180);
    play(
      bit,
      [
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
        { transform: `translate(${dx}px, ${dy}px) rotate(${spin * 0.4}deg) scale(0.9)`, offset: 0.35, opacity: 1, easing: "ease-in" },
        { transform: `translate(${dx * 1.3}px, ${dy + rand(140, 260)}px) rotate(${spin}deg) scale(0.2)`, opacity: 0 },
      ],
      // Do centro para fora: a foto se desfaz em onda.
      { duration: rand(800, 1200), delay: (dist / radius) * 90, fill: "backwards" },
    );
  }

  function sparkle(cx: number, cy: number, radius: number) {
    const a = rand(0, Math.PI * 2);
    const r = rand(0.2, 1) * radius;
    const dot = spawn("osha-sparkle", cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    const size = rand(3, 7);
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.background = pick(["#f2a253", "#f7b674", WATER, "#cff3ff"]);
    const d = rand(30, 90);
    play(
      dot,
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - rand(10, 40)}px)) scale(0)`, opacity: 0 },
      ],
      { duration: rand(500, 900), easing: "ease-out" },
    );
  }

  // Sai do buraco da foto num arco em direção ao meio da tela e aterrissa num ground pound.
  function launch(rect: DOMRect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    body.facing = cx > window.innerWidth / 2 ? -1 : 1;
    body.x = cx;
    body.y = clamp(rect.bottom + 40, MIN_FEET_Y, window.innerHeight - 20);
    body.z = Math.max(body.y - (cy + SPRITE_H * 0.4), 0);
    body.vz = STATS.jump * 0.8;
    body.vx = body.facing * 3;
    body.airborne = true;
    body.pounding = true;
    pose.sx.x = 0.8;
    pose.sy.x = 1.25;
    character.style.opacity = "";
    shadow.style.opacity = "";
    const spread = rect.width * 0.35;
    for (let i = 0; i < 6; i++) splash(cx + rand(-spread, spread), cy + rand(-20, 20), rand(24, 44));
    rafId = requestAnimationFrame(tick);
  }

  // ------------------------------------------------------------ loop

  function render(now: number) {
    const speed = Math.hypot(body.vx, body.vy);
    const walk = body.airborne ? 0 : clamp(speed / STATS.speed, 0, 1);
    const bob = -Math.abs(Math.sin(body.phase)) * 8 * walk;
    const idle = body.airborne || walk > 0.1 ? 0 : Math.sin(now / 350) * 0.03;
    // Inclina no arco do pulo: para frente subindo, para trás descendo.
    const airTilt = body.airborne && !body.pounding ? clamp(-body.vz * 0.8, -12, 12) : 0;
    const tilt = Math.sin(body.phase) * 8 * walk + pose.tilt.x + airTilt;
    character.style.transform = `translate3d(${body.x}px, ${body.y - body.z + bob}px, 0)`;
    flip.style.transform = `scaleX(${body.facing})`;
    sprite.style.transform = `rotate(${tilt}deg) scale(${pose.sx.x * (1 - idle)}, ${pose.sy.x * (1 + idle)})`;
    // Pernas balançam em pares opostos andando e se recolhem no ar.
    const swing = body.airborne ? 18 : Math.sin(body.phase) * 28 * walk;
    legsA.forEach((leg) => (leg.style.transform = `rotate(${body.airborne ? -swing : swing}deg)`));
    legsB.forEach((leg) => (leg.style.transform = `rotate(${-swing}deg)`));
    if (tail) tail.style.transform = `rotate(${Math.sin(body.phase * 0.5) * 10 * walk + Math.sin(now / 500) * 4}deg)`;
    const shadowScale = clamp(1 - body.z / 500, 0.3, 1) * (1 + Math.abs(bob) / 60);
    shadow.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) translate(-50%, -50%) scale(${shadowScale})`;
    shadow.style.opacity = String(clamp(0.45 - body.z / 1200, 0.12, 0.45));
  }

  function tick(now: number) {
    let ix = 0;
    let iy = 0;
    if (!entering) {
      if (held.has("left")) ix -= 1;
      if (held.has("right")) ix += 1;
      if (held.has("up")) iy -= 1;
      if (held.has("down")) iy += 1;
    }
    const norm = ix && iy ? Math.SQRT1_2 : 1;
    const control = body.airborne ? 0.4 : 1;
    body.vx += (ix * norm * STATS.speed - body.vx) * STATS.accel * control;
    body.vy += (iy * norm * STATS.speed - body.vy) * STATS.accel * control;
    if (ix !== 0) body.facing = ix > 0 ? 1 : -1;
    body.x = clamp(body.x + body.vx, 40, window.innerWidth - 40);
    body.y = clamp(body.y + body.vy, MIN_FEET_Y, window.innerHeight - 20);

    if (body.airborne) {
      body.vz -= STATS.gravity * (body.pounding && body.vz < 0 ? 2.2 : 1);
      body.z += body.vz;
      if (body.vz > 0 && !entering) headbutt();
      if (body.z <= 0) land(-body.vz);
    } else {
      const speed = Math.hypot(body.vx, body.vy);
      if (speed > 0.6) {
        const before = Math.floor(body.phase / Math.PI);
        body.phase += speed * STATS.stepRate;
        if (Math.floor(body.phase / Math.PI) !== before) footstep();
      } else {
        body.phase = Math.round(body.phase / Math.PI) * Math.PI;
      }
    }

    // Empurrar a borda de cima/baixo rola a página, cada vez mais rápido.
    const pushingEdge =
      (iy < 0 && body.y < EDGE_SCROLL_ZONE + 60) || (iy > 0 && body.y > window.innerHeight - EDGE_SCROLL_ZONE);
    edgeScroll = pushingEdge ? Math.min(Math.max(edgeScroll, STATS.speed * 1.5) + 0.5, EDGE_SCROLL_MAX) : 0;
    if (edgeScroll) window.scrollBy({ top: iy * edgeScroll, behavior: "instant" });

    stepSpring(pose.sx);
    stepSpring(pose.sy);
    stepSpring(pose.tilt);
    render(now);
    rafId = requestAnimationFrame(tick);
  }

  // Cacos e elementos tombando passam das bordas; `clip` não cria contêiner de rolagem.
  stage.forEach((el) => (el.style.overflow = "clip"));
  character.style.opacity = "0";
  shadow.style.opacity = "0";
  breakPhoto();

  return {
    press: (dir) => held.add(dir),
    release: (dir) => held.delete(dir),
    releaseAll: () => held.clear(),
    jump,
    waterGun,
    razorShell,
    destroy() {
      cancelAnimationFrame(rafId);
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
      shakeAnims.forEach((anim) => anim.cancel());
      stage.forEach((el) => (el.style.overflow = ""));
      layer.querySelectorAll(".osha-fx").forEach((el) => el.remove());
      avatar.style.visibility = "";
    },
  };
}
