import { useOutletContext } from "react-router";

import { UsersDeleteDialog } from "./delete-dialog";
import { UsersInviteDialog } from "./invite-dialog";
import { UsersUpsertDialog } from "./upsert-dialog";

import { UsersContextType } from "~/routes/admin+/dashboard+/users+/_layout";

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useOutletContext<UsersContextType>();

  return (
    <>
      <UsersUpsertDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      <UsersInviteDialog
        key="user-invite"
        open={open === "invite"}
        onOpenChange={() => setOpen("invite")}
      />

      {currentRow && (
        <>
          <UsersUpsertDialog
            key={`user-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
