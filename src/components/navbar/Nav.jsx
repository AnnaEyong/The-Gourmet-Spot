import Link from 'next/link'
import React from 'react'
import LogoutButton from '../LogoutButton'

export default function Nav() {
  return (
    <div className='fixed top-0 left-0 right-0 z-5 flex items-center justify-between px-[10%] py-3 bg-white shadow-md'>
      <img 
        src="/blackLogo.png" 
        alt="Logo" 
        className='object-cover w-[100px] md:w-[150px]'
      />

      <div className='flex items-center gap-6 text-md'>
        <Link href="/" className='block'>Home</Link>
        <Link href="/favorites" className='block'>Favorites</Link>
        <Link href="/cart" className='block'>Cart</Link>
        <Link href="/kitchenDashboard" className='block'>Kitchen</Link>
        <Link href="/orders" className='block'>Orders</Link>
      </div>

      <LogoutButton />
    </div>
  )
}
