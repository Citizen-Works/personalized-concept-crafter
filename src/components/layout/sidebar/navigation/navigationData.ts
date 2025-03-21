
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
