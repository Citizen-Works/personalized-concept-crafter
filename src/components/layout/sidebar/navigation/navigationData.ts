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
} from "lucide-react";
import { NavItem } from "./types";

export const getNavigationItems = (): NavItem[] => [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
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
    title: "Ideas",
    href: "/ideas",
    icon: Lightbulb,
  },
  {
    title: "Drafts",
    href: "/drafts",
    icon: FileEdit,
  },
  {
    title: "LinkedIn Posts",
    href: "/linkedin-posts",
    icon: Linkedin,
  },
  {
    title: "Transcripts",
    href: "/transcripts",
    icon: FileText,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: Folder,
  },
  {
    title: "Personal Stories",
    href: "/personal-stories",
    icon: BookMarked,
  },
  {
    title: "Content Pillars",
    href: "/content-pillars",
    icon: Target,
  },
  {
    title: "Target Audiences",
    href: "/target-audiences",
    icon: Target,
  },
  {
    title: "Writing Style",
    href: "/writing-style",
    icon: PenTool,
  },
  {
    title: "Call To Actions",
    href: "/call-to-actions",
    icon: ThumbsUp,
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
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
