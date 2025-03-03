import { Link, useLocation } from "react-router";

import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string;
    title: string;
    type?: "separator";
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        if (item.type === "separator") {
          return <Separator className="!my-2" key={`separator-${index}`} />;
        }

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.to
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
