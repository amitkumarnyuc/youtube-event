import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Button } from '../components/ui/Buttons';
import btn from '../assets/btn.svg';
import logo from '../assets/creator-logo.svg';
import { all } from '../utils'; // Array of objects with `handles`, etc.

function ChaatbotForm({ onSubmit, shouldExit, setTeamName, teamName }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const matched = all.find(
      (item) =>
        typeof item.handles === 'string' &&
        item.handles.toLowerCase() === value.toLowerCase()
    );

    if (matched) {
      setTeamName(matched);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teamName || !teamName.handles) {
      alert('Please select a valid user from the list');
      return;
    }

    onSubmit();
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
        onSubmit={handleSubmit}
      >
        <img src={logo} className="w-8/12" alt="Creator Logo" />

        <span className="text-5xl font-bold text-center">
          Hey Gemini, I am <br />
          <input
            name="teamName"
            required
            list="teamSuggestions"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your handle..."
            className="border ml-2 mr-2 mt-8 p-1 pt-4 pb-4 rounded-xl w-full max-w-lg bg-black border-black text-white"
          />
        </span>

        <datalist id="teamSuggestions">
          {inputValue.length > 0 &&
            all
              .filter(
                (item) =>
                  typeof item.handles === 'string' &&
                  item.handles.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((item, index) => (
                <option key={index} value={item.handles} />
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
