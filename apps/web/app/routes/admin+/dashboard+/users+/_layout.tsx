import React, { useState } from "react";
import { Outlet } from "react-router";

import useDialogState from "~/hooks/use-dialog-state";
import { User } from "~/server/admin/user.schema";

type UsersDialogType = "invite" | "add" | "edit" | "delete";

export interface UsersContextType {
  open: UsersDialogType | null;
  setOpen: (str: UsersDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UsersLayout() {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const [currentProfile, setProfile] = useState<User | null>(null);

  return (
    <Outlet
      context={
        {
          open,
          setOpen,
          currentRow,
          setCurrentRow,
          currentProfile,
          setProfile,
        } as UsersContextType
      }
    />
  );
}
