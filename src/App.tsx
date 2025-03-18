import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import IdeasPage from "./pages/IdeasPage";
import NewIdeaPage from "./pages/NewIdeaPage";
import IdeaDetailPage from "./pages/IdeaDetailPage";
import DraftsPage from "./pages/DraftsPage";
import DraftDetailPage from "./pages/DraftDetailPage";
import ContentPillarsPage from "./pages/ContentPillarsPage";
import TargetAudiencesPage from "./pages/TargetAudiencesPage";
import LinkedinPostsPage from "./pages/LinkedinPostsPage";
import DocumentsPage from "./pages/DocumentsPage";
import WritingStylePage from "./pages/WritingStylePage";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import OnboardingPage from './pages/OnboardingPage';

const initializeThemeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || 'system';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  })();
`;

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initializeThemeScript }} />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ideas" element={<IdeasPage />} />
                  <Route path="/ideas/new" element={<NewIdeaPage />} />
                  <Route path="/ideas/:id" element={<IdeaDetailPage />} />
                  <Route path="/drafts" element={<DraftsPage />} />
                  <Route path="/drafts/:id" element={<DraftDetailPage />} />
                  <Route path="/pillars" element={<ContentPillarsPage />} />
                  <Route path="/audiences" element={<TargetAudiencesPage />} />
                  <Route path="/writing-style" element={<WritingStylePage />} />
                  <Route path="/linkedin" element={<LinkedinPostsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
