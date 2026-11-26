import fs from "node:fs";
import path from "node:path";
import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { SqliteLevel } from "sqlite-level";
import { ServerGitProvider } from "./server/git-provider";

// Where Tina keeps its content index.
//  - Local editing (`npm run dev`): in memory, read straight from the files.
//  - On your server: one SQLite file (TINA_DB_FILE, default .tina-data/tina.db), rebuilt from the files by `npm run build`.
// The JSON files in /content stay the source of truth either way; the index only makes the dashboard fast.
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

function serverDatabase() {
  const filename = path.resolve(/* turbopackIgnore: true */ process.env.TINA_DB_FILE || ".tina-data/tina.db");
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  return createDatabase({
    gitProvider: new ServerGitProvider(),
    databaseAdapter: new SqliteLevel({ filename }),
    namespace: process.env.GIT_BRANCH || "main",
  });
}

export default isLocal ? createLocalDatabase() : serverDatabase();
