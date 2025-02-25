import { MetaFunction } from "react-router";

import { loader } from "~/root";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.title || "Homepage | Brick Mail"}` },
  {
    name: "description",
    content:
      data?.description ||
      "This brick-mail is a modern web application template that provides a foundation for building full-stack applications using NestJS and Remix.",
  },
];
