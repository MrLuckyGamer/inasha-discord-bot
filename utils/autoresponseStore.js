const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "autoresponses", "autoresponses.json");

if (!fs.existsSync(path.dirname(FILE))) fs.mkdirSync(path.dirname(FILE), { recursive: true });
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}");

function load() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/** Whether `type` (e.g. 'cat' / 'dog') is enabled for `guildId`. Defaults to enabled. */
function isEnabled(guildId, type) {
  const data = load();
  return data[guildId]?.[type] !== false;
}

/** Enable or disable `type` (e.g. 'cat' / 'dog') for `guildId`. */
function setEnabled(guildId, type, enabled) {
  const data = load();
  if (!data[guildId]) data[guildId] = {};
  data[guildId][type] = enabled;
  save(data);
}

module.exports = { isEnabled, setEnabled };
