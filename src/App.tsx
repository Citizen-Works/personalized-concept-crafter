
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';

import WaitlistPage from "@/pages/WaitlistPage";
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
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import TranscriptsPage from "./pages/TranscriptsPage";
import { MainLayout } from "./components/layout/MainLayout";
import AdminPage from "./pages/AdminPage";

import ReviewQueuePage from "@/pages/ReviewQueuePage";
import ReadyToPublishPage from "@/pages/ReadyToPublishPage";
import PublishedPage from "@/pages/PublishedPage";
import NewContentIdeaPage from "@/pages/NewContentIdeaPage";
import GenerateDraftPage from "@/pages/GenerateDraftPage";
import PersonalStoriesPage from "@/pages/PersonalStoriesPage";
import CallToActionsPage from "@/pages/CallToActionsPage";
import ContentPipelinePage from "@/pages/ContentPipelinePage";
import StrategyOverviewPage from "@/pages/StrategyOverviewPage";
import PillarAudienceLinkPage from "@/pages/PillarAudienceLinkPage";

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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
              <Toaster position="top-right" richColors />
              <Routes>
                {/* Public routes - waitlist is the default landing page */}
                <Route path="/" element={<Navigate to="/waitlist" replace />} />
                <Route path="/waitlist" element={<WaitlistPage />} />
                
                {/* Auth routes - redirect to dashboard if logged in */}
                <Route element={<ProtectedRoute requireAuth={false} />}>
                  <Route path="/login" element={<LoginPage />} />
                  {/* Registration page is only accessible to admins */}
                  <Route path="/register" element={
                    <ProtectedRoute requireAuth={true} requireAdmin={true} redirectPath="/waitlist">
                      <RegisterPage />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* Protected onboarding route */}
                <Route path="/onboarding" element={
                  <ProtectedRoute redirectPath="/login">
                    <OnboardingPage />
                  </ProtectedRoute>
                } />
                
                {/* Protected app routes with main layout */}
                <Route element={
                  <ProtectedRoute redirectPath="/login">
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  <Route path="/pipeline" element={<ContentPipelinePage />} />
                  
                  <Route path="/review-queue" element={<ReviewQueuePage />} />
                  <Route path="/ideas" element={<IdeasPage />} />
                  <Route path="/ideas/:id" element={<IdeaDetailPage />} />
                  <Route path="/ideas/new" element={<NewIdeaPage />} />
                  <Route path="/drafts" element={<DraftsPage />} />
                  <Route path="/drafts/:id" element={<DraftDetailPage />} />
                  <Route path="/ready-to-publish" element={<ReadyToPublishPage />} />
                  <Route path="/published" element={<PublishedPage />} />
                  
                  <Route path="/new-content-idea" element={<NewContentIdeaPage />} />
                  <Route path="/generate-draft" element={<GenerateDraftPage />} />
                  
                  <Route path="/linkedin-posts" element={<LinkedinPostsPage />} />
                  <Route path="/transcripts" element={<TranscriptsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/personal-stories" element={<PersonalStoriesPage />} />
                  
                  {/* Admin page - protected with requireAdmin */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true} redirectPath="/dashboard">
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Strategy Section Routes */}
                  <Route path="/strategy" element={<StrategyOverviewPage />} />
                  <Route path="/strategy/content-pillars" element={<ContentPillarsPage />} />
                  <Route path="/strategy/target-audiences" element={<TargetAudiencesPage />} />
                  <Route path="/strategy/call-to-actions" element={<CallToActionsPage />} />
                  <Route path="/strategy/writing-style" element={<WritingStylePage />} />
                  <Route path="/strategy/audience-mapping" element={<PillarAudienceLinkPage />} />
                  
                  {/* Legacy Routes - to be redirected */}
                  <Route path="/content-pillars" element={<Navigate to="/strategy/content-pillars" replace />} />
                  <Route path="/target-audiences" element={<Navigate to="/strategy/target-audiences" replace />} />
                  <Route path="/writing-style" element={<Navigate to="/strategy/writing-style" replace />} />
                  <Route path="/call-to-actions" element={<Navigate to="/strategy/call-to-actions" replace />} />
                  
                  <Route path="/marketing-examples" element={<MarketingExamplesPage />} />
                  <Route path="/newsletter-examples" element={<NewsletterExamplesPage />} />
                  
                  <Route path="/settings/*" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
