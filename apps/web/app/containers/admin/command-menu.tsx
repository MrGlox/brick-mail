import { ChevronRightIcon } from "@radix-ui/react-icons";
import React from "react";
import { useNavigate } from "react-router";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";

import { ThemeSwitch } from "~/containers/theme-switch";
import { useSearch } from "~/context/search-context";

import { sidebarData } from "./layout/data/sidebar";

export function CommandMenu() {
  const navigate = useNavigate();

  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <ChevronRightIcon className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${subItem.url}-${i}`}
                    value={subItem.title}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <ChevronRightIcon className="size-2 text-muted-foreground/80" />
                    </div>
                    {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <ThemeSwitch />
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
