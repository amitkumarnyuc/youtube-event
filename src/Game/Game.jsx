import React, { useEffect, useState, useRef } from "react";

const items = ["Shirt", "Bag", "Heels", "Watch", "Socks", "Hat"];

function Game() {
  const gameDuration = 20000; // 20 seconds
  const baseBubbleLifetime = 1500;
  const baseSpawnInterval = 800;

  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration / 1000);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);
  const bubbleIdRef = useRef(0);
  const spawnIntervalRef = useRef(baseSpawnInterval);
  const bubbleLifetimeRef = useRef(baseBubbleLifetime);

  const bubbleSize = 80; // approx diameter in px

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setGameOver(true);
          setBubbles([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setInterval(() => {
      spawnBubble();
    }, spawnIntervalRef.current);

    const endGameTimeout = setTimeout(() => {
      clearInterval(timerRef.current);
      setGameOver(true);
      setBubbles([]);
    }, gameDuration);

    return () => {
      clearInterval(countdown);
      clearInterval(timerRef.current);
      clearTimeout(endGameTimeout);
    };
  }, []);

  useEffect(() => {
    if (score > 0 && score % 3 === 0) {
      spawnIntervalRef.current = Math.max(200, spawnIntervalRef.current - 100);
      bubbleLifetimeRef.current = Math.max(300, bubbleLifetimeRef.current - 150);

      if (!gameOver) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          spawnBubble();
        }, spawnIntervalRef.current);
      }
    }
  }, [score, gameOver]);

  const spawnBubble = () => {
    if (gameOver) return;

    const id = bubbleIdRef.current++;
    const isTrap = Math.random() < 0.3;

    let newBubble;
    let attempts = 0;
    let safe = false;

    while (!safe && attempts < 10) {
      attempts++;
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;

      newBubble = {
        id,
        text: isTrap ? "" : items[Math.floor(Math.random() * items.length)],
        trap: isTrap,
        x,
        y,
        burst: false,
      };

      safe = bubbles.every((b) => {
        const dx = (x - b.x) * window.innerWidth / 100;
        const dy = (y - b.y) * window.innerHeight / 100;
        return Math.sqrt(dx * dx + dy * dy) > bubbleSize;
      });
    }

    if (!safe) return; // if no safe spot found, skip this spawn

    setBubbles((prev) => [...prev, newBubble]);

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, bubbleLifetimeRef.current);
  };

  const handleTap = (id) => {
    if (gameOver) return;

    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          if (b.trap) {
            setScore((prevScore) => Math.max(0, prevScore - 1));
            setMessage("Oops! -1 ❌");
          } else {
            setScore((prevScore) => prevScore + 1);
            setMessage("Great! 🎉");
          }
          return { ...b, burst: true, text: "💥" };
        }
        return b;
      })
    );

    setTimeout(() => setMessage(""), 800);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 400);
  };

  return (
    <div className="w-screen h-screen bg-blue-100 relative overflow-hidden flex flex-col items-center justify-center touch-none">
      <div className="absolute top-5 flex justify-between w-full px-10 text-xl font-bold">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      {message && (
        <div
          className={`absolute top-20 text-2xl font-bold animate-bounce ${
            message.includes("Oops") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white text-3xl font-bold">
          <p>Game Over!</p>
          <p>Your Score: {score}</p>
        </div>
      )}

      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          onClick={() => handleTap(bubble.id)}
          onTouchStart={() => handleTap(bubble.id)}
          className={`absolute font-semibold rounded-full p-6 cursor-pointer shadow-lg flex items-center justify-center transition-all duration-300 ${
            bubble.burst
              ? "bg-red-500 scale-125 text-white"
              : "bg-pink-400 text-white"
          }`}
          style={{
            top: `${bubble.y}%`,
            left: `${bubble.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {bubble.text}
        </div>
      ))}
    </div>
  );
}

export default Game;
