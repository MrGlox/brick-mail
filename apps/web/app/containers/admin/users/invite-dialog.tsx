import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeClosedIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { useRemixForm } from "remix-hook-form";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Textarea } from "~/components/ui/textarea";

import { SelectDropdown } from "~/containers/admin/select-dropdown";
import { UsersContextType } from "~/routes/admin+/dashboard+/users+/_layout";
import {
  UserInviteForm,
  formSchema,
} from "~/routes/admin+/dashboard+/users+/actions+/invite";

import { userTypes } from "~/server/admin/user.data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersInviteDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation("admin");
  const { setOpen } = useOutletContext<UsersContextType>();
  const fetcher = useFetcher();

  const form = useRemixForm<UserInviteForm>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", role: "", desc: "" },
    submitConfig: {
      action: "actions/invite",
      navigate: false,
    },
    fetcher,
  });

  // Reset the form and close the dialog when the fetcher is idle and there is no error
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data?.error) {
      form.reset();
      setOpen(null);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <EnvelopeClosedIcon /> {t("user.invite.title")}
          </DialogTitle>
          <DialogDescription>{t("user.invite.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form} id="user-invite-form" className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("user.invite.fields.email.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("user.invite.fields.email.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>{t("user.invite.fields.role.label")}</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("user.invite.fields.role.placeholder")}
                  items={userTypes.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>
                  {t("user.invite.fields.description.label")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder={t(
                      "user.invite.fields.description.placeholder"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">{t("user.invite.actions.cancel")}</Button>
          </DialogClose>
          <Button
            isLoading={fetcher.state === "submitting"}
            type="submit"
            form="user-invite-form"
          >
            {t("user.invite.actions.submit")}{" "}
            <PaperPlaneIcon className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
