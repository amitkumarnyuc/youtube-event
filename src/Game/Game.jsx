// src/components/Game.jsx
import { useEffect, useState, useRef, use } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";

import bg from "../assets/gamescreenpage-07.png";
import gammerOver from "../assets/gamescreenpage-09GAMEOVER.png";
import v1 from "../assets/Countdown-3.mp4";
import v2 from "../assets/Loading-Screen-2.mp4";
import line from "../assets/gamescreenpage-07line.png";

import { url } from "../globalVariable";

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
import { hypeMessages } from "../utils";

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

// GRID CONFIG
const GRID_ROWS = 4;
const GRID_COLS = 4;
const TOTAL_CELLS = GRID_ROWS * GRID_COLS;
const CELL_SIZE = 210;

function Game() {
  const GAME_DURATION = 30;
  const BASE_BUBBLE_LIFETIME = 1200;
  const BASE_SPAWN_INTERVAL = 600;
  const PRE_GAME_COUNTDOWN = 4;

  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [player, setPlayer] = useState({ name1: "", name2: "" });
  const [userID, setUserID] = useState(null);
  const [winner, setWinner] = useState(null);
  const timerRef = useRef(null);
  const bubbleIdRef = useRef(0);
  const spawnIntervalRef = useRef(BASE_SPAWN_INTERVAL);
  const bubbleLifetimeRef = useRef(BASE_BUBBLE_LIFETIME);
  const socketRef = useRef(null);

  // SOCKET SETUP
  useEffect(() => {
    socketRef.current = io(url);
    socketRef.current.on("screen1", (data) => {
      setUserID(data?.sendPlayer);
      startPreGame();
      setPlayer({
        name1: data.data?.player1,
        name2: data.data?.player2,
      });
    });
    return () => socketRef.current.disconnect();
  }, []);

  const startPreGame = () => {
    resetGame();
    setWaiting(false);
    setCountdown(PRE_GAME_COUNTDOWN);

    let count = PRE_GAME_COUNTDOWN;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setGameStarted(true);
      }
    }, 1000);
  };

  // GAME LOOP
  useEffect(() => {
    if (!gameStarted) return;

    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
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

  // DIFFICULTY SCALING
  useEffect(() => {
    if (score > 0 && score % 150 === 0) {
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

  const resetGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setBubbles([]);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    spawnIntervalRef.current = BASE_SPAWN_INTERVAL;
    bubbleLifetimeRef.current = BASE_BUBBLE_LIFETIME;
    setGameStarted(false);
    setWaiting(true);
  };

  const endGame = async () => {
    clearInterval(timerRef.current);
    await fetch(`${url}/api/resetScreens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screen1: true, userID, score: scoreRef.current }),
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const res = await fetch(`${url}/api/winner`);
      const data = await res.json();
      console.log("Winner data:", data);
    } catch (err) {
      console.error("Error fetching winner:", err);
    }

    setGameOver(true);
    setBubbles([]);
    setTimeout(() => resetGame(), 5000);
  };

  // SPAWN BUBBLES
  const spawnBubble = () => {
    if (gameOver) return;
    const numToSpawn = 2;
    let spawned = 0;

    while (spawned < numToSpawn) {
      const id = bubbleIdRef.current++;
      const cellIndex = Math.floor(Math.random() * TOTAL_CELLS);
      if (bubbles.some((b) => b.cellIndex === cellIndex)) continue;

      const newBubble = {
        id,
        cellIndex,
        burst: false,
        text: items[Math.floor(Math.random() * items.length)],
      };

      setBubbles((prev) => [...prev, newBubble]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, bubbleLifetimeRef.current);

      spawned++;
    }
  };

  const handleTap = (id) => {
    if (gameOver) return;
    setScore((s) => {
      scoreRef.current = s + 10;
      return s + 10;
    });
    const random = Math.floor(Math.random() * hypeMessages.length);
    setMessage(hypeMessages[random]);

    setBubbles((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              burst: true,
              animate: {
                scale: 1.5,
                rotate: [0, 20, -20, 0],
                opacity: 0,
                transition: { duration: 1.2 },
              },
              text: "💥",
            }
          : b
      )
    );

    setTimeout(() => setMessage(""), 1000);
    setTimeout(
      () => setBubbles((prev) => prev.filter((b) => b.id !== id)),
      1200
    );
  };

  const { width, height } = useWindowSize();

  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <AnimatePresence mode="sync">
        {/* WAITING / COUNTDOWN SCREEN */}
        {!gameStarted && !gameOver && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {waiting && (
              <video
                src={v2}
                autoPlay
                muted
                playsInline
                onEnded={() => setCountdown(0)}
                style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
              />
            )}
            {countdown > 0 && (
              <video
                src={v1}
                autoPlay
                muted
                playsInline
                onEnded={() => setCountdown(0)}
                style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
              />
            )}
          </motion.div>
        )}

        {/* GAMEPLAY SCREEN */}
        {gameStarted && !gameOver && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-16"
          >
            {/* Feedback */}
            {message && (
              <div
                className="absolute text-4xl font-bold animate-bounce text-green-600"
                style={{ top: "34%" }}
              >
                {message}
              </div>
            )}

            {/* Score + Timer */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="absolute inset-0 w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="120" fill="#7ee8dd" />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="red"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={
                    (2 * Math.PI * 110 * (GAME_DURATION - timeLeft)) /
                    GAME_DURATION
                  }
                />
              </svg>
              <div className="flex flex-col items-center justify-center text-center absolute">
                <span className="text-6xl font-extrabold text-black ">
                  {score}
                </span>
                <img src={line} style={{ width: "70%", margin: "10px 0" }} />
                <span className="text-2xl text-black">
                  00:{timeLeft.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Grid */}
            <div
              className="grid mt-20"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
              }}
            >
              {Array.from({ length: TOTAL_CELLS }).map((_, idx) => {
                const bubble = bubbles.find((b) => b.cellIndex === idx);
                return (
                  <div
                    key={idx}
                    className="border-2 border-gray-300 flex items-center justify-center relative bg-white/20"
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  >
                    <AnimatePresence>
                      {bubble && (
                        <motion.div
                          key={bubble.id}
                          onClick={() => handleTap(bubble.id)}
                          onTouchStart={() => handleTap(bubble.id)}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={
                            bubble.burst
                              ? bubble.animate
                              : { opacity: 1, scale: 1 }
                          }
                          exit={{
                            opacity: 0,
                            scale: 0,
                            transition: { duration: 0.6 },
                          }}
                          className="absolute inset-0 flex items-center justify-center rounded-full "
                        >
                          {bubble.text !== "💥" ? (
                            <motion.img
                              src={bubble.text}
                              alt=""
                              className="w-44 h-44 pointer-events-none"
                              animate={{
                                rotate: bubble.burst
                                  ? [0, 20, -20, 0]
                                  : [0, 5, -5, 0],
                              }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            />
                          ) : (
                            <span className="text-red-500 text-2xl font-bold animate-ping">
                              💥
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: "absolute",
                width: "100%",
                fontSize: "31px",
                bottom: "11.6vh",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <h3>{player.name1}</h3>
            </div>
          </motion.div>
        )}

        {/* GAME OVER SCREEN */}
        {gameOver && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backgroundImage: `url(${gammerOver})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              color: "black",
              textAlign: "center",
            }}
          >
            <ReactConfetti width={width} height={height} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "23%",
                gap: "30px",
              }}
            >
              <h1
                style={{
                  color: "red",
                  fontSize: "90px",
                  marginBottom: "40px",
                  fontWeight: "bold",
                }}
              >
                Winner
              </h1>
              <h1 style={{ fontSize: "81px" }}>{player?.name1}</h1>
              <img src={line} style={{ width: "70%", margin: "35px 0" }} />
              <h1 style={{ fontSize: "81px" }}>{player?.name2}</h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Game;
