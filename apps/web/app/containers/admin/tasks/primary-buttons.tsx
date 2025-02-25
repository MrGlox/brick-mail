import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { useOutletContext } from "react-router";

import { Button } from "~/components/ui/button";

export function TasksPrimaryButtons() {
  const { setOpen } = useOutletContext();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("import")}
      >
        <span>Import</span> <DownloadIcon className="h-4 w-4" />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <span>Create</span> <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
