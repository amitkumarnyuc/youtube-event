import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HandleHuntStart from './HandleHuntStart'
import bg from '../assets/bg.png'
import Category from './Category'
import { categories, creators } from '../utils'
import Creator from './Creators'

function HandleHunt() {
  const [page, setPage] = useState(0)

  const handleClick = (page) => setPage(page)

  const variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  }

  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <AnimatePresence mode="wait">
        {page === 0 && (
          <motion.div
            key="start"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <HandleHuntStart handleClick={() => handleClick(1)} />
          </motion.div>
        )}

        {page === 1 && (
          <motion.div
            key="category"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Category handleClick={() => handleClick(2)} data={categories} />
          </motion.div>
        )}

        {page === 2 && (
          <motion.div
            key="creator"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Creator handleClick={() => handleClick(2)} data={creators} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HandleHunt
