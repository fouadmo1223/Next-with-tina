// Runs before `tinacms build`: removes Tina's database so it is rebuilt from the files in /content.
// The database is only an index (content and logins live in the files), so nothing is lost.
const fs = require("node:fs");
const path = require("node:path");

const dir = path.dirname(path.resolve(process.env.TINA_DB_FILE || ".tina-data/tina.db"));
fs.rmSync(dir, { recursive: true, force: true });
console.log(`Cleared Tina index at ${path.relative(process.cwd(), dir) || dir}`);
