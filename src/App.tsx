
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormProvider } from "@/context/FormContext";
import FormPage from "./pages/FormPage";
import ResultsPage from "./pages/ResultsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

// Create a client with default options and explicit error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: {
        onError: (error: any) => {
          console.error('Query error:', error);
          toast.error('An error occurred while fetching data');
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        onError: (error: any) => {
          console.error('Mutation error:', error);
          toast.error('An error occurred while submitting data');
        }
      }
    }
  },
});

const App = () => {
  // Log when app starts
  console.log('App initialized');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FormProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FormProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
