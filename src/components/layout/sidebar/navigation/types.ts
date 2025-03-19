
import { LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: NavSubItem[];
}
