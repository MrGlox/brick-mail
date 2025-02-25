import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import { z } from "zod";

import i18next from "~/modules/i18n.server";
import { upsertUser } from "~/server/admin/user.server";

const formSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    pseudo: z.string().min(1),
    phoneNumber: z.string().optional(),
    email: z.string().min(1).email(),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password !== "")) {
      if (password === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required.",
          path: ["password"],
        });
      }

      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters long.",
          path: ["password"],
        });
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter.",
          path: ["password"],
        });
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number.",
          path: ["password"],
        });
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type UserUpsertForm = z.infer<typeof formSchema>;
export const resolver = zodResolver(formSchema);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const t = await i18next.getFixedT(request, "admin");

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  const { isEdit, phoneNumber, confirmPassword, ...formData } =
    data as unknown as UserUpsertForm;

  if (errors)
    return {
      errors,
      defaultValues,
    };

  const { error, user } = await upsertUser({
    context,
    formData: formData as unknown as UserUpsertForm,
  });

  if (error) {
    return dataWithError(
      {
        error,
      },
      {
        message: t(`user.${isEdit ? "edit" : "create"}.error.message`),
        description:
          error.code === "P2002"
            ? t(`user.${isEdit ? "edit" : "create"}.error.existing_user`)
            : t(`user.${isEdit ? "edit" : "create"}.error.description`),
      }
    );
  }

  return dataWithSuccess(
    {
      result: user,
    },
    {
      message: t(`user.${isEdit ? "edit" : "create"}.success.message`),
      description: t(`user.${isEdit ? "edit" : "create"}.success.description`),
    }
  );
};
