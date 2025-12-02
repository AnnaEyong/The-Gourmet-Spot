'use client'
import Header from '@/components/header/Header'
import MenuCard from '@/components/menuCard/MenuCard'
import Navbar from '@/components/navbar/Navbar'
import { useStoreCart } from '@/store/cart.store'
import { useStoreFavorite } from '@/store/favorite.store'
import { Dishes, Types } from '@/utils/data'
import { Heart, House, Search, ShoppingCart, UserRound } from 'lucide-react'
import React, { useState, useEffect } from 'react'

export default function Page() {

  // 🔥 MENU STATE (THE MAGIC)
  const [menuOpen, setMenuOpen] = useState(false)


  const [searchTerm, setSearchTerm] = useState('')
  let searchResult = searchTerm.length > 0 
    ? Dishes?.filter(dish => dish?.name?.toLowerCase().includes(searchTerm.toLowerCase())) 
    : Dishes;

  const [selectedType, setSelectedType] = useState(null)
  const filteredItems = selectedType 
    ? searchResult.filter(item => item?.category?.toLowerCase() === selectedType.toLowerCase()) 
    : searchResult;
  searchResult = filteredItems;

  const { selectedFavoriteIds } = useStoreFavorite()
  const favoriteSize = selectedFavoriteIds.length

  const { selectedAddedIds } = useStoreCart()
  const cartSize = selectedAddedIds.length

  
  // SPLASH SCREEN STATES
  const [showSplash, setShowSplash] = useState(true)
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setAnimateOut(true), 1500)
    const hideTimer = setTimeout(() => setShowSplash(false), 2000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (showSplash) {
    return (
      <div className={`splash ${animateOut ? 'splash-animate-out' : ''}`}>
        <img src="/logo.png" alt="Logo" className='splash-logo'/>
      </div>
    )
  }

  return (
    <main className='bg-white dark:bg-[#1a1a1a] px-2 md:px-10'>

      {/* Header gets toggle function */}
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />

      <div className='pt-16 md:pt-23 lg:pt-20 pb-28 relative'>

        {/* HERO IMAGE */}
        <section className='w-full h-[35vh] lg:h-[48vh] overflow-hidden rounded-2xl relative'>
          <img src="/menu2.jpg" alt="Menu" className="mx-auto md:flex hidden w-full h-full object-cover"/>
          <img src="/menu.jpg" alt="Menu" className="mx-auto flex md:hidden w-full h-full object-cover rounded-2xl"/>
          <div className="absolute top-0 bg-black/20 w-full h-full rounded-2xl"></div>
          <img src="/poster.png" alt="Poster" className="absolute left-0 top-3 md:top-5 z-5 -ml-12 md:-ml-25 h-full object-cover "/>
        </section>

        {/* FILTER */}
        <section className='py-3 flex overflow-x-auto'>
          <div className='flex justify-between gap-1.5 py-1.5 px-2 rounded-lg'>
            <button 
              onClick={() => setSelectedType(null)} 
              className='bg-gray-200 text-gray-700 flex gap-2 items-center justify-center py-2 px-5 text-[.8rem] cursor-pointer rounded-full hover:bg-[#7c0505] hover:text-white focus:bg-[#7c0505] focus:text-white duration-400 ease-in-out' 
              id='all'
            >
              All
            </button>
            {Types.map((item) => 
              <button 
                onClick={() => setSelectedType(item.type)} 
                key={item.id} 
                className='bg-gray-200 inline-block whitespace-nowrap text-gray-700 gap-2 items-center justify-center py-2 px-5 text-[.8rem] cursor-pointer rounded-full hover:bg-[#7c0505] hover:text-white focus:bg-[#7c0505] focus:text-white duration-300 ease-in-out'
              > 
                {item.type}
              </button>
            )}
          </div>
        </section>

        {/* SEARCH */}
        <div className='flex gap-2 lg:hidden justify-between items-center mb-2 dark:text-white bg-gray-200 dark:bg-[#1a1a1a] dark:border border-white/10 rounded-full pr-2 pl-4 py-2 w-full m-auto'>
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            type='text' 
            placeholder='Search what you want' 
            className='text-[.9rem] outline-0 w-full'
          />
          <div className='flex items-center justify-center bg-[#7c0505] text-white w-7 h-7 rounded-full cursor-pointer'>
            <Search size={16}/>
          </div>
        </div>

        {/* DISHES */}
        <section className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-3'>
          {searchResult.map((item) => (
            <MenuCard key={item.id} dish={item} />
          ))}
        </section>

        {/* Navbar gets menu state */}
        <Navbar
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
        />

      </div>
    </main>
  )
}
