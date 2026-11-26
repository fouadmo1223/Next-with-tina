// Startup file for cPanel / Plesk (Phusion Passenger) and any plain `node server.js` host.
// Passenger needs a JavaScript file to start; this one runs the built Next.js site (`npm run build` first).
// Locally, use `npm run dev` instead.
process.env.NODE_ENV = "production";
process.env.TINA_PUBLIC_IS_LOCAL ??= "false";

const { createServer } = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> Alnjoom site ready on port ${port}`);
  });
});
