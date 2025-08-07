import { Button } from "../components/ui/Buttons";
import { motion } from "framer-motion";
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
    className="absolute inset-0 flex flex-col items-center z-50 p-10 place-content-around "
  >
    <img src={logo} className="w-6/12" alt="Creator Logo" />
    <div className="flex justify-center items-center gap-20 flex-col">
          <h1 className="text-5xl text-center font-bold uppercase">Chaatbot</h1>
    <h1 className="text-5xl text-center ">Let your taste and mood decide your perfect chaat!</h1>
    </div>
    
    <Button
  onClick={onStart}
  className="text-white px-6 py-2 hover:opacity-80 transition font-bold text-3xl"
  style={{
    backgroundImage: `url(${btn})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width:'150px',
    height:'203px'
  }}
>
  Start
</Button>

  </motion.div>
);
