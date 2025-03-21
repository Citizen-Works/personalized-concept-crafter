
import {
  Gauge,
  Settings,
  FileText,
  MessagesSquare,
  Upload,
  Folder,
  FileEdit,
  BookMarked,
  Target,
  PenTool,
  SendHorizontal,
  Briefcase,
  Linkedin,
  ThumbsUp,
  Lightbulb,
  Check,
  GitMerge,
  Compass,
  Users,
  FilePenLine,
  MessageSquareShare,
  Network,
  LayoutDashboard,
  Files,
  FileUp,
  BookText,
} from "lucide-react";
import { NavItem } from "./types";

export const getNavigationItems = (): NavItem[] => [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content Pipeline",
    href: "/pipeline",
    icon: GitMerge,
    subItems: [
      {
        title: "Review Queue",
        href: "/pipeline?tab=review",
        icon: Lightbulb,
      },
      {
        title: "Ideas",
        href: "/pipeline?tab=ideas",
        icon: FileText,
      },
      {
        title: "Drafts",
        href: "/pipeline?tab=drafts",
        icon: FileEdit,
      },
      {
        title: "Ready to Publish",
        href: "/pipeline?tab=ready",
        icon: Check,
      },
      {
        title: "Published",
        href: "/pipeline?tab=published",
        icon: SendHorizontal,
      },
    ],
  },
  {
    title: "Source Materials",
    href: "/source-materials",
    icon: Files,
    subItems: [
      {
        title: "All Materials",
        href: "/source-materials",
        icon: Folder,
      },
      {
        title: "Upload New",
        href: "/source-materials/upload",
        icon: FileUp,
      }
    ],
  },
  {
    title: "Strategy",
    href: "/strategy",
    icon: Compass,
    subItems: [
      {
        title: "Overview",
        href: "/strategy",
        icon: Compass,
      },
      {
        title: "Content Pillars",
        href: "/strategy/content-pillars",
        icon: Target,
      },
      {
        title: "Target Audiences",
        href: "/strategy/target-audiences",
        icon: Users,
      },
      {
        title: "Call To Actions",
        href: "/strategy/call-to-actions",
        icon: MessageSquareShare,
      },
      {
        title: "Writing Style",
        href: "/strategy/writing-style",
        icon: FilePenLine,
      },
      {
        title: "Audience Mapping",
        href: "/strategy/audience-mapping",
        icon: Network,
      },
    ],
  },
  {
    title: "Examples",
    href: "/examples",
    icon: BookText,
    subItems: [
      {
        title: "LinkedIn Posts",
        href: "/linkedin-posts",
        icon: Linkedin,
      },
      {
        title: "Marketing Examples",
        href: "/marketing-examples",
        icon: Briefcase,
      },
      {
        title: "Newsletter Examples",
        href: "/newsletter-examples",
        icon: MessagesSquare,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
