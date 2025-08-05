import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Buttons'
import back from '../assets/back.svg'
import home from '../assets/home.svg'
function Creator({ handleClick, data , handleBack, handleHome, Category}) {
  const [selectedCreator, setSelectedCreator] = useState(null)
  const timerRef = useRef(null)

  const fullRows = Math.floor(data.length / 3)
  const remainder = data.length % 3

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

               <div className="w-full flex justify-between items-center h-20 px-6 mb-32">
  <img src={back} alt="Back" className="h-24 cursor-pointer" onClick={handleBack} />
  <img src={home} alt="Home" className="h-24 cursor-pointer" onClick={handleHome}/>
</div>
        <motion.h1
          className="uppercase font-bold text-6xl mb-20 text-center text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Find your handle and tap to reveal your surprise
          <br></br>
        </motion.h1>

        <motion.h1 className=" font-bold text-3xl mb-20 text-center text-black">
           {Category}
        </motion.h1>

        <div className="flex flex-col gap-y-20 mt-10"  style={{height:"1090px", overflow:"scroll"}}>
          {/* Full rows (3 items) */}
          {Array.from({ length: fullRows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6"
            >
              {data
                .slice(rowIndex * 3, rowIndex * 3 + 3)
                .map((creator, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex justify-center"
                    
                  >
                    <Button
                      onClick={() => setSelectedCreator(creator)}
                      className="w-full bg-black bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold h-20 text-xl"
                    >
                      {creator.handle}
                    </Button>
                  </motion.div>
                ))}
            </div>
          ))}

          {/* Last row (1–2 items, centered) */}
          {remainder > 0 && (
            <div className="flex justify-center gap-x-6">
              {data.slice(-remainder).map((creator, index) => (
                <motion.div
                  key={`remainder-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full md:w-1/3 flex justify-center"
                >
                  <Button
                    onClick={() => setSelectedCreator(creator)}
                    className="w-full bg-black bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold h-20 text-xl"
                  >
                    {creator.handle}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
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
                className="absolute top-0 right-3 text-white text-3xl font-bold z-50"
              >
                &times;
              </button>

              {/* Channel Art Image */}
              <img
                src="https://firebasestorage.googleapis.com/v0/b/gemini-17e87.firebasestorage.app/o/mrtsgujarati07%20(Shailesh%20Zala)%2Fmrtsgujarati07.jpeg?alt=media&token=5e075d5e-3e1c-4b24-b767-f4298674991b"
                alt="Channel Art"
                className="w-full rounded-xl shadow-md m-2"
              />

              {/* QR Code */}
              <img
                src="https://firebasestorage.googleapis.com/v0/b/gemini-17e87.firebasestorage.app/o/mrtsgujarati07%20(Shailesh%20Zala)%2FShailesh%20Zala.png?alt=media&token=c0393a12-a7b3-455f-9c3f-345407b21b37"
                alt="QR Code"
                className="w-6/12 mt-12 mb-12"
              />

              <p className="text-white font-semibold text-center text-5xl">
                Scan the QR code to download your channel art.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Creator
