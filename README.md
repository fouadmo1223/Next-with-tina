# Alnjoom — Next.js + TinaCMS

The alnjoom home page running on Next.js 16, with everything — texts, records and images — managed in TinaCMS.
There is no API: the site reads the JSON files in `content/` and the images in `public/uploads/`, and the Tina
dashboard edits those same files.

## Run it locally

```bash
npm install
npm run dev
```

- Site: http://localhost:3355 (Arabic) and http://localhost:3355/en
- Dashboard: http://localhost:3355/admin (no login locally)

`npm run dev` starts Tina and Next together. Locally the dashboard saves straight to the files, so a save shows on
the site after a page refresh. No `.env` is needed.

## What you can edit in the dashboard

| Collection | Files | What it holds |
| --- | --- | --- |
| Home page | `content/home/ar.json`, `content/home/en.json` | Every section of the home page, one document per language, plus SEO title/description |
| Site settings | `content/settings/site.json` | Site name, description, logo, favicon, phone, WhatsApp, email, address, socials (both languages) |
| Services | `content/services/*.json` | The services the home page and the header menu link to |
| Countries | `content/countries/*.json` | Recruitment countries (also the CV nationality filter) |
| CVs | `content/cvs/*.json` | CVs shown first on the home page and searched by the CV filter bar |
| Blog posts | `content/blogs/*.json` | Posts the home page features |

The home page picks services, CVs, countries and posts from those collections with reference fields, so a record is
edited once and used in both languages.

## Images

Every image is an image field: click it in the dashboard to choose one from the media library or upload a new one.
Uploads are saved to `public/uploads/` (`tina/media-store.js` and `src/pages/api/tina-media.js`) and stored in the content as
`/uploads/<file name>`. The site's current 46 images were imported there on 25 Nov 2026.

## Contact form

The home page contact form opens WhatsApp with the visitor's name, phone, email and message already written,
addressed to the WhatsApp number in Site settings (or the phone number when that is empty). Nothing is sent to a server.

## Going live

Tina is fully self-hosted: on your server, editors log in at `/admin`, every save is written to the server's files
(the site shows it immediately) and committed and pushed to your GitLab/Bitbucket repo. Step-by-step instructions
for cPanel and Plesk are in **[DEPLOY.md](DEPLOY.md)**.

Prefer TinaCloud for logins (GitHub repos only)? The site still runs on your server and TinaCloud handles editing:
see **[TINACLOUD.md](TINACLOUD.md)**.

## Not moved yet

Only the home page is in this project. Its links to other pages (`/about`, `/cvs`, `/countries/...`, `/blogs/...`,
`/request`, `/contact`, `/services/...`) don't have routes here yet; their components are still in the original
alnjoom frontend.
<!-- dev change -->
