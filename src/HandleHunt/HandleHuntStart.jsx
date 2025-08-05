import React from 'react'
import logo from '../assets/creator-logo.svg'
import btn from '../assets/btn.svg'
import { Button } from '../components/ui/Buttons'

function HandleHuntStart({handleClick}) {


  return (
    <div className='flex flex-col justify-around items-center gap-4 h-screen pb-96'>
       <img src={logo} className="w-6/12" alt="Creator Logo" />
       <h1 className="text-8xl font-bold uppercase">Handle Hunt</h1>

         <Button 
         onClick={handleClick}
         className="px-4 py-2 text-white text-5xl uppercase font-bold" 
         style={{ 
          backgroundImage: `url(${btn})`, 
          backgroundSize: '100% 100%', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center', 
          width:'50%',
          height: '160px' }}>Start</Button>
              
    </div>
  )
}

export default HandleHuntStart