import { useStoreCart } from "@/store/cart.store";
import { useStoreFavorite } from "@/store/favorite.store";
import { Heart, ShoppingCart } from "lucide-react";
import { FaHeart } from "react-icons/fa";

export default function MenuCard({ dish }) {

  const { selectedFavoriteIds, toggleHeartIcon} = useStoreFavorite()
    let isSelected =  selectedFavoriteIds.includes(dish.id)

     const { selectedAddedIds, toggleCartIcon} = useStoreCart()
    let isAdded =  selectedAddedIds.includes(dish.id)

  return (
    <section className="relative">
    <div className=" bg-white dark:bg-transparent dark:border-white/10 shadow-md overflow-hidden border border-gray-200 p-2 md:p-3 rounded-2xl dark:text-white">
      <div className="relative w-full h-40 ">
          <img 
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute top-0 bg-black/10 w-full h-full rounded-2xl"></div>
      </div>

      <div className="pt-4">
          <h2 className="text-[.9rem] md:text-[1.2rem] font-semibold">
            {dish.name.length > 20 ? dish.name.slice(0, 20) + "…" : dish.name}
          </h2>
          <div className="flex items-center justify-between">
          <p className="text-gray-500 text-[.9rem] md:text-[1.2rem]">{dish.category}</p>
          <p className="text-[13px] text-green-500">{dish.prepTime} mins</p>
          </div>
        
        <div className="flex justify-between items-center pb-1.5">
            <p className="mt-2 md:text-[1.2rem] font-medium">${dish.price}</p>
            {/* <ShoppingCart size={20} className="text-gray-600" /> */}
            {isAdded ? <ShoppingCart onClick={() => toggleCartIcon(dish.id)} className=' cursor-pointer text-[1rem] text-[#f7b302]' /> : <ShoppingCart size={21} onClick={() => toggleCartIcon(dish.id)} className=' text-gray-600 cursor-pointer' />}
        </div>
      </div>

    </div>

      {isSelected ? <FaHeart onClick={() => toggleHeartIcon(dish.id)} color='red' className='absolute right-5 top-5 z-5 text-white cursor-pointer text-[1.4rem] md:text-[2rem]' /> : <Heart strokeWidth={1.5} size={26} onClick={() => toggleHeartIcon(dish.id)} className='absolute right-5 top-5 text-white z-5 cursor-pointer text-[6rem] md:text-[6rem]' />}
      {/* <Heart strokeWidth={1.2} size={25} className="absolute right-5 top-5 text-white z-5" /> */}
    </section>
    
  );
}
