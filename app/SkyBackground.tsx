// Solid blue sky shared by both pages: a subtle film grain plus golden clouds
// swaying back and forth while fading in and out like mist.

// [left %, top %, width px, mirrored, sway s, mist s, delay s]
const CLOUDS: [number, number, number, boolean, number, number, number][] = [
  [66, 0.5, 105, true, 24, 12, -6],
  [-9, 38, 140, false, 20, 10, 0],
  [69, 52, 120, true, 22, 13, -11],
  [54, 90, 170, true, 26, 14, -3],
];

function SkyBackground() {
  return (
    <>
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
    </>
  );
}

export default SkyBackground;
