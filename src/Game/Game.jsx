import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

import icon1 from "../assets/Icons/icons-01.png";
import icon2 from "../assets/Icons/icons-02.png";
import icon3 from "../assets/Icons/icons-03.png";
import icon4 from "../assets/Icons/icons-04.png";
import icon5 from "../assets/Icons/icons-05.png";
import icon6 from "../assets/Icons/icons-06.png";
import icon7 from "../assets/Icons/icons-07.png";
import icon8 from "../assets/Icons/icons-08.png";
import icon9 from "../assets/Icons/icons-09.png";
import icon10 from "../assets/Icons/icons-10.png";
import icon11 from "../assets/Icons/icons-11.png";
import icon12 from "../assets/Icons/icons-12.png";

const items = [
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
  icon9,
  icon10,
  icon11,
  icon12,
];

function Game() {
  const gameDuration = 20000; // 20 s
  const baseBubbleLifetime = 1500;
  const baseSpawnInterval = 800;

  const bubbleSize = 80; // px — master knob

  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration / 1000);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef(null);
  const bubbleIdRef = useRef(0);
  const spawnIntervalRef = useRef(baseSpawnInterval);
  const bubbleLifetimeRef = useRef(baseBubbleLifetime);
  const socketRef = useRef(null);

  // CONNECT SOCKET
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    socketRef.current.on("screen1", () => {
      resetGame();
      setGameStarted(true);
    });
    return () => socketRef.current.disconnect();
  }, []);

  // GAME LOOP
  useEffect(() => {
    if (!gameStarted) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setInterval(spawnBubble, spawnIntervalRef.current);
    const endGameTimeout = setTimeout(endGame, gameDuration);

    return () => {
      clearInterval(countdown);
      clearInterval(timerRef.current);
      clearTimeout(endGameTimeout);
    };
  }, [gameStarted]);

  // DIFFICULTY
  useEffect(() => {
    if (score > 0 && score % 3 === 0) {
      spawnIntervalRef.current = Math.max(200, spawnIntervalRef.current - 100);
      bubbleLifetimeRef.current = Math.max(
        400,
        bubbleLifetimeRef.current - 150
      );

      if (!gameOver && gameStarted) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(spawnBubble, spawnIntervalRef.current);
      }
    }
  }, [score, gameOver, gameStarted]);

  // HELPERS
  const resetGame = () => {
    setScore(0);
    setBubbles([]);
    setGameOver(false);
    setTimeLeft(gameDuration / 1000);
    spawnIntervalRef.current = baseSpawnInterval;
    bubbleLifetimeRef.current = baseBubbleLifetime;
  };

  const endGame = async () => {
    clearInterval(timerRef.current);

    // call API
    await fetch("http://localhost:3001/api/resetScreens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screen1: true }),
    });

    setGameOver(true);
    setBubbles([]);
  };

  const spawnBubble = () => {
    if (gameOver) return;

    const id = bubbleIdRef.current++;
    const isTrap = Math.random() < 0.3;

    let newBubble;
    let safe = false;
    let attempts = 0;

    while (!safe && attempts < 20) {
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
        const dx = ((x - b.x) * window.innerWidth) / 100;
        const dy = ((y - b.y) * window.innerHeight) / 100;
        return Math.sqrt(dx * dx + dy * dy) > bubbleSize;
      });
    }

    if (!safe) return;

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
            setScore((s) => Math.max(0, s - 1));
            setMessage("Oops! -1 ❌");
          } else {
            setScore((s) => s + 1);
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

  // RENDER
  return (
    <div className="w-screen h-screen bg-blue-100 relative overflow-hidden flex flex-col items-center justify-center select-none">
      {!gameStarted && (
        <div className="text-3xl font-bold">
          Waiting for START from server...
        </div>
      )}

      {gameStarted && (
        <>
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

          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                onClick={() => handleTap(bubble.id)}
                onTouchStart={() => handleTap(bubble.id)}
                initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                animate={{
                  opacity: 1,
                  scale: bubble.burst ? 1.3 : 1,
                  rotate: 0,
                  transition: { type: "spring", stiffness: 220, damping: 12 },
                }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: bubble.burst ? 1.3 : 1.1 }}
                className={`absolute rounded-full shadow-lg flex items-center justify-center ${
                  bubble.burst ? "bg-red-500" : "bg-pink-400"
                }`}
                style={{
                  top: `${bubble.y}%`,
                  left: `${bubble.x}%`,
                  width: `${bubbleSize}px`,
                  height: `${bubbleSize}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {bubble.text && bubble.text !== "💥" ? (
                  <motion.img
                    src={bubble.text}
                    alt=""
                    className="pointer-events-none"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ maxWidth: "70%", maxHeight: "70%" }}
                  />
                ) : (
                  <span className="text-white text-2xl">{bubble.text}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default Game;
