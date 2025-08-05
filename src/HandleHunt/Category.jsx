import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Buttons';
import back from '../assets/back.svg'
import home from '../assets/home.svg'
function Category({ handleClick, data, handleBack, handleHome }) {
  const fullRows = Math.floor(data.length / 3);
  const remainder = data.length % 3;

  return (
    <div className="flex flex-col p-14 pt-30">
      <motion.div
        className="p-6 text-white min-h-screen "
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
  <img src={back} alt="Back" className="h-24 cursor-pointer" onClick={handleBack}/>
  <img src={home} alt="Home" className="h-24 cursor-pointer" onClick={handleHome}/>
</div>

        <motion.h1
          className="uppercase font-bold text-6xl mb-28 text-center text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Select your Category
        </motion.h1>

        <div className="flex flex-col gap-y-20 mt-10">
          {/* Full rows (3 buttons per row) */}
          {Array.from({ length: fullRows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6">
              {data
                .slice(rowIndex * 3, rowIndex * 3 + 3)
                .map((category, index) => (
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
                      onClick={()=>handleClick(category)}
                      className="w-full bg-black bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold h-20 text-xl"
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
            </div>
          ))}

          {/* Last row (1 or 2 buttons) centered */}
          {remainder > 0 && (
            <div className="flex justify-center gap-x-6">
              {data.slice(-remainder).map((category, index) => (
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
                    onClick={handleClick}
                    className="w-full bg-black bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold h-20 text-xl"
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Category;
