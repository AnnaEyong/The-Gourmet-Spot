import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-card dark:text-gray-300 text-black mt-16 border-t ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div className='border-r'>
          <h2 className="text-xl font-bold dark:text-white text-black mb-2">
            The Gourmet Spot
          </h2>
          <p className="text-sm text-gray-400">
            Delicious meals, freshly prepared and served with love.
          </p>
        </div>

        {/* OPENING HOURS */}
        <div>
          <h3 className="text-black dark:text-white font-semibold mb-2">Opening Hours</h3>
          <p className="text-sm">Mon - Fri: 9am – 10pm</p>
          <p className="text-sm">Sat - Sun: 10am – 11pm</p>
        </div>

        {/* NAV LINKS */}
        <div className='flex flex-col border-r'>
          <h3 className="text-black dark:text-white font-semibold mb-2">Nav Links</h3>
          <Link href='/favorites' className=' text-sm hover:text-[#7c0505] transition'>Favorites</Link>
          <Link href='/cart' className=' text-sm hover:text-[#7c0505] transition'>Cart</Link>
          <Link href='/orders' className=' text-sm hover:text-[#7c0505] transition'>Order</Link>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-black dark:text-white font-semibold mb-2">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            <a href="/login" className="hover:text-[#7c0505] transition">
              Staff Login
            </a>
            <a href="/admin" className="hover:text-[#7c0505] transition">
              Admin
            </a>
            <a href="/kitchenDashboard" className="hover:text-[#7c0505] transition">
              Kitchen
            </a>
          </div>
        </div>

      </div>

      <div className="border-t py-4 text-center text-sm text-gray-500 dark:text-white">
        © {new Date().getFullYear()} The Gourmet Spot. All rights reserved.
      </div>
    </footer>
  )
}

