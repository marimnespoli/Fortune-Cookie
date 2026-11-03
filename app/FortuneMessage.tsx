"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Center line of the ribbon, in the banner SVG's coordinates (viewBox 0 0 1728 694).
// The text is drawn along this curve so it bends with the paper.
const RIBBON_CENTER = { x0: 520, y0: 306, c1x: 700, c1y: 335, c2x: 1000, c2y: 230, x1: 1265, y1: 268 };
const USABLE_LENGTH = 620; // path length available for text, leaving some margin
const CHAR_WIDTH = 0.6; // Courier Prime glyphs are 0.6em wide
const MAX_FONT = 36;
const MIN_SINGLE_LINE_FONT = 30;

// Animation timing, in seconds.
const RIBBON_IN = 0.7; // ribbon appears before the writing starts
const CHAR_STEP = 0.055; // delay between letters
const INK_DURATION = 0.7;

function curve(offsetY: number) {
  const c = RIBBON_CENTER;
  return `M ${c.x0} ${c.y0 + offsetY} C ${c.c1x} ${c.c1y + offsetY}, ${c.c2x} ${c.c2y + offsetY}, ${c.x1} ${c.y1 + offsetY}`;
}

// Split the message at the word break closest to the middle.
function splitInTwo(text: string): string[] {
  const words = text.split(" ");
  let best = [text];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = [a, b];
    }
  }
  return best;
}

function layout(message: string) {
  const fit = (chars: number) => Math.min(MAX_FONT, USABLE_LENGTH / (chars * CHAR_WIDTH));
  const lines = fit(message.length) >= MIN_SINGLE_LINE_FONT ? [message] : splitInTwo(message);
  const fontSize = fit(Math.max(...lines.map((l) => l.length)));
  const gap = fontSize * 1.2;
  // Safari ignores dominant-baseline on textPath, so we lower the baseline by hand.
  const baselineShift = fontSize * 0.35;
  const offsets = (lines.length === 1 ? [0] : [-gap / 2, gap / 2]).map((dy) => dy + baselineShift);
  return { lines, fontSize, offsets };
}

// Small deterministic random generator so the star field is stable between renders.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function Sparkles() {
  const { stars, dust } = useMemo(() => {
    const rand = seeded(7);
    const stars = Array.from({ length: 22 }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: 8 + rand() * 18,
      delay: rand() * 5,
      duration: 2.8 + rand() * 3,
    }));
    const dust = Array.from({ length: 26 }, () => ({
      left: rand() * 100,
      top: 20 + rand() * 80,
      size: 2 + rand() * 3,
      delay: rand() * 10,
      duration: 8 + rand() * 8,
    }));
    return { stars, dust };
  }, []);

  return (
    <div className="sparkle-field" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="sparkle-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff4c2" />
            <stop offset="50%" stopColor="#e2b04a" />
            <stop offset="100%" stopColor="#a8761f" />
          </linearGradient>
        </defs>
      </svg>
      {stars.map((s, i) => (
        <svg
          key={`s${i}`}
          className="sparkle-star"
          viewBox="-10 -10 20 20"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
        >
          <path d="M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10 Z" fill="url(#sparkle-gold)" />
        </svg>
      ))}
      {dust.map((d, i) => (
        <span
          key={`d${i}`}
          className="gold-dust"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }}
        />
      ))}
    </div>
  );
}

