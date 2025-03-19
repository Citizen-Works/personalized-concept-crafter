
import React, { memo } from 'react';
import { 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub 
} from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';
import SubMenuItem from './SubMenuItem';

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
        
        {subItems.map((item, index) => (
          <SubMenuItem 
            key={index}
            to={item.to}
            label={item.label}
            isActive={item.isActive}
          />
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
};

export default memo(SubmenuGroup);
