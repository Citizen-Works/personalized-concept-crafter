
import React from 'react';
import { AuthProvider } from './auth';
import { TenantProvider } from './tenant/TenantContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <TenantProvider>
                <Toaster richColors />
                {children}
              </TenantProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};
