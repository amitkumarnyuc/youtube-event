import bg from "../assets/bg3.png";
import { useEffect, useState } from "react";
import { url } from "../utils";
import { motion, AnimatePresence } from "framer-motion";

function LeaderBoard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevLength, setPrevLength] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${url}/api/score/top`)
        .then((res) => res.json())
        .then((json) => {
          if (json.length > data.length) {
            setPrevLength(data.length);
            setData(json);
          } else if (data.length === 0) {
            setData(json);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [data.length]);

  return (
 <div
  className="p-4"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "24vh",
  }}
>
  <div className="overflow-x-auto rounded-lg shadow-lg w-full bg-black/60">
    <table className="min-w-full text-white">
      <thead className="bg-black/40">
        <tr>
          <th className="px-4 py-2 border-b text-center">Rank</th>
          <th className="px-4 py-2 border-b text-center">Team Name</th>
          <th className="px-4 py-2 border-b text-center">Table No</th>
          <th className="px-4 py-2 border-b text-center">Score</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={4} className="text-center py-4">
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
                  initial={isNew ? { opacity: 0, scale: 0.95 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-white/10"
                >
                  <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {player.teamName || player.name}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {player.tableNo}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {player.score}
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

  );
}

export default LeaderBoard;
