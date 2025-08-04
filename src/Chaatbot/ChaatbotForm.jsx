import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Button } from '../components/ui/Buttons';
import btn from '../assets/btn.svg'
import logo from '../assets/creator-logo.svg'
function ChaatbotForm({ onSubmit, shouldExit , setTeamName, teamName}) {
  

  const handleTeamName = (e) => {
    setTeamName({name:e.target.value});
  }
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={shouldExit ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex  justify-center z-50"
    >
<form className="text-center space-y-4 flex flex-col justify-around place-items-center gap-5 p-10"

 onSubmit={(e) => {
    e.preventDefault(); // Prevent full-page reload
    if (teamName.name.trim() !== '') {
      onSubmit(); // Only call onSubmit if teamName is not empty
    }
  }}>
       <img src={logo} className="w-56" alt="Creator Logo" />

  <span className='text-2xl font-bold text-left'>
     Hey Gemini, I<input
    name="teamName"
    required
    value={teamName.name}
    onChange={handleTeamName}
    className="border ml-2 mr-2  p-1 pt-4 pb-4 rounded-xl w-full max-w-xs bg-black border-black text-white"
  />am
  </span>
 

  <Button
    type="submit"  // ✅ Submit form via button
    className="text-white py-2 hover:opacity-80 transition w-6/12 "
    style={{
      backgroundImage: `url(${btn})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height:'60px'
    }}
  >
    CONTINUE
  </Button>
</form>


    
    </motion.div>
  );
}

export default ChaatbotForm;
