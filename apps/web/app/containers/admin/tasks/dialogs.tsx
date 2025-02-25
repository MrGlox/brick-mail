import { useOutletContext } from "react-router";

import { ConfirmDialog } from "~/containers/admin/confirm-dialog";
import { toast } from "~/hooks/use-toast";

import { ImportDialog } from "./import-dialog";
import { MutateDrawer } from "./mutate-drawer";

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOutletContext();

  return (
    <>
      <MutateDrawer
        key="task-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
      />

      <ImportDialog
        key="tasks-import"
        open={open === "import"}
        onOpenChange={() => setOpen("import")}
      />

      {currentRow && (
        <>
          <MutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={() => {
              setOpen("update");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key="task-delete"
            destructive
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
              toast({
                title: "The following task has been deleted:",
                description: (
                  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                      {JSON.stringify(currentRow, null, 2)}
                    </code>
                  </pre>
                ),
              });
            }}
            className="max-w-md"
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{" "}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText="Delete"
          />
        </>
      )}
    </>
  );
}
