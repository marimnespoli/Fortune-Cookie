"use client";

function FortuneMessage({ message, onReset }) {
  return (
    <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <img src="/assets/stars page 2.png" alt="Stars" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", top: 0, left: 0 }} />
      <div style={{ position: "relative", width: "80vw" }}>
        <img src="/assets/faixa da frase.svg" alt="Fortune banner" style={{ width: "100%" }} />
        <p style={{
          position: "absolute",
          top: "41%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "60%",
          fontSize: "18px",
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
