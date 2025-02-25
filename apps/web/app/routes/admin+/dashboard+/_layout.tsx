import Cookies from "js-cookie";
import {
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
} from "react-router";

import SkipToMain from "~/components/molecules/skip-to-main";
import { SidebarProvider } from "~/components/ui/sidebar";
import { SearchProvider } from "~/context/search-context";
import { cn } from "~/lib/utils";

import { Header } from "~/containers/admin/layout/header";
import { AppSidebar } from "~/containers/admin/layout/sidebar";
import { TopNav } from "~/containers/admin/layout/top-nav";
import { ProfileDropdown } from "~/containers/admin/profile-dropdown";
import { Search } from "~/containers/admin/search";
import { ThemeSwitch } from "~/containers/theme-switch";

import { getOptionalUser } from "~/server/auth.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ context });

  if (!user) {
    return redirect("/admin");
  }

  return {
    user,
  };
};

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  const defaultOpen = Cookies.get("sidebar:state") !== "false";

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        {user && <AppSidebar user={user} />}
        <div
          id="content"
          className={cn(
            "max-w-full w-full ml-auto",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "transition-[width] ease-linear duration-200",
            "h-svh flex flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
          )}
        >
          {/* ===== Top Heading ===== */}
          <Header fixed>
            <TopNav links={topNav} />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}

const topNav = [
  {
    title: "Overview",
    href: "/admin/dashboard/overview",
    isActive: true,
    disabled: false,
  },
  {
    title: "Customers",
    href: "/admin/dashboard/customers",
    isActive: false,
    disabled: true,
  },
  {
    title: "Products",
    href: "/admin/dashboard/products",
    isActive: false,
    disabled: true,
  },
  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    isActive: false,
    disabled: true,
  },
];
