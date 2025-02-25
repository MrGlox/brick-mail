import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, redirect } from "react-router";
import { Link, Outlet, useLocation } from "react-router";

import { buttonVariants } from "~/components/ui/button";
import { ShowcaseFooter } from "~/containers/showcase/footer";
import { cn } from "~/lib/utils";
import { getOptionalUser } from "~/server/auth.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ context });

  if (user && user.role === "SUPERADMIN") {
    return redirect("/admin/dashboard");
  }
};

export default function AdminAuthLayout() {
  const { t } = useTranslation("admin");
  const { pathname } = useLocation();

  return (
    <>
      <header className="flex justify-end gap-4">
        {pathname === "/signin" && (
          <Link
            to="/signup"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            {t("signup.title")}
          </Link>
        )}
        {(pathname === "/signup" ||
          pathname === "/change-password" ||
          pathname === "/forgot-password") && (
          <Link
            to="/signin"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            {t("signin.title")}
          </Link>
        )}
      </header>
      <section className="container relative min-h-screen min-w-full flex-col items-center justify-center grid">
        <article className="lg:p-8 min-w-[420px]">
          <Outlet />
        </article>
      </section>
      <ShowcaseFooter />
    </>
  );
}
