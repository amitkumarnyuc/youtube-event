import { Button } from "../components/ui/Buttons";
import { motion } from "framer-motion";
import gemini from '../assets/Gemini_LogoPNG.png';
import logo from '../assets/creator-logo.svg';
import bg from '../assets/bg.png'
import btn from '../assets/btn.svg'
import Footer from "../components/ui/Footer";
export const QuizStart = ({ onStart }) => (
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
    className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center gap-28 bg-white"
  >
    <img src={logo} className="w-4/12" alt="Creator Logo" />
    <img src={gemini} className="w-10/12" alt="Gemini Logo" />
    <Button
  onClick={onStart}
  className="text-white px-6 py-2 hover:opacity-80 transition text-4xl font-bold"
  style={{
    backgroundImage: `url(${btn})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '200px',
    height: '110px',
  }}
>
  Start
</Button>
<Footer/>
  </motion.div>
);
