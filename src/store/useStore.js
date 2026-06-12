import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginWithGoogle, logoutUser, syncUserData, loadUserData } from '../config/firebase';

export const useStore = create(
  persist(
    (set, get) => ({
      myList: [],
      history: [],
      user: null,
      
      setUser: (user) => set({ user }),

      login: async () => {
        try {
          const user = await loginWithGoogle();
          set({ user: { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL } });
          
          // Load user data from Firestore
          const data = await loadUserData(user.uid);
          if (data) {
            set((state) => ({
              myList: data.myList || state.myList,
              history: data.history || state.history
            }));
          } else {
            // New user, sync current local state to Firestore
            const state = get();
            await syncUserData(user.uid, { myList: state.myList, history: state.history });
          }
        } catch (error) {
          console.error("Login failed", error);
        }
      },

      logout: async () => {
        try {
          await logoutUser();
          set({ user: null });
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
      
      addToList: (anime, status) => set((state) => {
        const existing = state.myList.find(a => a.id === anime.id);
        const newList = existing 
          ? state.myList.map(a => a.id === anime.id ? { ...a, status } : a)
          : [...state.myList, { ...anime, status }];
          
        if (state.user) syncUserData(state.user.uid, { myList: newList });
        return { myList: newList };
      }),
      
      removeFromList: (id) => set((state) => {
        const newList = state.myList.filter(a => a.id !== id);
        if (state.user) syncUserData(state.user.uid, { myList: newList });
        return { myList: newList };
      }),
      
      addToHistory: (anime, episode, time) => set((state) => {
        const newHistory = state.history.filter(h => h.id !== anime.id);
        const updatedHistory = [{ ...anime, lastEpisode: episode, timeVisto: time, date: new Date() }, ...newHistory].slice(0, 50);
        
        if (state.user) syncUserData(state.user.uid, { history: updatedHistory });
        return { history: updatedHistory };
      }),
      
      clearHistory: () => set((state) => {
        if (state.user) syncUserData(state.user.uid, { history: [] });
        return { history: [] };
      }),

      syncLocalDataAfterAuthReady: async (user) => {
        set({ user: { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL } });
        const data = await loadUserData(user.uid);
        if (data) {
          set((state) => ({
            myList: data.myList || state.myList,
            history: data.history || state.history
          }));
        }
      }
    }),
    {
      name: 'animeverse-storage',
    }
  )
);
