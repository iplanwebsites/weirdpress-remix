import { Home, FileText, Image, MessageCircle, Camera } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  external?: boolean;
  mobileOnly?: boolean;
}

export const mainNavItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  /*
  {
    href: "https://chat.repo.md/projects/6848af1cacdf98346841d302",
    label: "Chat",
    icon: MessageCircle,
    external: true,
  },
  {
    href: "/blog",
    label: "Blog",
    icon: FileText,
  },
  {
    href: "/media",
    label: "Media",
    icon: Image,
  },
  */

    {
    href: "/projects/all",
    label: "Projects",
    icon: Camera,
  },
  {
    href: "/about",
    label: "About",
    icon: Image,
  },

];

export const mobileNavItems: NavItem[] = [
  ...mainNavItems,
  {
    href: "/search",
    label: "Search",
    mobileOnly: true,
  },
];