# Deploying on your own server (cPanel / Plesk) with self-hosted Tina

Everything runs on your server: the site, the dashboard at `/admin`, editor logins and the uploads. No TinaCloud,
no outside database.

> Prefer TinaCloud to handle logins (GitHub repos only)? See [TINACLOUD.md](TINACLOUD.md) for that option.

**How editing works once it is live**

1. An editor opens `https://your-domain.com/admin` and logs in.
2. They change a text or upload an image and click **Save**.
3. The server writes the change into the project's files, and the site shows it on the next page load (no rebuild).
4. The server also commits the change and pushes it to your GitLab/Bitbucket repository, so the repo always
   matches the live site. If a developer pushed code in the meantime, the edit is replayed on top of it.

| Piece | Where it lives |
| --- | --- |
| Texts and records | `content/**/*.json` |
| Images and PDFs | `public/uploads/` (served at `/uploads/...`) |
| Editor logins | `content/users/index.json` (passwords hashed) |
| Tina's index | `.tina-data/tina.db` (SQLite, rebuilt by every `npm run build`, not in git) |

---

## What you need

- Node.js **20.9 or newer** (22 recommended) in cPanel's *Setup Node.js App* or Plesk's *Node.js* extension.
- **SSH or Terminal** access (cPanel → Terminal, Plesk → SSH) and `git` on the server.
- A **private** GitLab or Bitbucket repository with this project in it.
- About **2 GB of memory** for `npm run build`. If your plan kills the build, see *Troubleshooting*.

## 1. Create an access token so the server can push

The server pushes the dashboard's saves to your repo, so it needs a token with write access.

- **GitLab:** project → *Settings → Access tokens* → role **Developer**, scope **write_repository**.
  Clone URL: `https://oauth2:<TOKEN>@gitlab.com/<group>/<repo>.git`
- **Bitbucket:** repository → *Repository settings → Access tokens* → permission **Repositories: Write**.
  Clone URL: `https://x-token-auth:<TOKEN>@bitbucket.org/<workspace>/<repo>.git`

## 2. Clone the project on the server

In the server's terminal, clone it **outside** `public_html` / `httpdocs`:

```bash
cd ~
git clone https://oauth2:<TOKEN>@gitlab.com/<group>/<repo>.git alnjoom
cd alnjoom
git config user.name  "Alnjoom CMS"
git config user.email "cms@your-domain.com"
```

The app must run from this clone: that is what lets dashboard saves be committed and pushed.

## 3. Create the `.env` file

The server needs a `.env` file with its settings and secrets. It is **not** in the repository (`.gitignore` keeps
it out, because it holds secrets), so you create it once on the server, next to `package.json`:

```bash
cd ~/alnjoom
cp .env.example .env
```

Open `.env` (cPanel *File Manager* → *Edit*, or `nano .env`) and fill in section **A. Self-hosted**:

| Variable | What to put |
| --- | --- |
| `NEXTAUTH_SECRET` | A long random value that signs editor logins. Generate it on the server with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and paste the output. Keep it secret; changing it logs everyone out. |
| `NEXTAUTH_URL` | The site's public address, e.g. `https://your-domain.com` (with `https://`, no `/` at the end). |
| `GIT_BRANCH` | The branch the clone is on, usually `main`. |
| `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL` | Who the dashboard's commits are by, e.g. `Alnjoom CMS` / `cms@your-domain.com`. |

Leave section **B. TinaCloud** commented out: setting `NEXT_PUBLIC_TINA_CLIENT_ID` would switch the site to the
TinaCloud option.

Good to know:

- **On your computer you don't need a `.env`.** `npm run dev` works without one.
- **Never commit `.env`** or paste its values into the repo, chats or tickets.
- A `.env` file works for both the running app and the terminal commands (`npm run build`, `npm run reindex`), so
  use it rather than only the control panel's environment-variable screen.
- After changing `.env`, restart the app (and run `npm run build` again if you changed a `NEXT_PUBLIC_` value).

## 4a. cPanel: create the Node.js app

*cPanel → Setup Node.js App → Create Application*

| Setting | Value |
| --- | --- |
| Node.js version | 22 (or the newest ≥ 20.9) |
| Application mode | Production |
| Application root | `alnjoom` |
| Application URL | your domain |
| Application startup file | `server.js` |

The settings come from the `.env` file you created in step 3, so you can leave **Environment variables** empty.
Click **Create**.

cPanel then shows a command to enter the app's environment. Run it in the terminal, then:

```bash
source ~/nodevenv/alnjoom/22/bin/activate && cd ~/alnjoom   # the command cPanel shows you
npm install
npm run build
```

Back in *Setup Node.js App*, click **Restart**.

## 4b. Plesk: create the Node.js app

*Websites & Domains → your domain → Node.js*

| Setting | Value |
| --- | --- |
| Node.js version | 22 (or the newest ≥ 20.9) |
| Application root | the clone, e.g. `/alnjoom` |
| Document root | `/alnjoom/public` |
| Application mode | production |
| Application startup file | `server.js` |

The settings come from the `.env` file you created in step 3. Click **NPM install**, then **Run script** → `build`.
Click **Enable Node.js** / **Restart App**.

(Plesk's *Git* extension deploys copies of the files rather than a working clone, so clone over SSH as in step 2
instead of using it.)

## 5. Log in

Open `https://your-domain.com/admin` and log in with:

- **Username:** `admin`
- **Password:** the one in the message that came with this project

You'll be asked to choose a new password straight away. Add more editors under **Editors (logins)** in the
dashboard, or on the server with `npm run editor -- <username> <password> "Full name"`.

## Updating the site after a code change

When developers push code to the repo:

```bash
cd ~/alnjoom
git pull
npm install
npm run build
```

Then restart the app (cPanel: **Restart** in *Setup Node.js App*; Plesk: **Restart App**). Content edited in the
dashboard is already in the repo, so the pull never loses it. `npm run build` rebuilds Tina's index from the files.

## Local editing

On your own computer `npm run dev` runs the site and the dashboard with no login, saving straight to your files.
Nothing is committed for you there: commit and push your changes as usual, then update the server as above.

## Troubleshooting

- **"NEXTAUTH_SECRET is not set"**: the `.env` file is missing or isn't in the project folder (next to
  `package.json`). Create it as in step 3 and restart.
- **Can't log in / logged out right away**: `NEXTAUTH_URL` must be your exact public address with `https://`.
- **Saves work but don't reach GitLab/Bitbucket**: check the app's log for `[tina] Saved, but git could not commit/push`.
  Usually the clone's URL has no token (`git remote -v`), or the token expired. Fix it with
  `git remote set-url origin https://oauth2:<NEW_TOKEN>@gitlab.com/<group>/<repo>.git`.
- **`npm install` fails on `better-sqlite3`**: it downloads a ready-made binary for your Node version; if the host
  blocks that, ask your host for build tools (`make`, `g++`, `python3`) or pick a Node version they support.
- **`npm run build` is killed (out of memory)**: run `npm run build` on your own computer with the same Node version,
  upload the `.next` and `public/admin` folders to the server, and on the server run only `npm run reindex`,
  then restart.
- **Forgot the admin password**: on the server run `npm run editor -- admin <new-password>`, then `npm run reindex`,
  and restart. You'll be asked to change it at first login.
