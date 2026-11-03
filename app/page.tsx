"use client";
import { useState, useEffect } from "react";
import CookieDisplay from "./CookieDisplay";
import FortuneMessage from "./FortuneMessage";
import { fallbackFortunes } from "./fortunes";

function localFortune() {
  return fallbackFortunes[Math.floor(Math.random() * fallbackFortunes.length)];
}

function Home() {
  const [opened, setOpened] = useState(false);
  const [fortune, setFortune] = useState("");

  useEffect(() => {
    document.title = opened ? "Your Fortune | Fortune Cookie" : "Fortune Cookie";
  }, [opened]);

  async function handleOpen() {
    setFortune("");
    setOpened(true);
    try {
      const res = await fetch("/api/fortune", { cache: "no-store" });
      const data: { fortune?: string } = await res.json();
      setFortune(data.fortune || localFortune());
    } catch {
      setFortune(localFortune());
    }
  }

  function handleReset() {
    setOpened(false);
    setFortune("");
  }

  return (
    <main style={{
      position: "relative",
      backgroundImage: "url('/assets/background image.png')",
      backgroundSize: "cover",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: opened ? "0px" : "120px"
    }}>
      {!opened && <>
        <style>{`@keyframes twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        <img src="/assets/stars.svg" alt="Stars" style={{ position: "absolute", width: "100%", height: "100vh", objectFit: "cover", top: 0, left: 0, pointerEvents: "none", animation: "twinkle 3s ease-in-out infinite" }} />
      </>}
      {!opened && <CookieDisplay onOpen={handleOpen} />}
      {opened && <FortuneMessage message={fortune} onReset={handleReset} />}
    </main>
  );
}

export default Home;
