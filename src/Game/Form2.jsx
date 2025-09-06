// src/components/Form.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


function Form() {
  const [step, setStep] = useState("choose"); // "choose" | "names"
  const [numPlayers, setNumPlayers] = useState(1);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const handleChoose = (n) => {
    setNumPlayers(n);
    setStep("names");
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerMsg("");

    // build payload like curl
    const payload =
      numPlayers === 1
        ? { player1 }
        : { player1, player2 };

    try {
      const res = await fetch("http://localhost:3001/api/screen2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setServerMsg("✅ Sent successfully");
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
    const payload =
      numPlayers === 1
        ? { player1 }
        : { player1, player2 };

    try {
      const res = await fetch("http://localhost:3001/api/screen2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setServerMsg("✅ Sent successfully");
      } else {
        setServerMsg("⚠️ Error: " + (json.message || res.status));
      }
    } catch (err) {
      setServerMsg("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit=async(e)=>{
      e.preventDefault();
    setLoading(true);
    setServerMsg("");

    if(numPlayers===1)
    {

    }
    else{
      const [x, y]= await new Promise.all[handleSubmit1, handleSubmit2];
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 p-4">
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
                <div className="flex gap-4">
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
                </div>
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
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Form;
