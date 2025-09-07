// src/components/Game.jsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// icon assets
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
import { ClockIcon } from "../components/ui/Clock";
import { url } from "../globalVariable";

const items = [
  icon1, icon2, icon3, icon4, icon5, icon6,
  icon7, icon8, icon9, icon10, icon11, icon12
];

function Game() {
  const BUBBLE_SIZE = 100;
  const GAME_DURATION = 30; // seconds
  const BASE_BUBBLE_LIFETIME = 1500;
  const BASE_SPAWN_INTERVAL = 800;
  const SPAWN_HEIGHT = 1400;
  const PRE_GAME_COUNTDOWN = 3; // seconds before game starts

  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [waiting, setWaiting] = useState(true); // initial waiting screen

  const timerRef = useRef(null);
  const bubbleIdRef = useRef(0);
  const spawnIntervalRef = useRef(BASE_SPAWN_INTERVAL);
  const bubbleLifetimeRef = useRef(BASE_BUBBLE_LIFETIME);
  const socketRef = useRef(null);
  const spawnAreaRef = useRef(null);

  // SOCKET CONNECTION
  useEffect(() => {
    socketRef.current = io(url);
    socketRef.current.on("screen2", () => startPreGame());
    return () => socketRef.current.disconnect();
  }, []);

  // START PRE-GAME COUNTDOWN
  const startPreGame = () => {
    resetGame();
    setWaiting(false);
    setCountdown(PRE_GAME_COUNTDOWN);

    let count = PRE_GAME_COUNTDOWN;
    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownInterval);
        setCountdown(0);
        setGameStarted(true);
      }
    }, 1000);
  };

  // MAIN GAME LOOP
  useEffect(() => {
    if (!gameStarted) return;

    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setInterval(spawnBubble, spawnIntervalRef.current);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(timerRef.current);
    };
  }, [gameStarted]);

  // DIFFICULTY ADJUSTMENT
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      spawnIntervalRef.current = Math.max(200, spawnIntervalRef.current - 100);
      bubbleLifetimeRef.current = Math.max(400, bubbleLifetimeRef.current - 150);
      if (!gameOver && gameStarted) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(spawnBubble, spawnIntervalRef.current);
      }
    }
  }, [score, gameOver, gameStarted]);

  // RESET GAME
  const resetGame = () => {
    setScore(0);
    setBubbles([]);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    spawnIntervalRef.current = BASE_SPAWN_INTERVAL;
    bubbleLifetimeRef.current = BASE_BUBBLE_LIFETIME;
    setGameStarted(false);
    setWaiting(true);
  };

  // END GAME

    const endGame = async () => {
    clearInterval(timerRef.current);

    // call API
    await fetch(`${url}/api/resetScreens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screen2: true }),
    });
    setGameOver(true);
    setBubbles([]);

     setTimeout(() => {
      resetGame();
    }, 3000);
  };


  // SPAWN BUBBLE WITH COLLISION CHECK
  const spawnBubble = () => {
    if (gameOver || !spawnAreaRef.current) return;

    const area = spawnAreaRef.current.getBoundingClientRect();
    const id = bubbleIdRef.current++;
    let newBubble;
    let safe = false;
    let attempts = 0;

    while (!safe && attempts < 50) {
      attempts++;
      const x = Math.random() * (area.width - BUBBLE_SIZE) + BUBBLE_SIZE / 2;
      const y = Math.random() * (area.height - BUBBLE_SIZE) + BUBBLE_SIZE / 2;

      newBubble = {
        id,
        xPx: x,
        yPx: y,
        burst: false,
        text: items[Math.floor(Math.random() * items.length)],
      };

      safe = bubbles.every(b => {
        const dx = x - b.xPx;
        const dy = y - b.yPx;
        return Math.sqrt(dx * dx + dy * dy) > BUBBLE_SIZE;
      });
    }

    if (!safe) return;

    setBubbles(prev => [...prev, newBubble]);
    setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), bubbleLifetimeRef.current);
  };

  // TAP HANDLER WITH ANIMATION
  const handleTap = (id) => {
    if (gameOver) return;

    setScore(s => s + 1);
    setMessage("Great! 🎉");

    setBubbles(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, burst: true, animate: { scale: 1.5, rotate: [0, 20, -20, 0], opacity: 0 }, text: "💥" }
          : b
      )
    );

    setTimeout(() => setMessage(""), 800);
    setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), 500);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-cyan-100 to-cyan-200 relative overflow-hidden flex flex-col items-center justify-center select-none">
      {/* WAITING SCREEN */}
      {waiting && countdown === 0 && (
        <div className="text-4xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Waiting for START from server...
        </div>
      )}

      {/* PRE-GAME COUNTDOWN */}
      {!gameStarted && countdown > 0 && (
        <div className="text-8xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
          {countdown}
        </div>
      )}

      {/* GAME STARTED */}
      {gameStarted && (
        <>
          {/* HEADER */}
          <div className="absolute top-10 flex justify-between w-full px-10 text-5xl font-bold flex-col gap-12">
            <div className="flex justify-between w-full">
              <span className="px-4 py-2 flex flex-row items-center gap-3 w-1/3">Player 2</span>
              <span className="bg-red-500 text-white px-4 py-2 rounded-full shadow text-center flex flex-row items-center gap-3 w-72 justify-end font-mono">
                <ClockIcon />
                <span className="tabular-nums">00:{timeLeft.toString().padStart(2, "0")}sec</span>
              </span>
            </div>
            <p className="font-semibold text-center text-6xl">Interactive Bubble Game</p>
          </div>

          {/* FEEDBACK */}
          {message && (
            <div className="absolute top-20 text-2xl font-bold animate-bounce text-green-600">
              {message}
            </div>
          )}

          {/* SPAWN AREA */}
          <div
            ref={spawnAreaRef}
            className="absolute top-28 left-0"
            style={{ width: "90%", height: SPAWN_HEIGHT, border: "4px solid rgba(0,0,0,0.3)", position: "relative" }}
          >
            <AnimatePresence>
              {bubbles.map(bubble => (
                <motion.div
                  key={bubble.id}
                  onClick={() => handleTap(bubble.id)}
                  onTouchStart={() => handleTap(bubble.id)}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={bubble.burst ? bubble.animate : { opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: bubble.burst ? 1.5 : 1.1 }}
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    top: bubble.yPx,
                    left: bubble.xPx,
                    width: `${BUBBLE_SIZE}px`,
                    height: `${BUBBLE_SIZE}px`,
                    transform: "translate(-50%, -50%)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 70%)",
                    boxShadow: "inset 0 6px 12px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.4)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <motion.img
                    src={bubble.text !== "💥" ? bubble.text : ""}
                    alt=""
                    className="pointer-events-none"
                    animate={{ rotate: bubble.burst ? [0, 20, -20, 0] : [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ maxWidth: "50%", maxHeight: "50%", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }}
                  />
                  {bubble.text === "💥" && (
                    <span className="text-red-500 text-2xl font-bold animate-ping">💥</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* GAME OVER */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white text-5xl font-bold">
          <p>Game Over!</p>
          <p>Your Score: {score}</p>
          
        </div>
      )}
    </div>
  );
}

export default Game;
