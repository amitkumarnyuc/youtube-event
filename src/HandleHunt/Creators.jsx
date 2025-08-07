import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Buttons";
import back from "../assets/back.svg";
import home from "../assets/home.svg";
import Footer from "../components/ui/Footer";
import bg from '../assets/bg.png'
function Creator({ handleClick, data, handleBack, handleHome, Category }) {
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [visibleGrid, setVisibleGrid] = useState([]);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const previousGridRef = useRef([]);
  const timerRef = useRef(null);

  const MAX_GRID = 18;
  const SHUFFLE_PERCENT = 0.6; // 30%

  const getNewGrid = () => {
    if (!data || data.length === 0) return [];

    const placeholdersNeeded = Math.max(0, MAX_GRID - data.length);
    const realItems = [...data].sort(() => Math.random() - 0.5).slice(0, MAX_GRID);

    const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => ({
      handle: "",
      isPlaceholder: true,
      id: `placeholder-${i}`,
    }));

    const combined = [...realItems, ...placeholders].slice(0, MAX_GRID);

    return combined;
  };

  const shuffleGrid = (currentGrid) => {
    const numToShuffle = Math.floor(MAX_GRID * SHUFFLE_PERCENT);
    const indices = Array.from({ length: MAX_GRID }, (_, i) => i);
    const indicesToShuffle = [];

    // Choose unique random indices
    while (indicesToShuffle.length < numToShuffle) {
      const randIndex = Math.floor(Math.random() * indices.length);
      const idx = indices.splice(randIndex, 1)[0];
      indicesToShuffle.push(idx);
    }

    const newGrid = [...currentGrid];
    const shuffledItems = indicesToShuffle.map((i) => newGrid[i]);
    const shuffled = shuffledItems.sort(() => Math.random() - 0.5);

    indicesToShuffle.forEach((i, idx) => {
      newGrid[i] = shuffled[idx];
    });

    return { grid: newGrid, changedIndices: indicesToShuffle };
  };

  useEffect(() => {
    const initialGrid = getNewGrid();
    setVisibleGrid(initialGrid);
    previousGridRef.current = initialGrid;

    const interval = setInterval(() => {
      const { grid: newGrid, changedIndices } = shuffleGrid(previousGridRef.current);
      setVisibleGrid(newGrid);
      setShuffledIndices(changedIndices);
      previousGridRef.current = newGrid;
    }, 2500);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (selectedCreator) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSelectedCreator(null), 5000000);
    }
    return () => clearTimeout(timerRef.current);
  }, [selectedCreator]);

  return (
    <div className="flex flex-col p-4 sm:p-14 pt-18">
      <motion.div
        className="p-6 text-white min-h-screen mt-30"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center h-20 px-6 mb-32">
          <img src={back} alt="Back" className="h-24 cursor-pointer" onClick={handleBack} />
          <img src={home} alt="Home" className="h-24 cursor-pointer" onClick={handleHome} />
        </div>

        {/* Title */}
        <motion.h1
          className=" font-bold text-6xl mb-28 text-center text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Find your handle and tap to reveal your surprise
        </motion.h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-20">
          {visibleGrid.map((creator, index) => {
            const shouldAnimate = shuffledIndices.includes(index);

            return (
              <div key={index} className="flex items-center justify-center h-24 sm:h-28 bg-transparent">
                <AnimatePresence mode="popLayout">
                  {creator && (
                    <motion.div
                      key={creator.id || creator.handle || index}
                      initial={shouldAnimate ? { opacity: 0, scale: 0 } : false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-full px-2"
                    >
                      <Button
                        onClick={() => {
                          if (!creator.isPlaceholder) {
                            setSelectedCreator(creator);
                          }
                        }}
                        disabled={creator.isPlaceholder}
                        className={`w-full h-20 transition duration-200 text-2xl whitespace-normal break-words text-center px-2 font-semibold ${
                          creator.isPlaceholder
                            ? "display-none"
                            : "bg-black text-white hover:bg-opacity-100 bg-opacity-90"
                        }`}
                      >
                        {creator.isPlaceholder ? "‎" : creator.handle}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCreator && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-gradient-to-b from-black/70 via-black/60 to-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

             style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
          >
            <div className="relative bg-transparent w-full h-full flex flex-col items-center space-y-20 p-4 pt-16">
              <button
                onClick={() => setSelectedCreator(null)}
                className="absolute top-0 right-3 text-white text-6xl font-bold z-50"
              >
                &times;
              </button>

              <img
                src={selectedCreator.banner}
                alt="Channel Art"
                className="w-full rounded-xl shadow-md m-2"
              />

              <h3 className="text-white font-semibold text-justify text-2xl">
                Prompt:
                <br />
                Create a fun channel drawing art image for my YouTube channel in 2560x1440, 16:9 dimension about{" "}
                {Category}, hosted by {selectedCreator.fullName}. The overall vibe should be happy.
              </h3>

              <img src={selectedCreator.qr} alt="QR Code" className="w-6/12 mt-12 mb-12" />

              <p className="text-white font-semibold text-center text-4xl">
                Scan the QR code to download your channel art.
              </p>
            </div>
        
          </motion.div>
        )}
      </AnimatePresence>

    
    </div>
  );
}

export default Creator;
