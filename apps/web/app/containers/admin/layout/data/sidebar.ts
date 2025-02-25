import {
  Ban,
  Bell,
  Bug,
  CheckSquare,
  FileQuestion,
  LayoutDashboard,
  Lock,
  Monitor,
  Package,
  Palette,
  ServerOff,
  Settings,
  UserCog,
  UserX,
  Users,
  Wrench,
} from "lucide-react";

import { Command } from "lucide-react";

import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  workspaces: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Tasks",
          url: "/admin/dashboard/tasks",
          icon: CheckSquare,
        },
        {
          title: "Builder",
          url: "/admin/dashboard/builder",
          icon: Package,
        },
        // {
        //   title: "Chats",
        //   url: "/admin/dashboard/chats",
        //   badge: "3",
        //   icon: MessageSquare,
        // },
        {
          title: "Users",
          url: "/admin/dashboard/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        // {
        //   title: "Auth",
        //   icon: LockKeyhole,
        //   items: [
        //     {
        //       title: "Sign In",
        //       url: "/admin/dashboard/sign-in",
        //     },
        //     {
        //       title: "Sign In (2 Col)",
        //       url: "/admin/dashboard/sign-in-2",
        //     },
        //     {
        //       title: "Sign Up",
        //       url: "/admin/dashboard/sign-up",
        //     },
        //     {
        //       title: "Forgot Password",
        //       url: "/admin/dashboard/forgot-password",
        //     },
        //     {
        //       title: "OTP",
        //       url: "/admin/dashboard/otp",
        //     },
        //   ],
        // },
        {
          title: "Errors",
          icon: Bug,
          items: [
            {
              title: "Unauthorized",
              url: "/401",
              icon: Lock,
            },
            {
              title: "Forbidden",
              url: "/403",
              icon: UserX,
            },
            {
              title: "Not Found",
              url: "/404",
              icon: FileQuestion,
            },
            {
              title: "Internal Server Error",
              url: "/500",
              icon: ServerOff,
            },
            {
              title: "Maintenance Error",
              url: "/503",
              icon: Ban,
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/admin/dashboard/settings",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "/admin/dashboard/settings/account",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "/admin/dashboard/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/admin/dashboard/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/admin/dashboard/settings/display",
              icon: Monitor,
            },
          ],
        },
        // {
        //   title: "Help Center",
        //   url: "/admin/dashboard/help-center",
        //   icon: HelpCircle,
        // },
      ],
    },
  ],
};
