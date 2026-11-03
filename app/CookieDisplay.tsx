"use client";

// Star positions in % of the screen: [left, top, size px, delay s].
const STARS = [
  [8, 7, 14, 0], [82, 11, 18, 1.1], [51, 5, 10, 2], [20, 38, 12, 0.6], [90, 39, 10, 1.7],
  [5, 50, 16, 2.4], [92, 56, 14, 0.3], [15, 76, 12, 1.4], [85, 83, 18, 2.8], [46, 95, 10, 0.9],
  [67, 33, 8, 2.1], [31, 66, 8, 3], [74, 71, 10, 1.9], [10, 92, 10, 0.4], [95, 45, 8, 2.6],
  [38, 7, 8, 1.3], [59, 88, 8, 0.7], [24, 62, 8, 2.2],
];

const STAR_PATH = "M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10 Z";

function CookieDisplay({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="home-stage">
      <div className="home-stars" aria-hidden="true">
        {STARS.map(([left, top, size, delay], i) => (
          <svg
            key={i}
            className="home-star"
            viewBox="-10 -10 20 20"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
          >
            <path d={STAR_PATH} fill="#e9c47d" />
          </svg>
        ))}
      </div>

      {/* Golden banner with the title following its curve. */}
      <div className="home-banner">
        <img src="/assets/faixa do fortune cookie.png" alt="" aria-hidden="true" />
        <svg viewBox="0 0 764 267" role="img" aria-label="Fortune Cookie">
          <defs>
            <path id="home-title-arc" d="M 110 140 Q 382 20 655 135" />
          </defs>
          <text fontSize="48" fill="#a3182b" textAnchor="middle" style={{ fontFamily: "var(--font-shojumaru), cursive" }}>
            <textPath href="#home-title-arc" startOffset="50%">Fortune Cookie</textPath>
          </text>
        </svg>
      </div>

      <div className="home-cookie">
        <div className="home-cookie-glow" aria-hidden="true" />
        <img src="/assets/cookie.svg" alt="A cracked fortune cookie" />
      </div>

      <button type="button" className="home-button" onClick={onOpen} aria-label="Open the cookie">
        <img src="/assets/buttom.svg" alt="" />
      </button>

      <p className="home-hint">One new fortune, written just for you</p>
    </div>
  );
}

export default CookieDisplay;
