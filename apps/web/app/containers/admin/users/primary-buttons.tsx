import { EnvelopeClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { useOutletContext } from "react-router";
import { Button } from "~/components/ui/button";

import { UsersContextType } from "~/routes/admin+/dashboard+/users+/_layout";

export function UsersPrimaryButtons() {
  const { setOpen } = useOutletContext<UsersContextType>();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("invite")}
      >
        <span>Invite User</span> <EnvelopeClosedIcon />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add User</span> <PersonIcon />
      </Button>
    </div>
  );
}
