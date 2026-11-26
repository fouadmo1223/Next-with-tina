// Adds an editor login, or resets an existing editor's password, in content/users/index.json.
//   npm run editor -- <username> <password> ["Full name"]
// The password is stored hashed, and the editor is asked to choose a new one at first login.
// Commit the file (and redeploy, or run `npm run reindex` on the server) for it to take effect.
const fs = require("node:fs");
const crypto = require("node:crypto");

const [username, password, name] = process.argv.slice(2);
if (!username || !password || password.length < 8) {
  console.error('Usage: npm run editor -- <username> <password (8+ characters)> ["Full name"]');
  process.exit(1);
}

// Same format Tina uses: hex salt (32 bytes) followed by the PBKDF2-SHA256 hash (25,000 rounds, 512 bytes).
const salt = crypto.randomBytes(32).toString("hex");
const hash = crypto.pbkdf2Sync(password, salt, 25000, 512, "sha256").toString("hex");

const file = "content/users/index.json";
const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { users: [] };
const entry = { username, name: name || username, email: "", password: { value: `${salt}${hash}`, passwordChangeRequired: true } };
const index = data.users.findIndex((user) => user.username === username);
if (index >= 0) data.users[index] = { ...data.users[index], password: entry.password, ...(name && { name }) };
else data.users.push(entry);
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`${index >= 0 ? "Reset password for" : "Added"} editor "${username}" in ${file}.`);
