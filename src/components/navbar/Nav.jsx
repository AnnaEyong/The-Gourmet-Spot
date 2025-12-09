import Link from 'next/link'
import React from 'react'
import LogoutButton from '../LogoutButton'
import { ModeToggle } from '../ModeToggle'
import { useEffect, useState } from "react";

export default function Nav() {
  const [isDark, setIsDark] = useState(false);
  
        useEffect(() => {
      const match = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(match.matches);
  
      const listener = (e) => setIsDark(e.matches);
      match.addEventListener("change", listener);
  
      return () => match.removeEventListener("change", listener);
    }, []);

  return (
    <div className='fixed top-0 left-0 right-0 z-5 flex items-center justify-between px-10 py-3 bg-white dark:bg-black dark:text-white shadow-md dark:border border-gray-900'>
      {isDark ? 
    <img 
        src="/logo.png" 
        alt="Logo" 
        className='object-cover w-[30%] md:w-[20%] lg:w-[12%]'
      /> : 
      <img src="/blackLogo.png" alt="Logo" className='object-cover w-[30%] md:w-[20%] lg:w-[12%]'/>}

      <div className='flex items-center gap-6 text-md'>
        <Link href="/" className='block'>Home</Link>
        <Link href="/favorites" className='block'>Favorites</Link>
        <Link href="/cart" className='block'>Cart</Link>
        <Link href="/kitchenDashboard" className='block'>Kitchen</Link>
        <Link href="/orders" className='block'>Orders</Link>
      </div>

    <div className='flex gap-2'>
      <ModeToggle />
      <LogoutButton />
    </div>
      
    </div>
  )
}
