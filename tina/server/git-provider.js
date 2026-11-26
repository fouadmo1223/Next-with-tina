import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

// Self-hosted Tina saves through this provider. Every save from the dashboard:
//   1. writes the file into the project on this server (so the site shows it on the next page load), then
//   2. commits it with git and pushes it to your remote (GitLab, Bitbucket or any other git host),
//      so the repository always matches what is live.
// Step 2 is skipped when editing locally (`npm run dev`: you commit your own changes), when the project folder is not
// a git clone, or when turned off with GIT_COMMIT=false / GIT_PUSH=false.
// A git failure never loses the edit: the file is already saved, and the error is logged for the server admin.

const ROOT = process.cwd();
const BRANCH = process.env.GIT_BRANCH || "main";
const COMMIT = process.env.GIT_COMMIT !== "false" && process.env.TINA_PUBLIC_IS_LOCAL !== "true";
const PUSH = process.env.GIT_PUSH !== "false";
const AUTHOR_NAME = process.env.GIT_AUTHOR_NAME || "Tina CMS";
const AUTHOR_EMAIL = process.env.GIT_AUTHOR_EMAIL || "cms@localhost";

// Resolves a repository-relative path and refuses anything outside the project folder.
export function projectPath(relative) {
  const target = path.resolve(/* turbopackIgnore: true */ ROOT, String(relative).replaceAll("\\", "/"));
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) throw new Error(`Refusing path outside the project: ${relative}`);
  return target;
}

const git = (...args) => run("git", args, {
  cwd: ROOT,
  timeout: 60_000,
  env: { ...process.env, GIT_AUTHOR_NAME: AUTHOR_NAME, GIT_AUTHOR_EMAIL: AUTHOR_EMAIL, GIT_COMMITTER_NAME: AUTHOR_NAME, GIT_COMMITTER_EMAIL: AUTHOR_EMAIL, GIT_TERMINAL_PROMPT: "0" },
});

let isRepo;
async function inRepo() {
  if (isRepo === undefined) {
    try {
      await git("rev-parse", "--is-inside-work-tree");
      isRepo = true;
    } catch {
      isRepo = false;
      console.warn("[tina] This folder is not a git clone: dashboard saves are written to disk but not committed.");
    }
  }
  return isRepo;
}

// One git operation at a time, in the order saves arrive.
let queue = Promise.resolve();
export function commitFiles(files, message) {
  const job = queue.then(async () => {
    if (!COMMIT || !(await inRepo())) return;
    try {
      await git("add", "--all", "--", ...files);
      const { stdout } = await git("status", "--porcelain", "--", ...files);
      if (!stdout.trim()) return;
      await git("commit", "-m", message, "--", ...files);
      if (!PUSH) return;
      try {
        await git("push", "origin", `HEAD:${BRANCH}`);
      } catch {
        // Someone pushed code in the meantime: replay this edit on top of it and try once more.
        await git("pull", "--rebase", "--autostash", "origin", BRANCH);
        await git("push", "origin", `HEAD:${BRANCH}`);
      }
    } catch (error) {
      console.error(`[tina] Saved, but git could not commit/push "${message}":`, error.stderr || error.message);
    }
  });
  queue = job.catch(() => {});
  return job;
}

export class ServerGitProvider {
  async onPut(key, value) {
    const file = projectPath(key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, value);
    // Committing runs in the background so the dashboard's Save returns straight away.
    commitFiles([key], `Update ${key} (Tina)`);
  }

  async onDelete(key) {
    await fs.rm(projectPath(key), { force: true });
    commitFiles([key], `Delete ${key} (Tina)`);
  }
}
