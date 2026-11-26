import { TinaNodeBackend } from "@tinacms/datalayer";
import { databaseClient, getAuthProvider, selfHostedApiEnabled } from "../../../../tina/server/auth";

// The self-hosted dashboard's backend: GraphQL reads and saves (/api/tina/gql) and login (/api/tina/auth/*).
// Switched off in TinaCloud mode.
let handler;

export default function tinaApi(req, res) {
  if (!selfHostedApiEnabled) return res.status(404).json({ message: "Not found" });
  handler ??= TinaNodeBackend({ authProvider: getAuthProvider(), databaseClient });
  return handler(req, res);
}
