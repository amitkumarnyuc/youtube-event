import { useEffect, useState } from "react";
import { url } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import bg from '../assets/bg3.png'
function LeaderBoard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevLength, setPrevLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}/api/score/top`);
        const json = await res.json();
        const hasChanged = JSON.stringify(json) !== JSON.stringify(data);
        if (hasChanged) {
          setPrevLength(data.length);
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 1000); // Refresh every second
    return () => clearInterval(interval); // Cleanup
  }, [data]);

  return (
    <div className="relative min-h-screen overflow-hidden"  style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* 🔴 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute  left-0 w-full h-full object-cover z-0"
        style={{
          top:'-6px'
        }}
      >
        <source src="https://firebasestorage.googleapis.com/v0/b/gemini-17e87.firebasestorage.app/o/Assets%2FLeader%20board%20For%20animation.mp4?alt=media&token=75d2f449-1bac-47b5-878d-fda1e2fb9bb7" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional dark overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full z-0"></div>

      {/* ⚪ Foreground content */}
      <div className="relative z-10 pl-4 pr-4 pt-[27vh]">
        <div className="overflow-x-auto rounded-lg w-full pl-4 pr-4">
          <table className="min-w-full text-white table-fixed border-separate border-spacing-y-2">
            <thead className="bg-black/60 text-xl">
              <tr>
                <th className="px-4 py-2 text-center w-1/5">Rank</th>
                <th className="px-4 py-2 text-center w-1/5">Team Name</th>
                <th className="px-4 py-2 text-center w-1/5">Table No</th>
                <th className="px-4 py-2 text-center w-1/5">Time Taken</th>
                <th className="px-4 py-2 text-center w-1/5">Score</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-xl">
                    Loading...
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {data.map((player, idx) => {
                    const isNew = idx >= prevLength;

                    return (
                      <motion.tr
                        key={player.id || `${player.teamName}-${idx}`}
                        initial={isNew ? { opacity: 0, scale: 0.95, y: 10 } : false}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="overflow-hidden rounded-md"
                      >
                        <td className="w-1/5 rounded-l-md p-0">
                          <div className="py-4 text-center text-xl font-semibold bg-gradient-to-b from-black/70 to-zinc-800 rounded-l-md">
                            <motion.div
                              animate={{
                                scale: [1, 1.03, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                repeatDelay: 4 + Math.random() * 4,
                                duration: 2,
                                ease: "easeInOut",
                              }}
                            >
                              {idx + 1}
                            </motion.div>
                          </div>
                        </td>
                        <td className="w-1/5 p-0">
                          <div className="py-4 text-center text-xl font-semibold bg-gradient-to-b from-black/70 to-zinc-800">
                            {player.teamName || player.name}
                          </div>
                        </td>
                        <td className="w-1/5 p-0">
                          <div className="py-4 text-center text-xl font-semibold bg-gradient-to-b from-black/70 to-zinc-800">
                            {player.tableNo}
                          </div>
                        </td>
                        <td className="w-1/5 p-0">
                          <div className="py-4 text-center text-xl font-semibold bg-gradient-to-b from-black/70 to-zinc-800">
                            {player.timeTaken}
                          </div>
                        </td>
                        <td className="w-1/5 rounded-r-md p-0">
                          <div className="py-4 text-center text-xl font-bold bg-gradient-to-b from-black/70 to-zinc-800 rounded-r-md">
                            {player.score}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
