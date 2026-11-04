"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import SkyBackground from "./SkyBackground";
import CrackingCookie from "./CrackingCookie";

// Timeline (seconds after the page opens): the cookie shakes and cracks, pauses,
// its halves drift apart and fade, then the slip unrolls and the fortune is written.
const WRITE_AT = 4.4;
const WRITE_DURATION = 2.4;

const CHAR_WIDTH = 0.6; // Courier Prime glyphs are 0.6em wide
const LINE_SPACE = 280; // usable width on the slip, in slip units

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

function luckyNumbers() {
  const picks = new Set<number>();
  while (picks.size < 4) picks.add(1 + Math.floor(Math.random() * 49));
  return [...picks].sort((a, b) => a - b);
}

// A gently wavy curve across the slip at height y.
const wave = (y: number) => `M 20 ${y} C 92 ${y - 8}, 190 ${y + 8}, 300 ${y - 4}`;

function Slip({ message, numbers, writeDelay }: { message: string; numbers: number[]; writeDelay: number | null }) {
  const lines = message.length <= 38 ? [message] : splitInTwo(message);
  const longest = Math.max(1, ...lines.map((l) => l.length));
  const fontSize = Math.min(lines.length === 1 ? 12.5 : 12, LINE_SPACE / (longest * CHAR_WIDTH));
  const height = lines.length === 1 ? 76 : 94;
  const lineYs = lines.length === 1 ? [33] : [31, 48];
  const numbersY = height - 23;
  const outline = `M4 12 C 80 2, 180 20, 316 8 L 316 ${height - 14} C 180 ${height - 2}, 80 ${height - 20}, 4 ${height - 10} Z`;
  const numbersText = `LUCKY NUMBERS  ${numbers.join(" · ")}`;
  const timing = writeDelay === null ? undefined : { animationDelay: `${writeDelay}s` };

  return (
    <div className="fortune-slip">
      <svg
        className="fortune-slip-paper"
        viewBox={`0 0 320 ${height}`}
        role="img"
        aria-label={message ? `${message} Lucky numbers ${numbers.join(", ")}.` : "Your fortune is on its way"}
      >
        <defs>
          <linearGradient id="slip-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#fdf8ec" />
            <stop offset="100%" stopColor="#efe4cc" />
          </linearGradient>
          {lineYs.map((y, i) => (
            <path key={i} id={`slip-line-${i}`} d={wave(y)} />
          ))}
          <path id="slip-numbers" d={wave(numbersY)} />
          <clipPath id="slip-writing">
            <rect className={writeDelay === null ? "slip-pen idle" : "slip-pen"} style={timing} x="0" y="0" width="320" height={height} />
          </clipPath>
        </defs>
        <path d={outline} fill="url(#slip-paper)" stroke="#e6d7b8" strokeWidth=".8" />
        {writeDelay !== null && (
          <>
            <g clipPath="url(#slip-writing)" style={{ fontFamily: "var(--font-courier-prime), 'Courier New', monospace" }}>
              <text fontSize={fontSize} fill="#3b2e22" textAnchor="middle">
                {lines.map((line, i) => (
                  <textPath key={i} href={`#slip-line-${i}`} startOffset="50%">{line}</textPath>
                ))}
              </text>
              <text fontSize="8.5" fontWeight="700" letterSpacing="1" fill="#a3182b" textAnchor="middle">
                <textPath href="#slip-numbers" startOffset="50%">{numbersText}</textPath>
              </text>
            </g>
            <g className="slip-quill" style={timing} aria-hidden="true">
              <g className="slip-glint" transform={`translate(16 ${lineYs[0] - 1})`}>
                <path className="slip-glint-rays" d="M0 -15 C0.5 -3.2 1 -1 8.5 0 C1 1 0.5 3.2 0 15 C-0.5 3.2 -1 1 -8.5 0 C-1 -1 -0.5 -3.2 0 -15 Z" fill="#e2a93a" />
                <circle r="1.8" fill="#ffffff" />
              </g>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}

function FortuneMessage({ message, onReset }: { message: string; onReset: () => void }) {
  const numbers = useMemo(() => luckyNumbers(), []);
  const openedAt = useRef(0);
  const [writeDelay, setWriteDelay] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  // The fortune may still be loading when the slip appears; start writing as soon
  // as both the slip is in place and the text is here.
  useEffect(() => {
    if (!message || writeDelay !== null) return;
    const elapsed = (performance.now() - openedAt.current) / 1000;
    setWriteDelay(Math.max(0, WRITE_AT - elapsed));
  }, [message, writeDelay]);

  async function handleShare() {
    const text = `${message} Lucky numbers: ${numbers.join(", ")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My fortune", text, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  const actionsDelay = writeDelay === null ? null : writeDelay + WRITE_DURATION + 0.2;

  return (
    <div className="fortune-stage">
      <SkyBackground />

      <p className="fortune-heading">your fortune</p>

      <div className="fortune-scene">
        <div className="fortune-glow" aria-hidden="true" />
        <CrackingCookie />
        <Slip message={message} numbers={numbers} writeDelay={writeDelay} />
      </div>

      {actionsDelay !== null && (
        <div className="fortune-actions" style={{ animationDelay: `${actionsDelay}s` }}>
          <button type="button" className="fortune-again" onClick={onReset}>
            another cookie
          </button>
          <button type="button" className="fortune-share" onClick={handleShare}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="M7 8l5-5 5 5" />
              <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
            </svg>
            <span>{copied ? "Copied!" : "Share this fortune"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default FortuneMessage;
