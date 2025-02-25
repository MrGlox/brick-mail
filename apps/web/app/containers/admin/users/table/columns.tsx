import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";

import { User } from "~/server/admin/user.schema";

import { useTranslation } from "react-i18next";
import { cn } from "~/lib/classNames";
import { userStatuses, userTypes } from "~/server/admin/user.data";
import { ColumnHeader } from "./column-header";
import { RowActions } from "./row-actions";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { t } = useTranslation("admin");
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("user.table.columns.select")}
          className="translate-y-[2px]"
        />
      );
    },
    cell: ({ row }) => {
      const { t } = useTranslation("admin");
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("user.table.columns.select_row")}
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const { t } = useTranslation("admin");
      return (
        <ColumnHeader column={column} title={t("user.table.columns.name")} />
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="font-medium">
          {row.original.pseudo} <br />
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const { t } = useTranslation("admin");
      return (
        <ColumnHeader column={column} title={t("user.table.columns.email")} />
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const { t } = useTranslation("admin");
      return (
        <ColumnHeader column={column} title={t("user.table.columns.status")} />
      );
    },
    cell: ({ row }) => {
      const { t } = useTranslation("admin");
      const { status } = row.original;
      const badgeColor = userStatuses.get(status);

      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn(badgeColor)}>
            {t(`status.${String(row.getValue("status")).toLowerCase()}`, {
              defaultValue: row.getValue("status"),
            })}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      const { t } = useTranslation("admin");
      return (
        <ColumnHeader column={column} title={t("user.table.columns.role")} />
      );
    },
    cell: ({ row }) => {
      const { role } = row.original;
      const userType = userTypes.find(({ value }) => value === role);

      if (!userType) {
        return null;
      }

      return (
        <div className="flex gap-x-2 items-center">
          {userType.icon && <userType.icon className="text-muted-foreground" />}
          <span className="capitalize text-sm">{userType.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "lastActive",
    header: ({ column }) => {
      const { t } = useTranslation("admin");
      return (
        <ColumnHeader
          column={column}
          title={t("user.table.columns.last_active")}
        />
      );
    },
    cell: ({ row }) => {
      const { t } = useTranslation("admin");
      const lastActive = row.getValue("lastActive") as string | undefined;
      if (!lastActive) return <div>{t("user.table.columns.never")}</div>;
      return <div>{new Date(lastActive).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
