const fs = require("fs");

const DATA_DIR = "./data/casino";
const moneyFile = `${DATA_DIR}/money.json`;
const rouletteFile = `${DATA_DIR}/roulette.json`;
const slotsFile = `${DATA_DIR}/slots.json`;
const dailyFile = `${DATA_DIR}/daily.json`;

const STARTING_BALANCE = 1000;
const DAILY_AMOUNT = 500;
const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function ensureDataDir() {
  if (!fs.existsSync("./data")) fs.mkdirSync("./data");
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
}

// ── Generic load/save ─────────────────────────────────────────────────────────

function loadJSON(file) {
  ensureDataDir();
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
}

function saveJSON(file, data) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Money ─────────────────────────────────────────────────────────────────────

function getMoneyData() {
  return loadJSON(moneyFile);
}

function getMoney(guildId, userId) {
  const data = getMoneyData();
  if (!data[guildId]) data[guildId] = {};
  if (data[guildId][userId] === undefined) data[guildId][userId] = STARTING_BALANCE;
  return data[guildId][userId];
}

function setMoney(guildId, userId, amount) {
  const data = getMoneyData();
  if (!data[guildId]) data[guildId] = {};
  data[guildId][userId] = Math.max(0, amount);
  saveJSON(moneyFile, data);
  return data[guildId][userId];
}

function addMoney(guildId, userId, amount) {
  return setMoney(guildId, userId, getMoney(guildId, userId) + amount);
}

function subtractMoney(guildId, userId, amount) {
  return setMoney(guildId, userId, getMoney(guildId, userId) - amount);
}

// ── Roulette stats ────────────────────────────────────────────────────────────

function getRouletteStats(guildId, userId) {
  const data = loadJSON(rouletteFile);
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) {
    data[guildId][userId] = { wins: 0, losses: 0, totalWon: 0, totalLost: 0 };
  }
  return { data, stats: data[guildId][userId] };
}

function updateRouletteStats(guildId, userId, won, amount) {
  const { data, stats } = getRouletteStats(guildId, userId);
  if (won) {
    stats.wins++;
    stats.totalWon += amount;
  } else {
    stats.losses++;
    stats.totalLost += amount;
  }
  saveJSON(rouletteFile, data);
}

// ── Slots stats ───────────────────────────────────────────────────────────────

function getSlotsStats(guildId, userId) {
  const data = loadJSON(slotsFile);
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) {
    data[guildId][userId] = { wins: 0, losses: 0, totalWon: 0, totalLost: 0, jackpots: 0, doubles: 0 };
  }
  return { data, stats: data[guildId][userId] };
}

function updateSlotsStats(guildId, userId, won, amount, type) {
  const { data, stats } = getSlotsStats(guildId, userId);
  if (won) {
    stats.wins++;
    stats.totalWon += amount;
    if (type === "jackpot") stats.jackpots++;
    if (type === "double") stats.doubles++;
  } else {
    stats.losses++;
    stats.totalLost += amount;
  }
  saveJSON(slotsFile, data);
}

// ── Daily reward ──────────────────────────────────────────────────────────────

/**
 * Attempt to claim daily reward.
 * Returns { claimed: true, newBalance, amount } or { claimed: false, msLeft }
 */
function claimDaily(guildId, userId) {
  const data = loadJSON(dailyFile);
  if (!data[guildId]) data[guildId] = {};

  const now = Date.now();
  const last = data[guildId][userId] || 0;
  const msLeft = DAILY_COOLDOWN_MS - (now - last);

  if (msLeft > 0) {
    return { claimed: false, msLeft };
  }

  data[guildId][userId] = now;
  saveJSON(dailyFile, data);

  const newBalance = addMoney(guildId, userId, DAILY_AMOUNT);
  return { claimed: true, newBalance, amount: DAILY_AMOUNT };
}

module.exports = {
  STARTING_BALANCE,
  DAILY_AMOUNT,
  getMoney,
  setMoney,
  addMoney,
  subtractMoney,
  updateRouletteStats,
  getRouletteStats,
  updateSlotsStats,
  getSlotsStats,
  claimDaily,
  loadJSON,
};