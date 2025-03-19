
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive 
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive}>
        <Link to={to}>
          <Icon className="mr-2" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default memo(MenuItem);
