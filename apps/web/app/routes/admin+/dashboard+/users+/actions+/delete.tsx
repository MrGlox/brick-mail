import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import { z } from "zod";

import i18next from "~/modules/i18n.server";
import { deleteUser } from "~/server/admin/user.server";

export const formSchema = z.object({
  pseudo: z.string(),
  deletedPseudo: z.string(),
  userId: z.string(),
});

export type UserDeleteForm = z.infer<typeof formSchema>;
export const resolver = zodResolver(formSchema);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const t = await i18next.getFixedT(request, "admin");

  const {
    errors,
    data: formData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<UserDeleteForm>(request, resolver);

  console.log("formData", formData);

  if (errors || formData.pseudo.trim() !== formData.deletedPseudo)
    return {
      errors: {
        ...errors,
        pseudo: errors?.pseudo || "pseudo.delete.error.pseudo",
      },
      defaultValues,
    };

  const { error, user } = await deleteUser({
    context,
    formData: formData as unknown as UserDeleteForm,
  });

  if (error) {
    return dataWithError(
      {
        error,
      },
      {
        message: t("user.invite.error.message"),
        description:
          error?.code === "P2002"
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
