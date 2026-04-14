"use client";

function CookieDisplay({ onOpen }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/assets/faixa do fortune cookie.png" alt="Fortune Cookie banner" width={400} />
        <img src="/assets/Fortune cookie.svg" alt="Fortune Cookie" width={274} style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%, -50%)" }} />
      </div>
      <img src="/assets/cookie.svg" alt="Fortune cookie" width={250} />
      <img
        src="/assets/buttom.svg"
        alt="Click to open"
        width={140}
        onClick={onOpen}
        style={{ cursor: "pointer", marginTop: "20px" }}
      />
    </div>
  );
}

export default CookieDisplay;
