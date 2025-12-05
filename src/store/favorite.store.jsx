import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoreFavorite = create(
  persist(
    (set) => ({
      selectedFavoriteIds: [],
      
      toggleHeartIcon: (id) => {
        set((state) => {
          const isAlreadySelected = state.selectedFavoriteIds.includes(id);
          return {
            selectedFavoriteIds: isAlreadySelected
              ? state.selectedFavoriteIds.filter((item) => item !== id) // Remove if exists
              : [...state.selectedFavoriteIds, id], // Add if not exists
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          selectedFavoriteIds: state.selectedFavoriteIds.filter((item) => item !== id),
        }));
      },

      clearAll: () => set({ selectedFavoriteIds: [] }),
    }),
    {
      name: 'favorites-storage', // key in localStorage
      getStorage: () => localStorage, // optional, defaults to localStorage
    }
  )
);