import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router";

import { Main } from "~/containers/admin/layout/main";

import { DataTable } from "~/containers/admin/users/table";
import { columns } from "~/containers/admin/users/table/columns";

import { UsersDialogs } from "~/containers/admin/users/dialogs";
import { UsersPrimaryButtons } from "~/containers/admin/users/primary-buttons";

import { User } from "~/server/admin/user.schema";
import { getOptionalUser } from "~/server/auth.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ context });

  if (!user) {
    return redirect("/admin/login");
  }

  const users = await context.remixService.admin.user.getUsers();

  return { users };
};

export default function UsersIndex() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <>
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your users for this month!
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable data={users as User[]} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </>
  );
}
