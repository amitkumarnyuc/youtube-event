import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Button } from '../components/ui/Buttons';
import btn from '../assets/btn.svg';
import logo from '../assets/creator-logo.svg';
import { all } from '../utils';

function ChaatbotForm({ shouldExit, onSubmit, teamName, setTeamName }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);

    const matched = all.find(
      (item) => item.handles?.toLowerCase() === value.toLowerCase()
    );
    setTeamName(matched || null);
  };

  const handleSelect = (handle) => {
    setInputValue(handle);
    const matched = all.find((item) => item.handles === handle);
    setTeamName(matched || null);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName || !teamName.handles) {
      alert('Please select a valid user from the list');
      return;
    }

    onSubmit(teamName);
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={shouldExit ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex justify-center z-50"
    >
      <form
        className="text-center space-y-4 flex flex-col justify-around place-items-center gap-5 pb-20"
        onSubmit={handleSubmit}
      >
        <img src={logo} className="w-8/12" alt="Creator Logo" />

        <div className="relative w-full max-w-lg">
          <span className="text-5xl font-bold text-center block">
            Hey Gemini, I am <br />
          </span>

          <input
            name="teamName"
            required
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your handle..."
            className="border p-4 mt-8 rounded-xl w-full bg-black border-black text-white"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay to allow click
          />

          {/* Suggestion box */}
          {showSuggestions && inputValue.length > 0 && (
            <div className="absolute w-full bg-black border-gray-300 rounded-md mt-1 z-50 max-h-60 overflow-y-auto shadow-lg">
              {all
                .filter(
                  (item) =>
                    typeof item.handles === 'string' &&
                    item.handles.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(item.handles)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-left text-white"
                  >
                    {item.handles}
                  </div>
                ))}
            </div>
          )}
        </div>

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
