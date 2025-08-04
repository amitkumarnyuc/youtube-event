import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Buttons' // adjust the path as needed
import { categories } from '../utils'


function Category({ handleClick , data}) {

  return (
    <div className='flex flex-col p-14'>
    <motion.div
      className="p-6 text-white min-h-screen mt-10"
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
      <motion.h1
        className="uppercase font-bold text-4xl mb-6 text-center text-black"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Select your Category
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {data.map((category, index) => (
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
                onClick={handleClick}
                className="w-full bg-black bg-opacity-90 text-white hover:bg-opacity-100 transition duration-200 font-semibold h-14"
              >
                 {category}
              </Button>
            </motion.div>

        ))}
      </div>
    </motion.div>
    </div>
  )
}

export default Category
