import React, { useState } from "react";
import { Outlet } from "react-router";

import useDialogState from "~/hooks/use-dialog-state";

import { Task } from "~/containers/admin/tasks/data/schema";

type TasksDialogType = "create" | "update" | "delete" | "import";

interface TasksContextType {
  open: TasksDialogType | null;
  setOpen: (str: TasksDialogType | null) => void;
  currentRow: Task | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>;
}

export default function TasksLayout() {
  const [open, setOpen] = useDialogState<TasksDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Task | null>(null);

  return (
    <Outlet
      context={{ open, setOpen, currentRow, setCurrentRow } as TasksContextType}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
// export const useTasks = () => {
//   const tasksContext = React.useContext(TasksContext);

//   if (!tasksContext) {
//     throw new Error("useTasks has to be used within <TasksContext>");
//   }

//   return tasksContext;
// };
