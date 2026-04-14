"use client";
import { useState, useEffect } from 'react';
import CookieDisplay from './CookieDisplay';
import FortuneMessage from './FortuneMessage';

const fortunes = [
  "A good laugh is sunshine in a house.",
  "Your creativity will lead you to success.",
  "Adventure awaits around the corner.",
  "Kindness is a language everyone understands.",
  "The best is yet to come.",
  "You will find joy in unexpected places.",
  "Hard work always pays off.",
  "A smile is your greatest asset.",
];

function Home() {
  const [opened, setOpened] = useState(false);
  const [fortune, setFortune] = useState("");

  useEffect(() => {
    document.title = opened ? "Your Fortune | Fortune Cookie" : "Fortune Cookie";
  }, [opened]);

  function handleOpen() {
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(random);
    setOpened(true);
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
