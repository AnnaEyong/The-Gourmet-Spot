import { useStoreCart } from '@/store/cart.store'
import { useStoreFavorite } from '@/store/favorite.store'
import { ChefHat, Heart, House, ListOrdered, ShoppingCart, UserRound } from 'lucide-react'
import React from 'react'
import Link from 'next/link'; 

export default function Navbar({ menuOpen }) {

  const { selectedFavoriteIds } = useStoreFavorite()
  const favoriteSize = selectedFavoriteIds.length
    
  const { selectedAddedIds } = useStoreCart()
  const cartSize = selectedAddedIds.length


  return (
    <div
      className={`
        fixed bottom-5 left-6 z-20
        bg-[#7c0505] text-white
        flex items-center justify-between
        transition-all duration-300 ease-out
        overflow-hidden
        ${menuOpen 
          ? 'w-[calc(100%-3rem)] left-6 right-6 rounded-full px-4 py-4' 
          : 'w-14 h-14 rounded-full justify-center'
        }
      `}
    >
      {/* FIRST ICON (always visible) */}
      {!menuOpen && <ChefHat strokeWidth={1.2} size={25}/>}

      {/* When expanded, show the rest */}
      {menuOpen && (
        <div className="flex justify-between flex-1">
          <Link href='/'>
            <House strokeWidth={1.2} size={25} />
          </Link>

          <Link href='/favorites' className="relative">
            <Heart strokeWidth={1.2} size={25}/>
            <span className='bg-gray-50 text-black text-[.55rem] absolute w-3.5 h-3.5 flex items-center justify-center top-0.5 -right-1 rounded-full'>
              {favoriteSize}
            </span>
          </Link>
          
          <Link href='/cart' className="relative">
            <ShoppingCart strokeWidth={1.2} size={25} />
            <span className='bg-gray-50 text-black text-[.55rem] absolute w-3.5 h-3.5 flex items-center justify-center top-0.5 -right-1 rounded-full'>
              {cartSize}
            </span>
          </Link>

          <Link href='/orders'>
            <ListOrdered strokeWidth={1.2} size={25} />
          </Link>
        </div>
      )}
    </div>
  )
}
