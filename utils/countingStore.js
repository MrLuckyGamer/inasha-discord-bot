const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "counting", "counting.json");

if (!fs.existsSync(path.dirname(FILE))) fs.mkdirSync(path.dirname(FILE), { recursive: true });
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}");

function load() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/** Get the counting state for a guild ({ channelId, count, lastUserId }), or undefined if not set up. */
function getCounting(guildId) {
  return load()[guildId];
}

/** Enable the counting game in `channelId`, resetting the count back to 0. */
function enableCounting(guildId, channelId) {
  const data = load();
  data[guildId] = { channelId, count: 0, lastUserId: null };
  save(data);
}

/** Disable the counting game for a guild entirely. */
function disableCounting(guildId) {
  const data = load();
  delete data[guildId];
  save(data);
}

/** Update the running count after a message is processed. */
function setCount(guildId, count, lastUserId) {
  const data = load();
  if (!data[guildId]) return;
  data[guildId].count = count;
  data[guildId].lastUserId = lastUserId;
  save(data);
}

module.exports = { getCounting, enableCounting, disableCounting, setCount };
