
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import WaitlistPage from "@/pages/WaitlistPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import ContentPillarsPage from "@/pages/ContentPillarsPage";
import TargetAudiencesPage from "@/pages/TargetAudiencesPage";
import WritingStylePage from "@/pages/WritingStylePage";
import LinkedinPostsPage from "@/pages/LinkedinPostsPage";
import MarketingExamplesPage from "@/pages/MarketingExamplesPage";
import NewsletterExamplesPage from "@/pages/NewsletterExamplesPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import AdminPage from "./pages/AdminPage";

import ReviewQueuePage from "@/pages/ReviewQueuePage";
import ReadyToPublishPage from "@/pages/ReadyToPublishPage";
import PublishedPage from "@/pages/PublishedPage";
import NewIdeaPage from "@/pages/NewIdeaPage";
import GenerateDraftPage from "@/pages/GenerateDraftPage";
import CallToActionsPage from "@/pages/CallToActionsPage";
import ContentPipelinePage from "@/pages/ContentPipelinePage";
import StrategyOverviewPage from "@/pages/StrategyOverviewPage";
import PillarAudienceLinkPage from "@/pages/PillarAudienceLinkPage";
import IdeaDetailPage from "@/pages/IdeaDetailPage";
import DraftDetailPage from "@/pages/DraftDetailPage";
import { usePromptTemplateInitializer } from "@/hooks/admin/usePromptTemplateInitializer";

import SourceMaterialsPage from "@/pages/SourceMaterialsPage";
import SourceMaterialDetailPage from "@/pages/SourceMaterialDetailPage";
import SourceMaterialsUploadPage from "@/pages/SourceMaterialsUploadPage";
import { AppProviders } from "./context";

const TemplateInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePromptTemplateInitializer();
  return <>{children}</>;
};

function App() {
  return (
    <AppProviders>
      <TemplateInitializer>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Navigate to="/waitlist" replace />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          
          <Route element={<ProtectedRoute requireAuth={false} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true} redirectPath="/waitlist">
                <RegisterPage />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="/onboarding" element={
            <ProtectedRoute redirectPath="/login">
              <OnboardingPage />
            </ProtectedRoute>
          } />
          
          <Route element={
            <ProtectedRoute redirectPath="/login">
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/pipeline" element={<ContentPipelinePage />} />
            
            <Route path="/review-queue" element={<Navigate to="/pipeline?tab=review" replace />} />
            <Route path="/ideas" element={<Navigate to="/pipeline?tab=ideas" replace />} />
            <Route path="/ideas/new" element={<NewIdeaPage />} />
            <Route path="/ideas/:id" element={<IdeaDetailPage />} />
            <Route path="/drafts" element={<Navigate to="/pipeline?tab=drafts" replace />} />
            <Route path="/drafts/:id" element={<DraftDetailPage />} />
            <Route path="/ready-to-publish" element={<Navigate to="/pipeline?tab=ready" replace />} />
            <Route path="/published" element={<Navigate to="/pipeline?tab=published" replace />} />
            
            {/* Redirect from old "new-content-idea" to the proper "ideas/new" page */}
            <Route path="/new-content-idea" element={<Navigate to="/ideas/new" replace />} />
            
            <Route path="/generate-draft" element={<GenerateDraftPage />} />
            
            <Route path="/source-materials" element={<SourceMaterialsPage />} />
            <Route path="/source-materials/:id" element={<SourceMaterialDetailPage />} />
            <Route path="/source-materials/upload" element={<SourceMaterialsUploadPage />} />
            
            <Route path="/linkedin-posts" element={<LinkedinPostsPage />} />
            <Route path="/marketing-examples" element={<MarketingExamplesPage />} />
            <Route path="/newsletter-examples" element={<NewsletterExamplesPage />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true} redirectPath="/dashboard">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/strategy" element={<StrategyOverviewPage />} />
            <Route path="/strategy/content-pillars" element={<ContentPillarsPage />} />
            <Route path="/strategy/target-audiences" element={<TargetAudiencesPage />} />
            <Route path="/strategy/call-to-actions" element={<CallToActionsPage />} />
            <Route path="/strategy/writing-style" element={<WritingStylePage />} />
            <Route path="/strategy/audience-mapping" element={<PillarAudienceLinkPage />} />
            
            <Route path="/content-pillars" element={<Navigate to="/strategy/content-pillars" replace />} />
            <Route path="/target-audiences" element={<Navigate to="/strategy/target-audiences" replace />} />
            <Route path="/writing-style" element={<Navigate to="/strategy/writing-style" replace />} />
            <Route path="/call-to-actions" element={<Navigate to="/strategy/call-to-actions" replace />} />
            <Route path="/transcripts" element={<Navigate to="/source-materials" replace />} />
            <Route path="/documents" element={<Navigate to="/source-materials" replace />} />
            
            <Route path="/personal-stories" element={<Navigate to="/source-materials" replace />} />
            
            <Route path="/settings/*" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TemplateInitializer>
    </AppProviders>
  );
}

export default App;
