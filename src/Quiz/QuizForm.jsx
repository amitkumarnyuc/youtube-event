import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Button } from '../components/ui/Buttons';
import btn from '../assets/btn.svg'

function QuizForm({ onSubmit, shouldExit , setTeamName, teamName}) {
  

  const handleTeamName = (e) => {
    setTeamName(e.target.value);
  }
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={shouldExit ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex items-center justify-center z-50"
    >
<div className="text-center space-y-4 flex flex-col justify-center place-items-center gap-5">
        <h1 className="text-3xl font-bold uppercase">Hey Creators!</h1>
        <h2 className="text-3xl font-bold uppercase m-4">Please enter your team's <br></br>name to begin.</h2>
<form
  onSubmit={(e) => {
    e.preventDefault(); // Prevent full-page reload
    if (teamName.trim() !== '') {
      onSubmit(); // Only call onSubmit if teamName is not empty
    }
  }}
>
  <input
    name="teamName"
    required
    value={teamName}
    onChange={handleTeamName}
    className="border p-2 pt-4 pb-4 mb-8 rounded-xl w-full max-w-md bg-black border-black text-white"
  />

  <Button
    type="submit"  // ✅ Submit form via button
    className="text-white py-2 hover:opacity-80 transition"
    style={{
      backgroundImage: `url(${btn})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width:'150px',
    height:'63px'
    }}
  >
    Start
  </Button>
</form>


      </div>
    </motion.div>
  );
}

export default QuizForm;
