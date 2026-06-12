import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      favorites: [],
      history: [],
      user: null,
      
      setUser: (user) => set({ user }),
      
      addFavorite: (anime) => set((state) => {
        if (state.favorites.find(f => f.id === anime.id)) return state;
        return { favorites: [...state.favorites, anime] };
      }),
      
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== id)
      })),
      
      addToHistory: (anime, episode, time) => set((state) => {
        const newHistory = state.history.filter(h => h.id !== anime.id);
        return {
          history: [{ ...anime, lastEpisode: episode, timeVisto: time, date: new Date() }, ...newHistory].slice(0, 50)
        };
      }),
      
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'animeverse-storage',
    }
  )
);
