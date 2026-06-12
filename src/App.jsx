import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './routes/AppRouter';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useStore } from './store/useStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const syncLocalDataAfterAuthReady = useStore(state => state.syncLocalDataAfterAuthReady);
  const setUser = useStore(state => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        syncLocalDataAfterAuthReady(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [syncLocalDataAfterAuthReady, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
