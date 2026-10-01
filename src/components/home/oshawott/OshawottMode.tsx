"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { EasterEggLabels } from "@/domain/site";
import { createEngine, type Dir, type Engine } from "./engine";
import { OshawottSprite } from "./OshawottSprite";

type OshawottModeProps = {
  /** Wrapper da foto no Hero: ela se desfaz em pixels e o Oshawott sai do lugar. */
  avatar: HTMLElement;
  labels: EasterEggLabels;
};

const MOVE_KEYS: Record<string, Dir> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
};

const PAD: ReadonlyArray<Dir | null> = [null, "up", null, "left", null, "right", null, "down", null];
const PAD_ARROWS: Record<Dir, string> = { up: "▲", down: "▼", left: "◀", right: "▶" };

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

export default function OshawottMode({ avatar, labels }: OshawottModeProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [destroyed, setDestroyed] = useState(0);
  const [isTouch] = useState(() => window.matchMedia("(pointer: coarse)").matches);

  useEffect(() => {
    const engine = createEngine(
      {
        layer: layerRef.current!,
        character: characterRef.current!,
        flip: flipRef.current!,
        sprite: spriteRef.current!,
        shadow: shadowRef.current!,
        ignore: [layerRef.current!, uiRef.current!],
        onDestroyed: setDestroyed,
      },
      avatar,
    );
    engineRef.current = engine;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const dir = MOVE_KEYS[key];
      if (dir) {
        event.preventDefault();
        engine.press(dir);
      } else if (key === " ") {
        // Espaço com foco num botão dispararia o clique dele também.
        event.preventDefault();
        if (!event.repeat) engine.jump();
      } else if (key === "f") {
        event.preventDefault();
        engine.waterGun();
      } else if (key === "e") {
        event.preventDefault();
        engine.razorShell();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const dir = MOVE_KEYS[event.key.toLowerCase()];
      if (dir) engine.release(dir);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", engine.releaseAll);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", engine.releaseAll);
      engine.destroy();
      engineRef.current = null;
    };
  }, [avatar]);

  const taunt =
    destroyed >= 60
      ? labels.taunts.t60
      : destroyed >= 30
        ? labels.taunts.t30
        : destroyed >= 15
          ? labels.taunts.t15
          : destroyed >= 5
            ? labels.taunts.t5
            : "";

  const hold = (dir: Dir) => ({
    onPointerDown: (event: PointerEvent) => {
      event.preventDefault();
      engineRef.current?.press(dir);
    },
    onPointerUp: () => engineRef.current?.release(dir),
    onPointerLeave: () => engineRef.current?.release(dir),
    onPointerCancel: () => engineRef.current?.release(dir),
  });

  return createPortal(
    <>
      <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] select-none overflow-hidden">
        <div ref={shadowRef} className="osha-shadow" />
        <div ref={characterRef} className="osha-character">
          <div className="osha-anchor">
            <div ref={flipRef}>
              <div ref={spriteRef} className="osha-sprite">
                <OshawottSprite />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={uiRef} className="pointer-events-none fixed inset-0 z-[91] select-none">
        <div
          role="status"
          className="pointer-events-auto absolute left-1/2 top-5 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl border border-line bg-surface/95 px-4 py-3 text-center text-sm shadow-[var(--shadow)] backdrop-blur max-sm:top-20 sm:top-6"
        >
          <p className="font-medium text-ink">
            <span className="text-accent">{labels.destroyed.replace("{n}", String(destroyed))}</span>
            {taunt ? <span className="text-muted">, {taunt}</span> : null}
          </p>
          {isTouch ? null : <p className="mt-1 max-w-md text-xs text-muted">{labels.controls}</p>}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md text-xs font-medium text-accent underline-offset-4 hover:text-accent-hover hover:underline"
          >
            {labels.restore}
          </button>
        </div>

        {isTouch ? (
          <>
            <div role="group" aria-label={labels.move} className="pointer-events-auto absolute bottom-6 left-4 grid touch-none grid-cols-3 gap-1">
              {PAD.map((dir, i) =>
                dir ? (
                  <button key={i} type="button" aria-label={labels[dir]} className="osha-pad" {...hold(dir)}>
                    {PAD_ARROWS[dir]}
                  </button>
                ) : (
                  <span key={i} />
                ),
              )}
            </div>
            <div className="pointer-events-auto absolute bottom-6 right-4 flex touch-none flex-col gap-2">
              <button type="button" className="osha-pad osha-pad-action" onPointerDown={() => engineRef.current?.razorShell()}>
                {labels.razorShell}
              </button>
              <button type="button" className="osha-pad osha-pad-action" onPointerDown={() => engineRef.current?.waterGun()}>
                {labels.waterGun}
              </button>
              <button type="button" className="osha-pad osha-pad-action" onPointerDown={() => engineRef.current?.jump()}>
                {labels.jump}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </>,
    document.body,
  );
}
