'use client'
import { useStoreFavorite } from "@/store/favorite.store"
import { Dishes } from "@/utils/data"
import MenuCard from "@/components/menuCard/MenuCard"
import Header from "@/components/header/Header"
import Navbar from "@/components/navbar/Navbar"
import { useState } from "react"

export default function FavoritesPage() {
    // MENU STATE
    const [menuOpen, setMenuOpen] = useState(false);

  const { selectedFavoriteIds } = useStoreFavorite()

  const favoriteItems = Dishes.filter(dish =>
    selectedFavoriteIds.includes(dish.id)
  )

  return (
    <main className="px-4 py-6 h-fit bg-white">
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <h1 className="text-xl font-semibold mb-4 pt-14">Your Favorites</h1>

      {favoriteItems.length === 0 ? (
        <p className="text-gray-500">You haven’t added any favorites yet.</p>
      ) : (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {favoriteItems.map(item => (
            <MenuCard key={item.id} dish={item} />
          ))}
        </section>
      )}
      <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
    </main>
  )
}
