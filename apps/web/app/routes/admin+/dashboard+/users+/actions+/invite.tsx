import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import { z } from "zod";

import i18next from "~/modules/i18n.server";
import { inviteUser } from "~/server/admin/user.server";

export const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Email is invalid." }),
  role: z.string().min(1, { message: "Role is required." }),
  desc: z.string().optional(),
});

export type UserInviteForm = z.infer<typeof formSchema>;
export const resolver = zodResolver(formSchema);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const t = await i18next.getFixedT(request, "admin");

  const {
    errors,
    data: formData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  if (errors)
    return {
      errors,
      defaultValues,
    };

  const { error, user } = await inviteUser({
    context,
    formData: formData as unknown as UserInviteForm,
  });

  if (error) {
    return dataWithError(
      {
        error,
      },
      {
        message: t("user.invite.error.message"),
        description:
          error.code === "P2002"
            ? t("user.invite.error.existing_user")
            : t("user.invite.error.description"),
      }
    );
  }

  return dataWithSuccess(
    {
      result: user,
    },
    {
      message: t("user.invite.success.message"),
      description: t("user.invite.success.description"),
    }
  );
};
