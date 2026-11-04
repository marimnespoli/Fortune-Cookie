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
      // Home is a solid blue; the fortune page keeps the paper background.
      background: opened ? "url('/assets/background image.png') center / cover" : "#1b2254",
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
