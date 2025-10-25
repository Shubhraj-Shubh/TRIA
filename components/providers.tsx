
"use client"; 

import { Toaster } from "@/components/ui/sonner"; // ShadCN
import { Toaster as Sonner } from "@/components/ui/sonner"; // ShadCN
import { TooltipProvider } from "@/components/ui/tooltip"; // ShadCN
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes"; // Dark mode ke liye
import { createContext, useContext, useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // react-query client ko re-render par re-create hone se rokne ke liye
  const [queryClient] = useState(() => new QueryClient());
 



  return (
    // next-themes (dark mode) provider
    <ThemeProvider
      attribute="class"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
