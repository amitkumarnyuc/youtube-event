import { motion } from 'framer-motion';
import React from 'react';
import { Button } from '../components/ui/Buttons';
import btn from '../assets/btn.svg';
import logo from '../assets/creator-logo.svg';
import { all } from '../utils'; // ✅ Make sure this is where you export `all`

function ChaatbotForm({ onSubmit, shouldExit, setTeamName, teamName }) {
  const handleTeamName = (e) => {
    setTeamName({ name: e.target.value });
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={shouldExit ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex justify-center z-50"
    >
      <form
        className="text-center space-y-4 flex flex-col justify-around place-items-center gap-5 pb-20"
        onSubmit={(e) => {
          e.preventDefault();

          const inputName = teamName.name.trim();
          if (inputName === '') return;

          // Match against fullName (case-insensitive)
          const matched = all.find(
            (item) => item.fullName.toLowerCase() === inputName.toLowerCase()
          );

          if (!matched) {
            alert("User not found");
            return;
          }

          onSubmit(); // Proceed
        }}
      >
        <img src={logo} className="w-8/12" alt="Creator Logo" />

        <span className="text-5xl font-bold text-center">
          Hey Gemini, I am <br />
          <input
            name="teamName"
            required
            list="teamSuggestions" // ✅ Link to datalist
            value={teamName.name}
            onChange={handleTeamName}
            // placeholder="Type your name..."
            className="border ml-2 mr-2 mt-8 p-1 pt-4 pb-4 rounded-xl w-full max-w-lg bg-black border-black text-white"
          />
        </span>

        {/* ✅ Suggestions from `all` */}
        <datalist id="teamSuggestions">
          {all.map((item, index) => (
            <option key={index} value={item.fullName} />
          ))}
        </datalist>

        <Button
          type="submit"
          className="text-white px-6 py-2 hover:opacity-80 transition text-2xl font-bold"
          style={{
            backgroundImage: `url(${btn})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '250px',
            height: '100px',
          }}
        >
          CONTINUE
        </Button>
      </form>
    </motion.div>
  );
}

export default ChaatbotForm;
