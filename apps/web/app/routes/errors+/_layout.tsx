import { Outlet } from "react-router";

import { ShowcaseFooter } from "~/containers/showcase/footer";

export default function ErrorsLayout() {
  return (
    <>
      <section className="container relative min-h-screen flex-col items-center justify-center grid">
        <Outlet />
      </section>
      <ShowcaseFooter />
    </>
  );
}
