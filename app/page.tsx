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
    // The cookie animation runs while the fortune is being written by the AI.
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
      background: "#1b2254",
      minHeight: "100cqh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
    }}>
      {!opened && <CookieDisplay onOpen={handleOpen} />}
      {opened && <FortuneMessage message={fortune} onReset={handleReset} />}
    </main>
  );
}

export default Home;
