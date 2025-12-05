import { TextAlignJustify } from 'lucide-react'
import React from 'react'
import { ModeToggle } from '../ModeToggle'
import { useEffect, useState } from "react";


export default function Header({ onToggleMenu }) {
    const [isDark, setIsDark] = useState(false);

      useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(match.matches);

    const listener = (e) => setIsDark(e.matches);
    match.addEventListener("change", listener);

    return () => match.removeEventListener("change", listener);
  }, []);

  return (
    <div className='px-3 md:px-10 flex items-center justify-between py-2 fixed top-0 left-0 right-0 bg-white dark:bg-black z-20'>
      <TextAlignJustify 
        className='text-gray-600 dark:text-white cursor-pointer' 
        onClick={onToggleMenu}
      />
      
      {/* <img 
        src="/blackLogo.png" 
        alt="Logo" 
        className='object-cover w-[50%] md:w-[35%] lg:w-[25%] '
      /> */}

      {/* <img 
      src={isDark ? "/blackLogo.png" : "/logo.png"}
      alt="Theme Image"
      className={'object-cover w-[50%] md:w-[35%] lg:w-[25%] '}
    /> */}

    {isDark ? 
    <img 
        src="/logo.png" 
        alt="Logo" 
        className='object-cover w-[50%] md:w-[35%] lg:w-[25%] '
      /> : 
      <img src="/blackLogo.png" alt="Logo" className='splash-logo'/>}

      <ModeToggle/>
    </div>
  )
}



// export default function DarkLightImage() {




//   return (
    
//   );
// }