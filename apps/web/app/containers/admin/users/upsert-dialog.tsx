import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";

import { PasswordInput } from "~/components/molecules/password-input";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

import { SelectDropdown } from "~/containers/admin/select-dropdown";

import {
  UserUpsertForm,
  resolver,
} from "~/routes/admin+/dashboard+/users+/actions+/upsert";

import { userTypes } from "~/server/admin/user.data";
import { User } from "~/server/admin/user.schema";

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersUpsertDialog({ currentRow, open, onOpenChange }: Props) {
  const { t } = useTranslation("admin");
  const fetcher = useFetcher();

  const isEdit = !!currentRow;

  const form = useRemixForm<UserUpsertForm>({
    resolver,
    defaultValues: isEdit
      ? {
          ...currentRow?.profile,
          ...currentRow,
          password: "",
          confirmPassword: "",
          isEdit,
        }
      : {
          firstName: "",
          lastName: "",
          pseudo: "",
          email: "",
          role: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          isEdit,
        },
    submitConfig: {
      method: "post",
      action: "actions/upsert",
    },
    fetcher,
  });

  useEffect(() => {
    if (fetcher.state === "idle" && (!isEdit || fetcher.data?.result)) {
      form.reset();
      onOpenChange(false);
    }
  }, [fetcher.state, fetcher.data]);

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent tabIndex={-1} className="max-w-screen-sm">
        <DialogHeader className="text-left">
          <DialogTitle>
            {t(isEdit ? "user.action.title.edit" : "user.action.title.create")}
          </DialogTitle>
          <DialogDescription>
            {t(
              isEdit
                ? "user.action.description.edit"
                : "user.action.description.create"
            )}
            {t("user.action.description.save")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[26.25rem] w-full pr-4 -mr-4 py-1">
          <Form {...form} id="user-form" className="space-y-4 p-0.5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.firstName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "user.action.fields.firstName.placeholder"
                      )}
                      className="col-span-4"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.lastName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("user.action.fields.lastName.placeholder")}
                      className="col-span-4"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pseudo"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.pseudo.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("user.action.fields.pseudo.placeholder")}
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("user.action.fields.email.placeholder")}
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.phoneNumber.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "user.action.fields.phoneNumber.placeholder"
                      )}
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.role.label")}
                  </FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder={t("user.action.fields.role.placeholder")}
                    className="col-span-4"
                    items={userTypes.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.password.label")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("user.action.fields.password.placeholder")}
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    {t("user.action.fields.confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={!isPasswordTouched}
                      placeholder={t(
                        "user.action.fields.confirmPassword.placeholder"
                      )}
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            isLoading={fetcher.state === "submitting"}
            type="submit"
            form="user-form"
          >
            {t("user.action.actions.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
