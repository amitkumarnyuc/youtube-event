import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Buttons'
import back from '../assets/back.svg'
import home from '../assets/home.svg'
import Footer from '../components/ui/Footer'

function Creator({ handleClick, data, handleBack, handleHome, Category }) {
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [visibleGrid, setVisibleGrid] = useState(Array(18).fill(null))
  const timerRef = useRef(null)

  // Shuffle 6 creators into 18 grid slots randomly
  const shuffleGrid = () => {
    const newGrid = Array(18).fill(null)
    const shuffledCreators = [...data].sort(() => 0.5 - Math.random()).slice(0, 6)
    const gridIndexes = Array.from({ length: 18 }, (_, i) => i).sort(() => 0.5 - Math.random())

    for (let i = 0; i < shuffledCreators.length; i++) {
      newGrid[gridIndexes[i]] = shuffledCreators[i]
    }
    setVisibleGrid(newGrid)
  }

  useEffect(() => {
    shuffleGrid()
    const interval = setInterval(shuffleGrid, 2000) // reshuffle every 2s
    return () => clearInterval(interval)
  }, [data])

  useEffect(() => {
    if (selectedCreator) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setSelectedCreator(null), 5000000)
    }
    return () => clearTimeout(timerRef.current)
  }, [selectedCreator])

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
        <div className="w-full flex justify-between items-center h-20 px-6 mb-12">
          <img src={back} alt="Back" className="h-16 sm:h-24 cursor-pointer" onClick={handleBack} />
          <img src={home} alt="Home" className="h-16 sm:h-24 cursor-pointer" onClick={handleHome} />
        </div>

        {/* Title */}
        <motion.h1
          className="uppercase font-bold text-4xl sm:text-6xl mb-6 sm:mb-20 text-center text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Find your handle and tap to reveal your surprise
        </motion.h1>

        <motion.h1 className="font-bold text-xl sm:text-3xl mb-10 text-center text-black">
          {Category}
        </motion.h1>

        {/* 6x3 Grid */}
        <div className="grid grid-cols-3 grid-rows-6 gap-4 w-full max-w-[900px] mx-auto">
          {visibleGrid.map((creator, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-24 sm:h-28 bg-transparent"
            >
              <AnimatePresence mode="popLayout">
                {creator && (
                  <motion.div
                    key={creator.handle + index}
                    initial={{ opacity: 0, y: 30, scale: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 600,
                      damping: 25,
                      duration: 0.3,
                    }}
                    className="w-full px-2"
                  >
                    <Button
                      onClick={() => setSelectedCreator(creator)}
                      className="w-full bg-black h-20 bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold text-2xl sm:text-xl"
                    >
                      {creator.handle}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
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

              <h3 className="text-white font-semibold text-left text-2xl">
                Prompt:<br></br>
                Create a fun channel drawing art image for my YouTube channel in 2560x1440, 16:9 dimension about {Category}, hosted by {selectedCreator.fullName}. The overall vibe should be happy.
              </h3>

              <img
                src={selectedCreator.qr}
                alt="QR Code"
                className="w-6/12 mt-12 mb-12"
              />

              <p className="text-white font-semibold text-center text-4xl">
                Scan the QR code to download your channel art.
              </p>
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Creator
