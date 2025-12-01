import { TextAlignJustify } from 'lucide-react'
import React from 'react'

export default function Header({ onToggleMenu }) {
  return (
    <div className='px-2 md:px-10 flex items-center justify-between py-2 fixed top-0 left-0 right-0 bg-white z-20'>
      <TextAlignJustify 
        className='text-gray-600 cursor-pointer' 
        onClick={onToggleMenu}
      />
      
      <img 
        src="/blackLogo.png" 
        alt="Logo" 
        className='object-cover w-[50%] md:w-[35%] lg:w-[25%]'
      />

      <div className="w-6" /> {/* right placeholder */}
    </div>
  )
}
