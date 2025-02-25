import { Prisma, User as UserType } from "@repo/database";
import { AppLoadContext } from "react-router";

import { UserDeleteForm } from "~/routes/admin+/dashboard+/users+/actions+/delete";
import { UserInviteForm } from "~/routes/admin+/dashboard+/users+/actions+/invite";
import { UserUpsertForm } from "~/routes/admin+/dashboard+/users+/actions+/upsert";

import type { User } from "./user.schema";

export async function getUsers(context: AppLoadContext): Promise<User[]> {
  const users = await context.remixService.admin.user.getUsers();

  return users.map((user) => ({
    ...user,
    pseudo: user.pseudo || "",
    profile: user.profile
      ? {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatar: user.profile.avatar,
        }
      : undefined,
  }));
}

export async function inviteUser({
  context,
  formData,
}: {
  context: AppLoadContext;
  formData: UserInviteForm;
}): Promise<{ user: UserType; error?: Prisma.PrismaClientKnownRequestError }> {
  const { desc, ...rest } = formData;

  try {
    const newUser = await context.remixService.admin.user.upsertUser(
      rest as Prisma.UserCreateInput
    );

    await context.remixService.admin.user.sendInvitation(newUser.id, desc);

    return { user: newUser };
  } catch (error) {
    console.error(error);

    // Return a more descriptive error message
    return {
      user: null as unknown as UserType,
      error: error as Prisma.PrismaClientKnownRequestError,
    };
  }
}

export async function upsertUser({
  context,
  formData,
}: {
  context: AppLoadContext;
  formData: UserUpsertForm;
}): Promise<{ user: UserType; error?: Prisma.PrismaClientKnownRequestError }> {
  const { firstName, lastName, ...rest } = formData;

  try {
    const newUser = await context.remixService.admin.user.upsertUser(
      rest as Prisma.UserCreateInput
    );

    await context.remixService.admin.user.upsertProfile(newUser.id, {
      firstName,
      lastName,
      user: {
        connect: {
          id: newUser.id,
        },
      },
    });

    return { user: newUser };
  } catch (error) {
    console.error(error);

    return {
      user: null as unknown as UserType,
      error: error as Prisma.PrismaClientKnownRequestError,
    };
  }
}

export async function deleteUser({
  context,
  formData,
}: {
  context: AppLoadContext;
  formData: UserDeleteForm;
}): Promise<{ user: UserType; error?: Prisma.PrismaClientKnownRequestError }> {
  const { userId } = formData;

  try {
    const user = await context.remixService.admin.user.updateUser(userId, {
      status: "DELETED",
    });

    return { user };
  } catch (error) {
    console.error(error);

    return {
      user: null as unknown as UserType,
      error: error as Prisma.PrismaClientKnownRequestError,
    };
  }
}
