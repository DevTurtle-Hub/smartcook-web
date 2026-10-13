import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { FloatingChefAssistant } from './components/ai/FloatingChefAssistant';
import { ChatToastNotification } from './components/chat/ChatToastNotification';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { socketService } from './services/socket.service';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function App() {
  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      socketService.connect(token);
      useCartStore.getState().fetchServerCart();
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
            <FloatingChefAssistant />
            <ChatToastNotification />
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
