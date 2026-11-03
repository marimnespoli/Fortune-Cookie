"use client";

// Center line of the ribbon, in the banner SVG's coordinates (viewBox 0 0 1728 694).
// The text is drawn along this curve so it bends with the paper.
const RIBBON_CENTER = { x0: 520, y0: 306, c1x: 700, c1y: 335, c2x: 1000, c2y: 230, x1: 1265, y1: 268 };
const USABLE_LENGTH = 720; // path length available for text, leaving some margin
const CHAR_WIDTH = 0.6; // monospace glyph width, relative to font size
const MAX_FONT = 50;
const MIN_SINGLE_LINE_FONT = 44;

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
  if (fit(message.length) >= MIN_SINGLE_LINE_FONT) {
    return { lines: [message], fontSize: fit(message.length) };
  }
  const lines = splitInTwo(message);
  return { lines, fontSize: fit(Math.max(...lines.map((l) => l.length))) };
}

function FortuneMessage({ message, onReset }: { message: string; onReset: () => void }) {
  const { lines, fontSize } = layout(message);
  const gap = fontSize * 1.25;
  const offsets = lines.length === 1 ? [0] : [-gap / 2, gap / 2];

  return (
    <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", overflow: "hidden" }}>
      <img src="/assets/stars page 2.png" alt="Stars" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", top: 0, left: 0 }} />
      {/* The banner art only fills the middle of the SVG, so on small screens the
          image is wider than the viewport and its empty margins are cropped. */}
      <div style={{ position: "relative", width: "min(150vw, max(80vw, 1000px))", flexShrink: 0 }}>
        <img src="/assets/faixa da frase.svg" alt="" style={{ width: "100%", display: "block" }} />
        <svg
          viewBox="0 0 1728 694"
          role="img"
          aria-label={message}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            {offsets.map((dy, i) => (
              <path key={i} id={`fortune-line-${i}`} d={curve(dy)} />
            ))}
          </defs>
          <text
            fill="#333"
            fontFamily="'Courier New', Courier, monospace"
            fontSize={fontSize}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {lines.map((line, i) => (
              <textPath key={i} href={`#fortune-line-${i}`} startOffset="50%">
                {line}
              </textPath>
            ))}
          </text>
        </svg>
        <img
          src="/assets/buttom.svg"
          alt="Click to try again"
          width={140}
          onClick={onReset}
          style={{ position: "absolute", top: "58%", left: "50%", transform: "translateX(-50%)", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default FortuneMessage;
