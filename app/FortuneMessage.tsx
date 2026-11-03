"use client";

function FortuneMessage({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", overflow: "hidden" }}>
      <img src="/assets/stars page 2.png" alt="Stars" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", top: 0, left: 0 }} />
      {/* The banner art only fills the middle of the SVG, so on small screens the
          image is wider than the viewport and its empty margins are cropped. */}
      <div style={{ position: "relative", width: "min(150vw, max(80vw, 1000px))", flexShrink: 0, containerType: "inline-size" }}>
        <img src="/assets/faixa da frase.svg" alt="Fortune banner" style={{ width: "100%" }} />
        <p style={{
          position: "absolute",
          top: "43%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "38%",
          margin: 0,
          fontSize: "clamp(13px, 2.2cqw, 24px)",
          lineHeight: 1.25,
          color: "#333"
        }}>
          {message}
        </p>
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
