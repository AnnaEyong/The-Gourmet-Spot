
// import { create } from 'zustand'


// export const useStoreCart = create((set) => ({
//     selectedAddedIds: [],
//     toggleCartIcon:(id) =>{
//         set((state) => {
//             const isAlreadySelected = state.selectedAddedIds.includes(id);
//             return {
//               ...state,
//               selectedAddedIds: isAlreadySelected ? state.selectedAddedIds.filter((item) => item !== id) // Remove if exists
//                 : [...state.selectedAddedIds, id], // Add if not exists
//             };
//           });
//     },

//     removeItem: (id) => {
//       set((state) => {return {
//         ...state,
//         selectedAddedIds: state.selectedAddedIds.filter((item) => item !== id)
//       };})
//     },

//     clearAll: () => set({ selectedAddedIds: [] }),
// }))

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoreCart = create(
  persist(
    (set) => ({
      selectedAddedIds: [],
      quantities: {},

      // Toggle cart (add/remove item)
      toggleCartIcon: (id) => {
        set((state) => {
          const isAlreadySelected = state.selectedAddedIds.includes(id);
          const updatedQuantities = { ...state.quantities };

          if (isAlreadySelected) {
            // Remove item
            delete updatedQuantities[id];
            return {
              selectedAddedIds: state.selectedAddedIds.filter((item) => item !== id),
              quantities: updatedQuantities,
            };
          } else {
            // Add item with initial qty 1
            return {
              selectedAddedIds: [...state.selectedAddedIds, id],
              quantities: { ...updatedQuantities, [id]: 1 },
            };
          }
        });
      },

      // Remove item completely
      removeItem: (id) => {
        set((state) => {
          const updatedQuantities = { ...state.quantities };
          delete updatedQuantities[id];
          return {
            selectedAddedIds: state.selectedAddedIds.filter((item) => item !== id),
            quantities: updatedQuantities,
          };
        });
      },

      // Increase quantity
      increaseQty: (id) => {
        set((state) => ({
          quantities: {
            ...state.quantities,
            [id]: (state.quantities[id] || 1) + 1,
          },
        }));
      },

      // Decrease quantity
      decreaseQty: (id) => {
        set((state) => ({
          quantities: {
            ...state.quantities,
            [id]: Math.max(1, (state.quantities[id] || 1) - 1),
          },
        }));
      },

      // Clear all
      clearAll: () => set({ selectedAddedIds: [], quantities: {} }),
    }),
    {
      name: 'cart-storage', // key in localStorage
      getStorage: () => localStorage, // optional, defaults to localStorage
    }
  )
);