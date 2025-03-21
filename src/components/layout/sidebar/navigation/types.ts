
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
  subItems?: NavItem[];
}
