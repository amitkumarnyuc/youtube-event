import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../components/ui/Buttons';
import btn from '../assets/btn.svg';
import { url } from '../utils';

function QuizForm({ onSubmit, shouldExit, setTeamName, teamName, tableNo }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTeamName = (e) => {
    setTeamName(e.target.value);
  };

  const createScore = async (name) => {
    try {
      const res = await fetch(`${url}/api/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName: name,
          tableNo: tableNo, // 🆕 include table number
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create team");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (teamName.trim() === "") return;

    setLoading(true);

    try {
      const scoreData = await createScore(teamName.trim());

      // Pass score data to parent
      onSubmit(scoreData);
    } catch (err) {
      setError("❌ Could not create or fetch team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={shouldExit ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex items-center justify-center z-50"
    >
      <div className="text-center space-y-4 flex flex-col justify-center place-items-center gap-10">
        <h1 className="text-5xl font-bold ">Hey Creators!</h1>
        <h2 className="text-4xl font-bold  m-4">
          Please enter your team's <br /> name to begin.
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="teamName"
            required
            value={teamName}
            onChange={handleTeamName}
            className="border p-2 pt-4 pb-4 mb-6 rounded-xl w-full max-w-lg bg-black border-black text-white text-xl capitalize"
            placeholder="Enter Team Name*"
          />

          {error && <p className="text-red-500 text-lg">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="text-white px-6 py-2 hover:opacity-80 transition text-2xl font-bold"
            style={{
              backgroundImage: `url(${btn})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '200px',
              height: '80px',
            }}
          >
            {loading ? "Loading..." : "Start"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default QuizForm;
