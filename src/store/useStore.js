import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      myList: [],
      history: [],
      user: null,
      
      setUser: (user) => set({ user }),
      
      addToList: (anime, status) => set((state) => {
        // status can be: 'viendo', 'pendiente', 'terminado'
        const existing = state.myList.find(a => a.id === anime.id);
        if (existing) {
          // Update status if it exists
          return {
            myList: state.myList.map(a => a.id === anime.id ? { ...a, status } : a)
          };
        }
        return { myList: [...state.myList, { ...anime, status }] };
      }),
      
      removeFromList: (id) => set((state) => ({
        myList: state.myList.filter(a => a.id !== id)
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
