import { useTranslation } from "react-i18next";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  data,
} from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Link } from "~/components/atoms/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Loader } from "~/components/ui/loader";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import i18next from "~/modules/i18n.server";
import { alertMessageHelper } from "~/server/session/alert-message.server";

export { meta } from "~/config/meta";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await i18next.getFixedT(request, "admin");
  const { message, headers } = await alertMessageHelper(request);

  return data(
    {
      message,
      // Translated meta tags
      title: t("forgot.title"),
      description: t("forgot.description"),
    },
    {
      headers,
    }
  );
};

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) return { errors, defaultValues };

  const { email } = data;
  const existingUser = await context.remixService.auth.forgotPassword({
    email,
  });

  return {
    code: "custom",
    path: ["alert", "success"],
    message: existingUser.message,
    defaultValues,
  };
};

function ForgotPasswordPage() {
  const { t } = useTranslation("admin");

  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const form = useRemixForm({
    resolver,
  });

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[420px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle> {t("forgot.title")}</CardTitle>
          <CardDescription>{t("forgot.description")}</CardDescription>
        </CardHeader>
        <CardContent className={cn("grid gap-6")}>
          <Separator />
          <Form {...{ ...form, actionData, loaderData }} className="py-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "fields.email_placeholder",
                        "name@example.com"
                      )}
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row-reverse justify-between items-center">
              <Button disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader />
                ) : (
                  t("forgot.confirm", "Confirm email")
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Link to="/signin" className="text-sm flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          {t("signin.back", "Back to normal signin")}
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
