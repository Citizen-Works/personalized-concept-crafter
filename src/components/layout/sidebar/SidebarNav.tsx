
import React, { memo, lazy, Suspense } from 'react';
import { 
  SidebarMenu
} from '@/components/ui/sidebar';
import { 
  Home, FileText, PenSquare, Lightbulb, 
  Linkedin, BookText, FileImage, Settings
} from 'lucide-react';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

// Lazy load components
const MenuItem = lazy(() => import('./MenuItem'));
const SubmenuGroup = lazy(() => import('./SubmenuGroup'));

const SidebarNav = () => {
  const { processNavigationItems } = useSidebarNavigation();
  
  // Define navigation items
  const navigationItems = processNavigationItems([
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: Home
    },
    {
      to: "/ideas",
      label: "Content Ideas",
      icon: Lightbulb
    },
    {
      to: "/drafts",
      label: "Content Drafts",
      icon: PenSquare
    },
    {
      to: "/documents",
      label: "Documents",
      icon: FileText,
      subItems: [
        {
          to: "/documents",
          label: "All Documents"
        },
        {
          to: "/transcripts",
          label: "Meeting Transcripts"
        }
      ]
    },
    {
      to: "/linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      subItems: [
        {
          to: "/linkedin-posts",
          label: "Posts"
        }
      ]
    },
    {
      to: "/resources",
      label: "Resources",
      icon: BookText,
      subItems: [
        {
          to: "/content-pillars",
          label: "Content Pillars"
        },
        {
          to: "/target-audiences",
          label: "Target Audiences"
        },
        {
          to: "/writing-style",
          label: "Writing Style"
        }
      ]
    },
    {
      to: "/examples",
      label: "Examples",
      icon: FileImage,
      subItems: [
        {
          to: "/marketing-examples",
          label: "Marketing"
        },
        {
          to: "/newsletter-examples",
          label: "Newsletter"
        }
      ]
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings
    }
  ]);

  return (
    <SidebarMenu>
      <Suspense fallback={<div className="px-3 py-2">Loading...</div>}>
        {navigationItems.map((item, index) => 
          item.subItems ? (
            <SubmenuGroup
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              subItems={item.subItems.map(subItem => ({
                to: subItem.to,
                label: subItem.label,
                isActive: subItem.to === useSidebarNavigation().currentPath
              }))}
            />
          ) : (
            <MenuItem 
              key={index}
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              isActive={item.isActive} 
            />
          )
        )}
      </Suspense>
    </SidebarMenu>
  );
};

export default memo(SidebarNav);
