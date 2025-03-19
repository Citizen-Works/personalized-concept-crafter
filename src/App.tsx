
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "@/pages/Index";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import Dashboard from "@/pages/Dashboard";
import IdeasPage from "@/pages/IdeasPage";
import IdeaDetailPage from "@/pages/IdeaDetailPage";
import NewIdeaPage from "@/pages/NewIdeaPage";
import DraftsPage from "@/pages/DraftsPage";
import DraftDetailPage from "@/pages/DraftDetailPage";
import Settings from "@/pages/Settings";
import ContentPillarsPage from "@/pages/ContentPillarsPage";
import TargetAudiencesPage from "@/pages/TargetAudiencesPage";
import WritingStylePage from "@/pages/WritingStylePage";
import LinkedinPostsPage from "@/pages/LinkedinPostsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import MarketingExamplesPage from "@/pages/MarketingExamplesPage";
import NewsletterExamplesPage from "@/pages/NewsletterExamplesPage";
import NotFound from "@/pages/NotFound";
import WaitlistPage from "@/pages/WaitlistPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import TranscriptsPage from "./pages/TranscriptsPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <Toaster position="top-right" richColors />
            <Routes>
              {/* Redirect root to waitlist */}
              <Route path="/" element={<Navigate to="/waitlist" replace />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              
              {/* Auth routes - still accessible but not linked anywhere */}
              <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
              <Route path="/login" element={<ProtectedRoute><LoginPage /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              
              {/* All other routes protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ideas" element={<IdeasPage />} />
                <Route path="/ideas/:id" element={<IdeaDetailPage />} />
                <Route path="/ideas/new" element={<NewIdeaPage />} />
                <Route path="/drafts" element={<DraftsPage />} />
                <Route path="/drafts/:id" element={<DraftDetailPage />} />
                <Route path="/settings/*" element={<Settings />} />
                <Route path="/content-pillars" element={<ContentPillarsPage />} />
                <Route path="/target-audiences" element={<TargetAudiencesPage />} />
                <Route path="/writing-style" element={<WritingStylePage />} />
                <Route path="/linkedin-posts" element={<LinkedinPostsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/transcripts" element={<TranscriptsPage />} />
                <Route path="/marketing-examples" element={<MarketingExamplesPage />} />
                <Route path="/newsletter-examples" element={<NewsletterExamplesPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
