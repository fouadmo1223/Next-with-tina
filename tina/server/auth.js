import { LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../__generated__/databaseClient";

// Who may use the self-hosted dashboard API (src/pages/api/tina and src/pages/api/tina-media).
//  - Local editing (`npm run dev`): anyone on your machine, no login.
//  - Self-hosted on your server: editors log in with the username and password stored in content/users/index.json
//    (passwords hashed). Sessions are signed with NEXTAUTH_SECRET.
//  - TinaCloud mode (NEXT_PUBLIC_TINA_CLIENT_ID set): this API is switched off; TinaCloud handles logins and saving.
export const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
export const selfHostedApiEnabled = isLocal || !process.env.NEXT_PUBLIC_TINA_CLIENT_ID;

let provider;
export function getAuthProvider() {
  if (provider) return provider;
  if (isLocal) return (provider = LocalBackendAuthProvider());
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not set. Add a long random value to your server's environment (see DEPLOY.md).");
  }
  return (provider = AuthJsBackendAuthProvider({
    authOptions: TinaAuthJSOptions({ databaseClient, secret: process.env.NEXTAUTH_SECRET }),
  }));
}

export { databaseClient };
