'use client'
import MenuCard from '@/components/menuCard/MenuCard'
import { useStoreCart } from '@/store/cart.store'
import { useStoreFavorite } from '@/store/favorite.store'
import { Dishes, Types } from '@/utils/data'
import { Heart, House, Search, ShoppingCart, UserRound } from 'lucide-react'
import React, { useState, useEffect } from 'react'

export default function Page() {
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
    const fadeTimer = setTimeout(() => setAnimateOut(true), 2500) // start animation
    const hideTimer = setTimeout(() => setShowSplash(false), 3000) // remove splash
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
    <div className='px-2 md:px-10 pb-28 relative'>
      <section className='w-full h-[35vh] overflow-hidden rounded-2xl relative'>
        <img src="/menu2.jpg" alt="Menu" className="mx-auto md:flex hidden w-full h-full object-cover"/>
        <img src="/menu.jpg" alt="Menu" className="mx-auto flex md:hidden w-full h-full object-cover rounded-2xl"/>
        <div className="absolute top-0 bg-black/20 w-full h-full rounded-2xl"></div>
        <img src="/poster.png" alt="Poster" className="absolute left-0 top-5 z-5 mx-auto w-[60%] h-[85%] object-cover "/>
      </section>

      {/* FILTER */}
      <section className='px:[3%] md:px-[5%] py-3 flex overflow-x-auto'>
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
      <div className='flex gap-2 lg:hidden justify-between items-center mb-2 bg-gray-200 rounded-full pr-2 pl-4 py-2 w-full m-auto'>
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

      <section className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3'>
        {searchResult.map((item) => (
          <MenuCard key={item.id} dish={item} />
        ))}
      </section>

      <div className='fixed left-[2%] right-[2%] bottom-6 rounded-full bg-[#7c0505] px-10 py-6 flex justify-between text-white z-10'>
        <House strokeWidth={1.2} size={25} />
        <div className='relative'>
          <ShoppingCart strokeWidth={1.2} size={25} />
          <p className='bg-[#f7b302] flex items-center justify-center text-[.55rem] absolute w-3.5 h-3.5 top-0.5 -right-1 rounded-full'>{cartSize}</p>
        </div>
        <div className='relative'>
          <Heart strokeWidth={1.2} size={25}/>
          <p className='bg-[#f7b302] flex items-center justify-center text-[.55rem] absolute w-3.5 h-3.5 top-0.5 -right-1 rounded-full'>{favoriteSize}</p>
        </div>
        <UserRound strokeWidth={1.2} size={25} />
      </div>
    </div>
  )
}
