import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";

import { NavGroup } from "~/containers/admin/layout/nav-group";
import { WorkspaceSwitcher } from "~/containers/admin/layout/workspace-switcher";

import { cn } from "~/lib/utils";

import { sidebarData } from "./data/sidebar";

type User = {
  pseudo?: string;
  email: string;
  avatar?: string;
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={sidebarData.workspaces} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter
        className={cn(
          state === "expanded" ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300"
        )}
      >
        <div className="flex items-center justify-center">
          <p className="text-[0.6rem] text-muted-foreground">
            © {new Date().getFullYear()} Brick Mail - All rights reserved.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
