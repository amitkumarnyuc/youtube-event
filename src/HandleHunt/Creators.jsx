import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Buttons'
import back from '../assets/back.svg'
import home from '../assets/home.svg'
import Footer from '../components/ui/Footer'

function Creator({ handleClick, data, handleBack, handleHome, Category }) {
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [visibleCreators, setVisibleCreators] = useState([])
  const timerRef = useRef(null)

  useEffect(() => {
    // Refresh visible creators every 2 seconds
    const interval = setInterval(() => {
      const shuffled = [...data].sort(() => 0.5 - Math.random())
      setVisibleCreators(shuffled.slice(0, 7))
    }, 2000)

    return () => clearInterval(interval)
  }, [data])

  useEffect(() => {
    if (selectedCreator) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setSelectedCreator(null)
      }, 300000) // 5 minutes
      return () => clearTimeout(timerRef.current)
    }
  }, [selectedCreator])

  return (
    <div className="flex flex-col p-14 pt-18">
      <motion.div
        className="p-6 text-white min-h-screen mt-30"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {/* Top navigation */}
        <div className="w-full flex justify-between items-center h-20 px-6 mb-32">
          <img src={back} alt="Back" className="h-24 cursor-pointer" onClick={handleBack} />
          <img src={home} alt="Home" className="h-24 cursor-pointer" onClick={handleHome} />
        </div>

        {/* Headings */}
        <motion.h1
          className="uppercase font-bold text-6xl mb-20 text-center text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Find your handle and tap to reveal your surprise
        </motion.h1>

        <motion.h1 className="font-bold text-3xl mb-20 text-center text-black">
          {Category}
        </motion.h1>

        {/* Game Area */}
        <div
          className="relative w-full mt-10"
          style={{ height: '1090px', overflow: 'hidden', position: 'relative' }}
        >
          <AnimatePresence>
            {visibleCreators.map((creator) => {
              const top = Math.floor(Math.random() * (1090 - 80)) // 80 = button height buffer
              const left = Math.floor(Math.random() * (window.innerWidth - 320)) // 320 = estimated button width buffer

              return (
                <motion.div
                  key={creator.handle}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: top,
                    left: left,
                    width: '300px',
                  }}
                >
                  <Button
                    onClick={() => setSelectedCreator(creator)}
                    className="w-full bg-black bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold h-20 text-2xl"
                  >
                    {creator.handle}
                  </Button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Overlay Modal */}
      <AnimatePresence>
        {selectedCreator && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-gradient-to-b from-black/70 via-black/60 to-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative bg-transparent w-full h-full flex flex-col items-center space-y-20 p-4 pt-16">
              {/* Close Button */}
              <button
                onClick={() => setSelectedCreator(null)}
                className="absolute top-0 right-3 text-white text-8xl font-bold z-50"
              >
                &times;
              </button>

              {/* Channel Art Image */}
              <img
                src={selectedCreator.banner}
                alt="Channel Art"
                className="w-full rounded-xl shadow-md m-2"
              />

              <h3 className="text-white font-semibold text-left text-2xl ">
                Create a fun channel drawing art image for my YouTube channel in 2560p X 1440P,
                16:9 dimension about {Category}, hosted by {selectedCreator.fullName}. The overall
                vibe should be happy.
              </h3>

              {/* QR Code */}
              <img src={selectedCreator.qr} alt="QR Code" className="w-6/12 mt-12 mb-12" />

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
