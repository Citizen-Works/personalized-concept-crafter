
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  SidebarMenuSubItem, 
  SidebarMenuSubButton 
} from '@/components/ui/sidebar';

interface SubMenuItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ 
  to, 
  label, 
  isActive 
}) => {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={isActive}>
        <Link to={to}>{label}</Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

export default memo(SubMenuItem);
