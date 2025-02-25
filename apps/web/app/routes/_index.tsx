import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  data,
  useActionData,
  useFetcher,
  useLoaderData,
} from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import Brand from "~/assets/Brand";

import { AnimatedBackground } from "~/components/newsletter/animated-background";
import { SparklesText } from "~/components/newsletter/sparkles-text";
import { Button } from "~/components/ui/button";
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
import { LanguageSwitcher } from "~/containers/language-switcher";
import i18next from "~/modules/i18n.server";

import { getOptionalUser } from "~/server/auth.server";
import {
  alertMessageGenerator,
  alertMessageHelper,
} from "~/server/session/alert-message.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const t = await i18next.getFixedT(request, "showcase");
  const user = await getOptionalUser({ context });

  const { message, headers } = await alertMessageHelper(request);

  return data(
    {
      isAuth: !!user,
      message,
      // Translated meta tags
      title: t("title"),
      description: t("description"),
    },
    {
      headers,
    }
  );
};

export { meta } from "~/config/meta";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const lang = await i18next.getLocale(request);

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

  const { firstName, email, interests } = formData;
  await context.remixService.newsletter.subscribeToNewsletter(
    email,
    firstName,
    interests,
    lang || "fr"
  );

  return data(
    { result: formData },
    {
      headers: [await alertMessageGenerator("newsletter_success", "success")],
    }
  );
};

const schema = z.object({
  firstName: z.string(),
  email: z.string().email(),
  interests: z.string(),
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export default function HomePage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const fetcher = useFetcher();

  const { t } = useTranslation("showcase");

  const form = useRemixForm({
    mode: "onSubmit",
    resolver,
    fetcher,
  });

  const { isSubmitSuccessful } = form.formState;

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      triggerConfetti();
    }
  }, [isSubmitSuccessful]);

  return (
    <div className="relative min-h-screen bg-neutral-950">
      <AnimatedBackground />
      <main className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center p-4">
        <header className="fixed top-0 right-0 left-0 z-50 flex justify-end p-4">
          <LanguageSwitcher />
        </header>
        <div className="w-full max-w-lg mx-auto space-y-8">
          <div className="flex justify-center">
            <Brand />
          </div>
          <div className="text-center text-white space-y-6">
            <SparklesText
              text={t("newsletter.title")}
              colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
              sparklesCount={7}
              className="text-4xl font-bold"
            />
            <p className="text-muted-foreground text-lg">
              {t("newsletter.description")}
            </p>
          </div>
          <div className="bg-brown/80 text-white backdrop-blur-sm p-8 rounded-lg shadow-lg border border-white/10">
            <Form {...{ ...form, actionData, loaderData }}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("newsletter.form.firstName.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("newsletter.form.firstName.placeholder")}
                        type="text"
                        className="rounded bg-transparent text-white/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newsletter.form.email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("newsletter.form.email.placeholder")}
                        type="email"
                        className="rounded bg-transparent text-white/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("newsletter.form.interests.label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("newsletter.form.interests.placeholder")}
                        className="rounded bg-transparent text-white/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full rounded border-2b bg-transparent text-white border border-white">
                {t("newsletter.form.submit")}
              </Button>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
