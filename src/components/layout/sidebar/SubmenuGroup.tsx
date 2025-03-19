
import React, { memo, lazy, Suspense } from 'react';
import { 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub 
} from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';

// Lazy load SubMenuItem component
const SubMenuItem = lazy(() => import('./SubMenuItem'));

interface SubMenuOption {
  to: string;
  label: string;
  isActive: boolean;
}

interface SubmenuGroupProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  subItems: SubMenuOption[];
}

const SubmenuGroup: React.FC<SubmenuGroupProps> = ({ 
  icon: Icon, 
  label, 
  isActive,
  subItems 
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuSub>
        <SidebarMenuButton>
          <Icon className="mr-2" />
          <span>{label}</span>
        </SidebarMenuButton>
        
        <Suspense fallback={<div className="px-3 py-1 text-xs">Loading...</div>}>
          {subItems.map((item, index) => (
            <SubMenuItem 
              key={index}
              to={item.to}
              label={item.label}
              isActive={item.isActive}
            />
          ))}
        </Suspense>
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
};

export default memo(SubmenuGroup);
