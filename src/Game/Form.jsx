// src/components/Form.jsx
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { url } from "../globalVariable";
import { motion, AnimatePresence } from "framer-motion";

// assets
import bg from "../assets/TabScreenhexa-10.png";
import tab from "../assets/Tab-08.png";
import tab9 from "../assets/Tab-09.png";
import readyToPlay from "../assets/Tab-04.png";
import how from "../assets/Tab-05.png";
import single from "../assets/Tab-06.png";
import double from "../assets/Tab-07.png";
import or from "../assets/Tab-11.png";
import singlebg from "../assets/Tabscreen-03.png";
import doublebg from "../assets/Tabscreen-04.png";
import submit from "../assets/submit.png";
import tab5 from "../assets/Tabscreen-05.png";

function Form() {
  const [page, setPgae] = useState(1);
  const [numPlayers, setNumPlayers] = useState(1);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [statuses, setStatuses] = useState({
    isScreen1Busy: false,
    isScreen2Busy: false,
  });

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url);

    const handleStatusUpdate = (data) => {
      console.log(data);
      setStatuses((prev) => ({ ...prev, ...data }));
    };

    socketRef.current.on("controller1", handleStatusUpdate);
    socketRef.current.on("statusUpdate", handleStatusUpdate);

    socketRef.current.emit("controller1");

    return () => {
      if (socketRef.current) {
        socketRef.current.off("controller1", handleStatusUpdate);
        socketRef.current.off("statusUpdate", handleStatusUpdate);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleChoose = (n) => {
    setNumPlayers(n);
    setPgae(3);
  };

  const submitToScreen = async (screen, player) => {
    setLoading(true);
    setServerMsg("");

    const payload =
      numPlayers === 1 ? { name: player1 } : { name: player1, name2: player2 };

    try {
      const res = await fetch(`${url}/api/${screen}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: player ? player : player1 }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setServerMsg("✅ Sent successfully");
        if (socketRef.current) socketRef.current.emit("controller1");
        setPgae(4);

        if (screen === "screen1") {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } else {
        setServerMsg("⚠️ Error: " + (json.message || res.status));
      }
    } catch {
      setServerMsg("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit1 = (player1) => submitToScreen("screen1", player1);
  const handleSubmit2 = (player2) => submitToScreen("screen2", player2);

  const handleSubmit = async () => {
    setLoading(true);
    setServerMsg("");

    if (numPlayers === 1) {
      await handleSubmit1(player1);
      return;
    } else {
      await Promise.all([handleSubmit1(player1), handleSubmit2(player2)]);
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // PAGE 1
  if (page === 1) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="page1"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "13%",
              width: "80%",
              height: "70%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Title */}
            <motion.div whileHover={{ scale: 1.05, rotate: 1 }}>
              <img src={readyToPlay} alt="Ready to Play" />
            </motion.div>

            {/* Tab Image */}
            <motion.div
              style={{ width: "50%" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={tab} alt="Tab" style={{ width: "100%" }} />
            </motion.div>

            {/* Next Button */}
            <motion.div
              style={{ width: "65%" }}
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={tab9}
                alt="Tab9"
                onClick={() => setPgae(2)}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // PAGE 2
  if (page === 2) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="page2"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15%",
              width: "80%",
              height: "70%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <motion.div whileHover={{ scale: 1.05, rotate: 2 }}>
              <img src={how} alt="How To Play" />
            </motion.div>

            {/* ✅ Busy status logic here */}
            {statuses.isScreen1Busy && statuses.isScreen2Busy ? (
              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                  background: "rgba(255,255,255,0.7)",
                  padding: "10px 20px",
                  borderRadius: "12px",
                }}
              >
                Screen is busy, please try on the other iPad or wait for some
                time.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                  gap: "20px",
                }}
              >
                {/* Case: Both free */}
                {!statuses.isScreen1Busy && !statuses.isScreen2Busy && (
                  <>
                    <motion.div
                      style={{ width: "40%" }}
                      whileHover={{ scale: 1.1, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={single}
                        alt="Single Player"
                        onClick={() => handleChoose(1)}
                        style={{ width: "100%", cursor: "pointer" }}
                      />
                    </motion.div>

                    <div style={{ width: "10%" }}>
                      <img src={or} alt="Or" style={{ width: "100%" }} />
                    </div>

                    <motion.div
                      style={{ width: "40%" }}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={double}
                        alt="Double Player"
                        onClick={() => handleChoose(2)}
                        style={{ width: "100%", cursor: "pointer" }}
                      />
                    </motion.div>
                  </>
                )}

                {/* Case: Screen1 busy, Screen2 free */}
                {statuses.isScreen1Busy && !statuses.isScreen2Busy && (
                  <motion.div
                    style={{ width: "50%" }}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={single}
                      alt="Play on Screen 2"
                      onClick={() => handleChoose(1)}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                  </motion.div>
                )}

                {/* Case: Screen2 busy, Screen1 free */}
                {!statuses.isScreen1Busy && statuses.isScreen2Busy && (
                  <motion.div
                    style={{ width: "50%" }}
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={single}
                      alt="Play on Screen 1"
                      onClick={() => handleChoose(1)}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // PAGE 3 - Single Player
  if (page === 3 && numPlayers === 1) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="page3-single"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            backgroundImage: `url(${singlebg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "60px",
            paddingTop: "17%",
          }}
        >
          <motion.input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            style={{
              width: "70%",
              border: "none",
              borderBottom: "2px solid #333",
              outline: "none",
              padding: "10px",
              fontSize: "2em",
              background: "transparent",
              color: "#000",
              textAlign: "center",
            }}
            required
          />

          <motion.div style={{ width: "30%" }} whileHover={{ scale: 1.1 }}>
            <img src={submit} alt="Tab9" onClick={handleSubmit} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // PAGE 3 - Two Players
  if (page === 3 && numPlayers === 2) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="page3-double"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            backgroundImage: `url(${doublebg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "25px",
            paddingTop: "10%",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              gap: "20px",
            }}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 style={{ fontSize: "50px", fontFamily: "youtube-sans-bold" }}>
              Player 1
            </h1>
            <input
              type="text"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              style={{
                width: "65%",
                border: "none",
                borderBottom: "2px solid #333",
                outline: "none",
                padding: "0px",
                fontSize: "2em",
                background: "transparent",
                color: "#000",
                textAlign: "center",
              }}
              required
            />
          </motion.div>

          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              gap: "20px",
            }}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 style={{ fontSize: "50px", fontFamily: "youtube-sans-bold" }}>
              Player 2
            </h1>
            <input
              type="text"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              style={{
                width: "65%",
                border: "none",
                borderBottom: "2px solid #333",
                outline: "none",
                padding: "0px",
                fontSize: "2em",
                background: "transparent",
                color: "#000",
                textAlign: "center",
              }}
              required
            />
          </motion.div>

          <motion.div
            style={{ width: "35%", marginTop: "40px" }}
            whileHover={{ scale: 1.1 }}
          >
            <img src={submit} alt="Tab9" onClick={handleSubmit} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // PAGE 4+
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page4"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          backgroundImage: `url(${tab5})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "25px",
          paddingTop: "10%",
        }}
      ></motion.div>
    </AnimatePresence>
  );
}

export default Form;
