import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { ConfirmDialog } from "~/containers/admin/confirm-dialog";
import {
  UserDeleteForm,
  resolver,
} from "~/routes/admin+/dashboard+/users+/actions+/delete";
import { User } from "~/server/admin/user.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { t } = useTranslation("admin");
  const fetcher = useFetcher();

  const form = useRemixForm<UserDeleteForm>({
    resolver,
    defaultValues: {
      pseudo: "",
      deletedPseudo: currentRow.pseudo,
      userId: currentRow.id,
    },
    submitConfig: {
      method: "post",
      action: "actions/delete",
    },
    fetcher,
  });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.result) {
      form.reset();
      onOpenChange(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <ConfirmDialog
      {...{
        open,
        onOpenChange,
      }}
      destructive
      confirmText={t("user.delete.actions.confirm")}
      buttonProps={{
        id: "delete-user-form",
        type: "submit",
      }}
      isLoading={fetcher.state === "submitting"}
      handleConfirm={(ev) => {
        ev.preventDefault();
        form.handleSubmit();
      }}
      title={
        <span className="text-destructive">
          <ExclamationTriangleIcon className="mr-1 inline-block stroke-destructive" />{" "}
          {t("user.delete.title")}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t("user.delete.description.confirm")}{" "}
            <span className="font-bold">{currentRow.pseudo}</span> ?
            <br />
            {t("user.delete.description.role")}{" "}
            <span className="font-bold">{currentRow.role.toUpperCase()}</span>{" "}
            {t("user.delete.description.warning")}
          </p>

          <Form {...form} id="delete-user-form">
            <FormField
              control={form.control}
              name="pseudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("user.delete.fields.username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("user.invite.fields.email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <Alert variant="destructive">
            <AlertTitle>{t("user.delete.alert.title")}</AlertTitle>
            <AlertDescription>
              {t("user.delete.alert.description")}
            </AlertDescription>
          </Alert>
        </div>
      }
    />
  );
}
