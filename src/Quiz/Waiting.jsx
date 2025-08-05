import { Button } from "../components/ui/Buttons";
import { motion } from "framer-motion";
import gemini from '../assets/Gemini_LogoPNG.png';
import logo from '../assets/creator-logo.svg';
import bg from '../assets/bg.png'
import btn from '../assets/btn.svg'
export const Waiting = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
   style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    className="absolute inset-0 flex flex-1 flex-col items-center justify-center z-50 text-center gap-20 bg-white"
  >
    <img src={logo} className="w-60 mb-20" alt="Creator Logo" />
      <h1 className="text-5xl font-extrabold uppercase">Great!</h1>
       <h1 className="text-5xl font-extrabold">QUIZ WILL START SHORTLY!</h1>
    

  </motion.div>
);
