// src/components/Form.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { url } from "../globalVariable";
// import bg from '../assets/TabGraphics/Tabscreen-01.png'
function Form() {

  const [page, setPgae]=useState(0)
  const [step, setStep] = useState("choose");
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
    // Initialize socket connection
    socketRef.current = io(url)

    // Set up event listeners
    const handleStatusUpdate = (data) => {
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        ...data,
      }));
    };

    // Listen for status updates
    socketRef.current.on("controller1", handleStatusUpdate);
    socketRef.current.on("statusUpdate", handleStatusUpdate);

    // Request initial status
    socketRef.current.emit("controller1");

    // Cleanup function
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
    setStep("names");
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerMsg("");

    // build payload like curl
    const payload = numPlayers === 1 ? { player1 } : { player1, player2 };

    try {
      const res = await fetch(`${url}/api/screen1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setServerMsg("✅ Sent successfully");

        window.location.reload()
        // Request updated status after successful submission
        if (socketRef.current) {
          socketRef.current.emit("controller1");
        }
      } else {
        setServerMsg("⚠️ Error: " + (json.message || res.status));
      }
    } catch (err) {
      setServerMsg("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerMsg("");

    // build payload like curl
    const payload = numPlayers === 1 ? { player1 } : { player1, player2 };

    try {
      const res = await fetch(`${url}/api/screen2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setServerMsg("✅ Sent successfully");
        // Request updated status after successful submission
        if (socketRef.current) {
          socketRef.current.emit("controller1");
        }
      } else {
        setServerMsg("⚠️ Error: " + (json.message || res.status));
      }
    } catch (err) {
      setServerMsg("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerMsg("");

    if (numPlayers === 1) {
      await handleSubmit1(e);
      return;
    } else {
      await Promise.all([handleSubmit1(e), handleSubmit2(e)]);
    }
  };

  // Reset to choose step when both screens become available
  useEffect(() => {
    if (
      step === "names" &&
      !statuses.isScreen1Busy &&
      !statuses.isScreen2Busy
    ) {
    }
  }, [statuses, step]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-100 to-cyan-200 p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl shadow-xl bg-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === "choose" && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Select Number of Players
                </h1>
                <p className="text-gray-500 mb-4 text-center">
                  How many players will be playing?
                </p>

                {statuses.isScreen1Busy && statuses.isScreen2Busy ? (
                  <p className="text-red-600 font-semibold">
                    Screen is busy, please try on the other Ipad or wait for
                    some time.
                  </p>
                ) : (
                  <div className="flex gap-4">
                    {!statuses.isScreen1Busy && !statuses.isScreen2Busy && (
                      <>
                        <button
                          onClick={() => handleChoose(1)}
                          className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
                        >
                          1 Player
                        </button>
                        <button
                          onClick={() => handleChoose(2)}
                          className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
                        >
                          2 Players
                        </button>
                      </>
                    )}

                    {statuses.isScreen1Busy && !statuses.isScreen2Busy && (
                      <p className="text-red-600 font-semibold">
                        Screen is busy, please try on the other Ipad or wait for
                        some time.
                      </p>
                    )}

                    {!statuses.isScreen1Busy && statuses.isScreen2Busy && (
                      <button
                        onClick={() => handleChoose(1)}
                        className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
                      >
                        Play on Screen 1
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
            {step === "names" && (
              <motion.form
                key="names"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Enter Player Name{numPlayers > 1 && "s"}
                </h2>

                <input
                  type="text"
                  placeholder="Player 1 Name"
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                {numPlayers === 2 && (
                  <input
                    type="text"
                    placeholder="Player 2 Name"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 px-6 py-3 rounded-xl text-white font-semibold shadow transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Sending..." : "Enter"}
                </button>

                {serverMsg && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {serverMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="mt-2 px-4 py-2 rounded-xl bg-gray-300 text-gray-700 font-semibold shadow hover:bg-gray-400 transition"
                >
                  Back
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Form;
