import { Button } from "../components/ui/Buttons";
import { motion } from "framer-motion";
import gemini from '../assets/chaatbot.png';
import logo from '../assets/creator-logo.svg';
import bg from '../assets/bg2.png'
import btn from '../assets/btn.svg'
export const ChaatbotStart = ({ onStart }) => (
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
    className="absolute inset-0 flex flex-col items-center z-50 p-14 place-content-around"
  >
    <img src={logo} className="w-56" alt="Creator Logo" />
    <div className="flex justify-center items-center gap-14 flex-col">
      <img src={gemini} className="w-10/12" alt="Gemini Logo" />
    <h1 className="text-3xl text-center">Let your taste and mood decide your perfect chaat!</h1>
    </div>
    
    <Button
  onClick={onStart}
  className="text-white px-6 py-2 hover:opacity-80 transition "
  style={{
    backgroundImage: `url(${btn})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width:'100px',
    height:'53px'
  }}
>
  Start
</Button>

  </motion.div>
);
