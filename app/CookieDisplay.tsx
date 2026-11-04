"use client";

// Golden clouds drifting gently on each side: [left %, top %, width px, mirrored, sway s, mist s, delay s].
const CLOUDS: [number, number, number, boolean, number, number, number][] = [
  [66, 0.5, 105, true, 24, 12, -6],
  [-9, 38, 140, false, 20, 10, 0],
  [69, 52, 120, true, 22, 13, -11],
  [54, 90, 170, true, 26, 14, -3],
];

function CookieDisplay({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="home-stage">
      {/* Subtle film grain over the solid blue, so it doesn't look like flat paint. */}
      <svg className="home-grain" aria-hidden="true">
        <filter id="home-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#home-grain-filter)" />
      </svg>

      <div className="home-clouds" aria-hidden="true">
        {CLOUDS.map(([left, top, width, mirrored, sway, mist, delay], i) => (
          <div
            key={i}
            className="home-cloud"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width,
              animationDuration: `${sway}s, ${mist}s`,
              animationDelay: `${delay}s, ${delay / 2}s`,
            }}
          >
            <img src="/assets/nuvem-dourada.svg" alt="" style={mirrored ? { transform: "scaleX(-1)" } : undefined} />
          </div>
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
        click
      </button>

      <p className="home-hint">One new fortune, written just for you</p>
    </div>
  );
}

export default CookieDisplay;
