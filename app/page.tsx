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
      // Home is the starry night; the fortune page keeps the paper background.
      background: opened ? "url('/assets/background image.png') center / cover" : "#121731",
      minHeight: "100vh",
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