// The fortune, written letter by letter along the ribbon with a golden spark leading the way.
function WrittenFortune({ message, onDone }: { message: string; onDone: () => void }) {
  const { lines, fontSize, offsets } = layout(message);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const sparkRef = useRef<SVGGElement | null>(null);
  const totalChars = lines.reduce((n, l) => n + l.length, 0);
  const writeTime = RIBBON_IN + totalChars * CHAR_STEP;

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doneTimer = window.setTimeout(onDone, reduceMotion ? 0 : (writeTime + INK_DURATION) * 1000);
    if (reduceMotion) return () => window.clearTimeout(doneTimer);

    // Where each letter's center sits on its line.
    const charWidth = fontSize * CHAR_WIDTH;
    const positions: DOMPoint[] = [];
    lines.forEach((line, j) => {
      const path = pathRefs.current[j];
      if (!path) return;
      const start = path.getTotalLength() / 2 - (line.length * charWidth) / 2;
      for (let i = 0; i < line.length; i++) {
        positions.push(path.getPointAtLength(start + (i + 0.5) * charWidth));
      }
    });

    let frame = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const spark = sparkRef.current;
      const k = ((now - began) / 1000 - RIBBON_IN) / CHAR_STEP;
      if (spark && positions.length) {
        if (k < 0 || k >= positions.length + 4) {
          spark.style.opacity = "0";
        } else {
          const p = positions[Math.min(Math.floor(k), positions.length - 1)];
          const fade = k > positions.length ? 1 - (k - positions.length) / 4 : 1;
          spark.setAttribute("transform", `translate(${p.x} ${p.y - fontSize * 0.3}) rotate(${(now / 6) % 360})`);
          spark.style.opacity = String(fade);
        }
      }
      if (k < positions.length + 4) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(doneTimer);
    };
    // The component is keyed by message, so these values never change while mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global letter index where each line starts, so delays continue across lines.
  const lineStarts = lines.map((_, j) => lines.slice(0, j).reduce((n, l) => n + l.length, 0));

  const textPaths = (layer: "ink" | "glow") =>
    lines.map((line, j) => (
      <textPath key={j} href={`#fortune-line-${j}`} startOffset="50%">
        {Array.from(line).map((ch, i) => (
          <tspan
            key={i}
            className={layer === "ink" ? "ink-char" : "glow-char"}
            style={{ animationDelay: `${RIBBON_IN + (lineStarts[j] + i) * CHAR_STEP}s` }}
          >
            {ch === " " ? " " : ch}
          </tspan>
        ))}
      </textPath>
    ));

  const textProps = {
    fontSize,
    textAnchor: "middle" as const,
    style: { fontFamily: "var(--font-courier-prime), 'Courier New', Courier, monospace" },
  };

  return (
    <>
      <defs>
        {offsets.map((dy, i) => (
          <path key={i} id={`fortune-line-${i}`} d={curve(dy)} ref={(el) => { pathRefs.current[i] = el; }} />
        ))}
        <filter id="fortune-glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <text {...textProps} fill="#f2c14e" filter="url(#fortune-glow)" aria-hidden="true">
        {textPaths("glow")}
      </text>
      <text {...textProps} fill="#3b2e22">
        {textPaths("ink")}
      </text>
      <g ref={sparkRef} className="quill-spark" style={{ opacity: 0 }} aria-hidden="true">
        <circle r={fontSize * 0.55} fill="#ffe08a" opacity="0.35" filter="url(#fortune-glow)" />
        <path d="M0 -14 C1.4 -3 3 -1.4 14 0 C3 1.4 1.4 3 0 14 C-1.4 3 -3 1.4 -14 0 C-3 -1.4 -1.4 -3 0 -14 Z" fill="#fff3c4" stroke="#e0a93a" strokeWidth="1.2" />
      </g>
    </>
  );
}

function FortuneMessage({ message, onReset }: { message: string; onReset: () => void }) {
  const [done, setDone] = useState(false);

  return (
    <div className="fortune-stage">
      <img src="/assets/stars page 2.png" alt="" className="fortune-stars" />
      <Sparkles />
      {/* The banner art only fills the middle of the SVG, so on small screens the
          image is wider than the viewport and its empty margins are cropped. */}
      <div className="ribbon-wrap">
        <div className="ribbon-in">
          <img src="/assets/faixa da frase.svg" alt="" style={{ width: "100%", display: "block" }} />
          <svg
            viewBox="0 0 1728 694"
            role="img"
            aria-label={message || "Opening your fortune"}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          >
            {message ? (
              <WrittenFortune key={message} message={message} onDone={() => setDone(true)} />
            ) : (
              <g className="waiting-dots" aria-hidden="true">
                {[-36, 0, 36].map((dx, i) => (
                  <circle key={i} cx={892 + dx} cy={290 - dx * 0.05} r="7" fill="#d9a63a" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </g>
            )}
          </svg>
        </div>
        <img
          src="/assets/buttom.svg"
          alt="Click to try again"
          width={140}
          onClick={onReset}
          className={done ? "again-button visible" : "again-button"}
        />
      </div>
    </div>
  );
}

export default FortuneMessage;
