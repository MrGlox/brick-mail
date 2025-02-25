import { createThemeAction } from "remix-themes";

import { themeSessionResolver } from "~/server/session/theme.server";

export const action = createThemeAction(themeSessionResolver);
