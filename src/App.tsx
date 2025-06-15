import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import newly created pages
import DashboardPage from "./pages/DashboardPage";
import MarketsPage from "./pages/MarketsPage";
import TradingPage from "./pages/TradingPage";
import WalletPage from "./pages/WalletPage";
import EarnPage from "./pages/EarnPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster richColors position="top-right" /> {/* Sonner configuration */}
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to DashboardPage */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
          
          {/* Application Pages */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/trading" element={<TradingPage />} /> 
          {/* Changed from /trade in NavigationMenu example to /trading for clarity */}
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/earn" element={<EarnPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;