// // 'use client'
// // import { useState } from "react";
// // import { X } from "lucide-react";

// // export default function CartCard({ dish, removeFromCart }) {
// //   const [quantity, setQuantity] = useState(dish.initialQuantity || 1);

// //   const increment = () => setQuantity(prev => prev + 1);
// //   const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

// //   return (
// //     <div className="flex gap-2 items-start bg-white p-2">
      
// //       {/* Column 1: Image - Fixed width and height applied here */}
// //       <div className="border w-sm border-black rounded-lg overflow-hidden">
// //         <img
// //           src={dish.image}
// //           alt={dish.name}
// //           className="object-cover rouded-lg" 
// //         />
// //       </div>

// //       {/* Column 2: Info + Quantity */}
// //       <div className="flex-grow flex flex-col justify-start pt-1">
// //         <div>
// //           <h2 className="text-base text-gray-900">{dish.name}</h2> 
// //           <p className="text-gray-500 text-sm mt-0.5">{dish.weightOrVolume}</p> 
// //           <p className="mt-1 font-medium text-base">{dish.price}</p> 
// //         </div>

//         // <div className="flex items-center gap-0 mt-2 w-max">
//         //   <button
//         //     onClick={decrement}
//         //     className="w-8 h-7 flex items-center justify-center border border-gray-300 text-red-600 font-normal text-xl leading-none rounded-l-md hover:bg-gray-50"
//         //   >
//         //     -
//         //   </button>
//         //   <div className="w-10 h-7 text-center text-sm flex items-center justify-center border-t border-b border-gray-300">
//         //     {quantity}
//         //   </div>
//         //   <button
//         //     onClick={increment}
//         //     className="w-8 h-7 flex items-center justify-center border border-gray-300 text-red-600 font-normal text-xl leading-none rounded-r-md hover:bg-gray-50"
//         //   >
//         //     +
//         //   </button>
//         // </div>
// //       </div>

// //       {/* Column 3: Remove icon */}
// //       <div className="flex-shrink-0 pt-1"> 
//         // <button 
//         //   onClick={() => removeFromCart(dish.id)}
//         //   className="text-gray-600 hover:text-gray-800"
//         // >
//         //   <X size={20} />
//         // </button>
// //       </div>
// //     </div>
// //   );
// // }

// import { useStoreCart } from "@/store/cart.store";
// import { useStoreFavorite } from "@/store/favorite.store";
// import { Heart, ShoppingCart, X } from "lucide-react";
// import { useState } from "react";
// import { FaHeart } from "react-icons/fa";

// export default function MenuCard({dish, removeFromCart }) {
//       const [quantity, setQuantity] = useState(dish.initialQuantity || 1);

//   const increment = () => setQuantity(prev => prev + 1);
//   const decrement = () => setQuantity(prev => Math.max(1, prev - 1));


//   const { selectedFavoriteIds, toggleHeartIcon} = useStoreFavorite()
//     let isSelected =  selectedFavoriteIds.includes(dish.id)

//      const { selectedAddedIds, toggleCartIcon} = useStoreCart()
//     let isAdded =  selectedAddedIds.includes(dish.id)

//   return (
//     <section className="relative pb-10">
//     <div className=" bg-white shadow-md overflow-hidden border border-gray-200 p-2 md:p-3 rounded-2xl">
//       <div className="relative w-full h-40 ">
//           <img 
//             src={dish.image}
//             alt={dish.name}
//             className="w-full h-full object-cover rounded-2xl"
//           />
//           <div className="absolute top-0 bg-black/10 w-full h-full rounded-2xl"></div>
//       </div>

//       <div className="pt-4">
//           <h2 className="text-[.9rem] md:text-[1.2rem] font-semibold">
//             {dish.name.length > 20 ? dish.name.slice(0, 20) + "…" : dish.name}
//           </h2>
//           <p className="text-gray-500 text-[.9rem] md:text-[1.2rem]">{dish.category}</p>
        
//         <div className="flex justify-between items-center pb-1.5">
//             <p className="mt-2 md:text-[1.2rem] font-medium">${dish.price}</p>
//             {/* <ShoppingCart size={20} className="text-gray-600" /> */}

//         <div className="flex items-center border-2 gap-2 mt-2 w-max text-[1.2rem]">
//           <button
//             onClick={decrement}
//             className="w-10 h-5 px-2 flex items-center justify-center border border-gray-300 text-red-600 font-normal text-xl leading-none rounded-l-md hover:bg-gray-50"
//           >
//             -
//           </button>
//           <div className="w-10 h-7 text-center text-sm flex items-center justify-center border-t border-b border-gray-300">
//             {quantity}
//           </div>
//           <button
//             onClick={increment}
//             className="w-10 h-5 px-2 flex items-center justify-center border border-gray-300 text-red-600 font-normal text-xl leading-none rounded-r-md hover:bg-gray-50"
//           >
//             +
//           </button>
//         </div>

//         <button 
//           onClick={() => removeFromCart(dish.id)}
//           className="text-gray-600 hover:text-gray-800"
//         >
//           <X size={20} />
//         </button>
//         </div>
//       </div>

//     </div>

//       {isSelected ? <FaHeart onClick={() => toggleHeartIcon(dish.id)} color='red' className='absolute right-5 top-5 z-5 text-white cursor-pointer text-[1.4rem] md:text-[2rem]' /> : <Heart strokeWidth={1.5} size={26} onClick={() => toggleHeartIcon(dish.id)} className='absolute right-5 top-5 text-white z-5 cursor-pointer text-[6rem] md:text-[6rem]' />}
//       {/* <Heart strokeWidth={1.2} size={25} className="absolute right-5 top-5 text-white z-5" /> */}
//     </section>
    
//   );
// }

'use client'
import { X } from "lucide-react"
import { useStoreCart } from "@/store/cart.store"

export default function CartCard({ dish }) {

  // const { toggleCartIcon, increaseQty, decreaseQty, quantities } = useStoreCart()
  
  // const qty = quantities[dish.id] || 1
  const { toggleCartIcon, increaseQty, decreaseQty, quantities } = useStoreCart();
const qty = quantities[dish.id] || 1; // no more error


  return (
    <div className="grid grid-cols-[150px_1fr_40px] gap-3 items-start bg-gray-50 border border-gray-300 rounded-2xl p-2 ">

      {/* === COL 1: IMAGE === */}
      <div className="w-full h-full rounded-xl overflow-hidden">
        <img 
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* === COL 2: DETAILS === */}
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-[1rem]">
          {dish.name}
        </h2>

        <p className="text-gray-500 text-[.85rem]">
          {dish.category}
        </p>

        <p className="text-[1rem] font-medium">
          ${dish.price}
        </p>

        {/* Quantity Controller */}
        <div className="flex items-center gap-3 mt-1">
          <button 
            onClick={() => decreaseQty(dish.id)}
            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-lg"
          >
            –
          </button>

          <span className="font-medium">{qty}</span>

          <button 
            onClick={() => increaseQty(dish.id)}
            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* === COL 3: REMOVE BUTTON === */}
      <div className="flex flex-col justify-between items-end h-full">
        <button 
          onClick={() => toggleCartIcon(dish.id)}
          className="flex justify-center items-center"
        >
          <X className="text-gray-600 hover:text-red-500 cursor-pointer" size={20}/>
        </button>

        <p className="text-[13px] text-green-500">{dish.prepTime} min</p>
      </div>

    </div>
  )
}
