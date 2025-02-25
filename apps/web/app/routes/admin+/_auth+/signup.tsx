import { useTranslation } from "react-i18next";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  data,
  redirect,
  redirectDocument,
} from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Link } from "~/components/atoms/link";
import { Button } from "~/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Card } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import i18next from "~/modules/i18n.server";
import { alertMessageHelper } from "~/server/session/alert-message.server";

export { meta } from "~/config/meta";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  if (await context.remixService.admin.retrieveAnAdmin()) {
    return redirect("/admin");
  }

  const t = await i18next.getFixedT(request, "admin");

  const params = new URL(request.url).searchParams;
  const error = params.get("error");

  const { message, headers } = await alertMessageHelper(request);

  return data(
    {
      message: error ? [error, "destructive"] : message,
      error: !!error,
      // Translated meta tags
      title: t("signup.title"),
      description: t("signup.description"),
    },
    {
      headers,
    }
  );
};

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) {
    return { errors, defaultValues };
  }

  const existingUser = await context.remixService.auth.checkIfUserExists({
    ...data,
    isAdmin: true,
    withPassword: true,
  });

  if (errors || existingUser.error) {
    return {
      ...existingUser,
      code: "custom",
      path: ["alert", "destructive"],
      defaultValues,
    };
  }

  const { email } = data;
  const { sessionToken } = await context.remixService.auth.authenticateUser({
    email,
  });

  const urlParams = new URL(request.url).searchParams;
  const redirectTo = urlParams.get("redirectTo") || "/admin/dashboard";

  return redirectDocument(
    `/auth?token=${sessionToken}&redirectTo=${redirectTo}`
  );
};

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

function AdminSigninPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const { t } = useTranslation("admin");
  const form = useRemixForm<FormData>({
    resolver,
  });

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[420px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("signup.title")}</CardTitle>
          <CardDescription>{t("signup.description")}</CardDescription>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row-reverse justify-between items-center">
              <Button>{t("signup.action", "Connect")}</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Link to="/signup" className="text-sm flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          {t("signup.back", "Back to normal signup")}
        </Link>
        <Link to="/admin/forgot-password" className="text-sm">
          {t("forgot.link", "Forgot password ?")}
        </Link>
      </div>
    </div>
  );
}

export default AdminSigninPage;
