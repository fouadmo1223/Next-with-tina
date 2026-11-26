# Option 2: TinaCloud + your own server

The site runs on **your server** (cPanel / Plesk), and **TinaCloud** (tina.io) handles editor logins and saving.
The other option, everything on your server with no TinaCloud, is in [DEPLOY.md](DEPLOY.md).

**How editing works**

1. An editor opens `https://your-domain.com/admin` and logs in with their TinaCloud account.
2. They change a text or upload an image and click **Save**.
3. TinaCloud commits the change to your **GitHub** repo (uploads go to `public/uploads/`).
4. A GitHub Action connects to your server and runs `git pull`. The site reads content on every request, so the
   change shows on the next page load, usually within a minute of saving.

Visitors never depend on TinaCloud: the site is served entirely from your server. TinaCloud is only needed to edit.

## Which option should I use?

| | TinaCloud + your server (this file) | Fully self-hosted ([DEPLOY.md](DEPLOY.md)) |
| --- | --- | --- |
| Git host | **GitHub only** | GitLab, Bitbucket or any |
| Editor logins | TinaCloud accounts, managed at app.tina.io | Stored in the project, managed in the dashboard |
| Outside service needed to edit | Yes (tina.io) | No |
| Edit shows on the site | After the GitHub Action pulls (~1 minute) | Immediately |
| Server needs | SSH access for the Action | `git` push access and a database file |
| Cost | Free plan includes a limited number of editors | Free |

Use one option per repository: two setups saving into the same repo would overwrite each other.

---

## 1. Put the project on GitHub

Create a **private** GitHub repository and push the project to its `main` branch.

## 2. Create the TinaCloud project

1. Sign in at https://app.tina.io and click **Create project** → **Import your site**, then pick the GitHub repo.
2. Set **Site URL** to `https://your-domain.com` (and add `http://localhost:3355` for testing).
3. Note the **Client ID** (project *Overview*) and create a **read-only token** (*Tokens* tab).
4. Invite your editors under *Collaborators*.

## 3. Set up the server

Clone the GitHub repo on the server, outside `public_html` / `httpdocs` (a read-only deploy key or token is
enough: the server only pulls):

```bash
cd ~
git clone https://<TOKEN>@github.com/<you>/<repo>.git alnjoom
```

Create the Node.js app exactly as in [DEPLOY.md](DEPLOY.md) step 4a (cPanel) or 4b (Plesk): startup file
`server.js`, Node 22. Then create a file named `.env` in the project folder on the server with these values
(a file rather than the panel's variable screen, so both the app and the build commands see them):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | the Client ID from step 2 |
| `TINA_TOKEN` | the read-only token from step 2 |
| `GIT_BRANCH` | `main` (the branch TinaCloud saves to) |

```env
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-read-only-token
GIT_BRANCH=main
```

About this file:

- It is **not** in the repository: `.gitignore` keeps it out because the token is a secret, so you create it once
  on the server (`cp .env.example .env`, then fill in section **B. TinaCloud** and leave section A empty).
- **On your computer you don't need a `.env`.** `npm run dev` works without one.
- **Never commit `.env`** or paste the token into the repo, chats or tickets.
- The Client ID is built into the dashboard, so after changing it run `npm run build:cloud` again and restart.

`NEXTAUTH_SECRET` and the other `GIT_*` values are not used in this mode.

Then install and build with the **TinaCloud** build command, and restart the app:

```bash
npm install
npm run build:cloud
```

Setting `NEXT_PUBLIC_TINA_CLIENT_ID` is what switches the project into TinaCloud mode: the dashboard logs in through
TinaCloud and the self-hosted login and media APIs are turned off.

## 4. Let GitHub update the server after each save

The workflow is already in the project: `.github/workflows/deploy-tinacloud.yml`.

1. On your computer, create an SSH key pair for GitHub to use:
   `ssh-keygen -t ed25519 -f alnjoom-deploy -N ""`
2. Add the **public** key (`alnjoom-deploy.pub`) to the server: cPanel → *SSH Access → Manage SSH Keys → Import*,
   then **Authorize** it. On Plesk, add it to the subscription user's `~/.ssh/authorized_keys`.
3. In GitHub → *Settings → Secrets and variables → Actions*, add:
   - `SSH_HOST`: your server's host name
   - `SSH_USER`: the SSH / cPanel user
   - `SSH_KEY`: the contents of the **private** key file `alnjoom-deploy`
   - `APP_DIR`: the project folder on the server, e.g. `/home/youruser/alnjoom`
   - `SSH_PORT`: only if SSH isn't on port 22
   - `NODE_ACTIVATE`: on cPanel, the command cPanel shows to enter the app's environment, e.g.
     `source /home/youruser/nodevenv/alnjoom/22/bin/activate`
4. Push any commit, or run the workflow by hand from GitHub's *Actions* tab, and check that it goes green.

From then on, every save in the dashboard and every developer push updates the server: content-only changes are a
quick `git pull`; code changes also run `npm install`, `npm run build:cloud` and restart the app.

## 5. Log in

Open `https://your-domain.com/admin`, click **Log in** and sign in with your TinaCloud account.

## Local editing

`npm run dev` on your computer works the same in both options: no login, saves go straight to your files. Commit and
push them to GitHub, and the Action updates the server.

## Troubleshooting

- **The dashboard says the Client ID or branch isn't found**: check `NEXT_PUBLIC_TINA_CLIENT_ID`, that the repo's
  branch is `main` (or set `GIT_BRANCH`), and that TinaCloud finished indexing the repo (app.tina.io → *Overview*).
  Then run `npm run build:cloud` again and restart. The Client ID is built into the dashboard, so changing it
  always needs a rebuild.
- **Saves reach GitHub but not the site**: open the failed run in GitHub's *Actions* tab. Usually an SSH secret is
  wrong, the key isn't authorized on the server, or `APP_DIR` points to the wrong folder.
- **The Action fails at `git pull`**: someone changed files directly on the server. On the server, run
  `git status`, then `git stash` or `git checkout -- <file>` to drop those changes.
- **Switching back to self-hosted**: remove `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`, follow
  [DEPLOY.md](DEPLOY.md), and delete `.github/workflows/deploy-tinacloud.yml`.
