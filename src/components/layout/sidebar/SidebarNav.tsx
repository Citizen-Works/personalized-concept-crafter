
import React, { memo, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SidebarMenu
} from '@/components/ui/sidebar';
import { 
  Home, FileText, PenSquare, Lightbulb, 
  Linkedin, BookText, FileImage, Settings
} from 'lucide-react';

// Lazy load components
const MenuItem = lazy(() => import('./MenuItem'));
const SubmenuGroup = lazy(() => import('./SubmenuGroup'));

const SidebarNav = () => {
  const { pathname } = useLocation();

  return (
    <SidebarMenu>
      <Suspense fallback={<div className="px-3 py-2">Loading...</div>}>
        <MenuItem 
          to="/dashboard" 
          icon={Home} 
          label="Dashboard" 
          isActive={pathname === '/dashboard'} 
        />
        
        <MenuItem 
          to="/ideas" 
          icon={Lightbulb} 
          label="Content Ideas" 
          isActive={pathname.includes('/ideas')} 
        />
        
        <MenuItem 
          to="/drafts" 
          icon={PenSquare} 
          label="Content Drafts" 
          isActive={pathname.includes('/drafts')} 
        />
        
        <SubmenuGroup
          icon={FileText}
          label="Documents"
          isActive={pathname.includes('/documents') || pathname.includes('/transcripts')}
          subItems={[
            {
              to: "/documents",
              label: "All Documents",
              isActive: pathname === '/documents'
            },
            {
              to: "/transcripts",
              label: "Meeting Transcripts",
              isActive: pathname === '/transcripts'
            }
          ]}
        />
        
        <SubmenuGroup
          icon={Linkedin}
          label="LinkedIn"
          isActive={pathname.includes('/linkedin')}
          subItems={[
            {
              to: "/linkedin-posts",
              label: "Posts",
              isActive: pathname === '/linkedin-posts'
            }
          ]}
        />
        
        <SubmenuGroup
          icon={BookText}
          label="Resources"
          isActive={pathname.includes('/content-pillars') || pathname.includes('/target-audiences') || pathname.includes('/writing-style')}
          subItems={[
            {
              to: "/content-pillars",
              label: "Content Pillars",
              isActive: pathname === '/content-pillars'
            },
            {
              to: "/target-audiences",
              label: "Target Audiences",
              isActive: pathname === '/target-audiences'
            },
            {
              to: "/writing-style",
              label: "Writing Style",
              isActive: pathname === '/writing-style'
            }
          ]}
        />
        
        <SubmenuGroup
          icon={FileImage}
          label="Examples"
          isActive={pathname.includes('/marketing-examples') || pathname.includes('/newsletter-examples')}
          subItems={[
            {
              to: "/marketing-examples",
              label: "Marketing",
              isActive: pathname === '/marketing-examples'
            },
            {
              to: "/newsletter-examples",
              label: "Newsletter",
              isActive: pathname === '/newsletter-examples'
            }
          ]}
        />
        
        <MenuItem 
          to="/settings" 
          icon={Settings} 
          label="Settings" 
          isActive={pathname.includes('/settings')} 
        />
      </Suspense>
    </SidebarMenu>
  );
};

export default memo(SidebarNav);
