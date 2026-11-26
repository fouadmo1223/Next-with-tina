import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Language routing only (ar at "/", en at "/en"). The Tina dashboard (/admin) and static files are left alone.
export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
