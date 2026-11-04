"use client";
import SkyBackground from "./SkyBackground";

function CookieDisplay({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="home-stage">
      <SkyBackground />

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
