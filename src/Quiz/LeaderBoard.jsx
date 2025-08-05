
import bg from "../assets/bg.png";

import { useEffect, useState } from "react";

function LeaderBoard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/score/top")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      className="p-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white text-center drop-shadow-lg">
        Leaderboard
      </h1>
      <div className="overflow-x-auto rounded-lg shadow-lg max-w-4xl mx-auto bg-black/60">
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
              data.map((player, idx) => (
                <tr key={player.id || idx} className="hover:bg-white/10">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderBoard;
