import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { FloatingChefAssistant } from './components/ai/FloatingChefAssistant';
import { ChatToastNotification } from './components/chat/ChatToastNotification';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <FloatingChefAssistant />
        <ChatToastNotification />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
