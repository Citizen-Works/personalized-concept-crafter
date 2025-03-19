
import React from "react";
import { Link } from "react-router-dom";
import {
  CircleUser,
  Gauge,
  Settings,
  FileText,
  LifeBuoy,
  MessagesSquare,
  BookOpen,
  Upload,
  Folder,
  FileEdit,
  Music,
  BookMarked,
  Target,
  PenTool,
  SendHorizontal,
  icons,
  Users,
  Briefcase,
  Facebook,
  Twitter,
  Github,
  Linkedin,
  ThumbsUp,
  Lightbulb,
  Check,
  GitMerge,
} from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar/menu";
import { NavigationItemWithSub } from "./NavigationItemWithSub";
import { NavigationItem } from "./NavigationItem";
import { getNavigationItems } from "./navigationData";

interface NavigationItemsProps {
  isActive: (href: string) => boolean;
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({ isActive }) => {
  const navigation = getNavigationItems();

  return (
    <>
      {navigation.map((item, index) => {
        if (item.subItems) {
          return (
            <NavigationItemWithSub 
              key={index} 
              item={item} 
              isActive={isActive} 
            />
          );
        }

        return (
          <NavigationItem 
            key={index} 
            item={item} 
            isActive={isActive} 
          />
        );
      })}
    </>
  );
};
