# Inasha Discord Bot

[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/MrLuckyGamer/inasha-discord-bot)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg?logo=node&logoColor=white)](https://nodejs.org/)
[![discord.js](https://img.shields.io/badge/discord.js-%5E14.15.3-7289da.svg)](https://discord.js.org/)
[![license](https://img.shields.io/badge/license-LICENSED-green.svg)](https://github.com/MrLuckyGamer/inasha-discord-bot/blob/main/LICENSE.md)

**Inasha** is an all-purpose Discord bot with moderation, fun, and utility commands. It enhances server engagement, provides entertainment, and helps keep communities safe. The bot supports both prefix commands (`i>`) and modern slash commands, includes server statistics tracking, and automatic responses.

---

## Features
- Utility commands (avatar, botinfo, help, invite, ping, serverinfo, serverstats, uptime)  
- Moderation commands (ban, kick, lock, unlock, purge, warn)  
- Fun commands (coinflip, family, fish, fishlb, freaky, gay, hug, kiss, roll, rtd, ship, slap)  
- Automatic server statistics (members/channels) with periodic updates  
- Auto-responses for messages containing "meow" and dog words ("woof", "bark", etc.)  
- Slash command support + automatic global slash command registration/cleanup  
- Logs guild add/remove events to console  
- Configurable via `config.json` or env vars

---

## Commands (quick list)
**Utility**
- `i>avatar` — Show avatar  
- `i>botinfo` — Bot info  
- `i>help` — Command list  
- `i>invite` — Invite link  
- `i>ping` — Latency  
- `i>serverinfo` — Server info  
- `i>serverstats` — Toggle server stat channels  
- `i>uptime` — Uptime

**Moderation**
- `i>ban` — Ban a user  
- `i>kick` — Kick a user  
- `i>lock` / `i>unlock` — Lock/unlock channel  
- `i>purge` — Bulk delete messages  
- `i>warn` — Warn a user

**Fun**
- `i>coinflip`, `i>family`, `i>fish`, `i>fishlb`, `i>freaky`, `i>gay`, `i>hug`, `i>kiss`, `i>roll`, `i>rtd`, `i>ship`, `i>slap`

---

## Installation

### Prerequisites
- Node.js >= 18  
- npm (or yarn)  
- A Discord bot token and Client ID  
- Access to the server to add the bot

### Clone & install
```bash
git clone https://github.com/MrLuckyGamer/inasha-discord-bot.git
cd inasha-discord-bot
npm install
```

### Configuration
Create a `config.json` in the project root (example below) **or** use environment variables (`DISCORD_TOKEN`, `CLIENT_ID`, `PREFIX`).

`config.json` example:
```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "i>",
  "clientId": "YOUR_CLIENT_ID"
}
```

### Run
```bash
npm start
```
Dev (auto-restart with nodemon):
```bash
npm run dev
```

---

## Slash Commands / Command Registration
The bot includes code to register global slash commands via the Discord REST API (`discord.js` REST + `Routes.applicationCommands`). On startup the bot:
- collects slash command definitions from `/slash-commands/`,
- constructs `slashJSON`,
- fetches existing global commands and deletes any global commands that are not present in the current `slashJSON`,
- re-uploads the current `slashJSON` as global commands.

**Warning:** This code will delete old global slash commands for this application ID if they are not present in your `slash-commands` folder. When testing, consider using guild-scoped (per-server) commands to avoid propagation delays or accidental global removals.

---

## Server Statistics
- The bot updates server stats on `guildMemberAdd`, `guildMemberRemove`, `channelCreate`, `channelDelete`, and runs a periodic update every 10 minutes.
- Server stats are persisted in `./data/serverstats/serverstats.json` (ensure `data/serverstats/` exists and is writeable).
- On startup the bot loads existing stats and updates the channels for any guilds present in cache.

---

## Development workflow
1. Fork the repo.  
2. Create a branch:
```bash
git checkout -b feature/your-feature
```
3. Implement & test changes locally.  
4. Commit & push:
```bash
git add .
git commit -m "feat: description"
git push origin feature/your-feature
```
5. Open a Pull Request.

---

## Environment / Deployment tips
- Use environment variables in production rather than committing `config.json`.
- For long-running deployments use PM2, Docker, or a cloud provider. Example with PM2:
```bash
npm install -g pm2
pm2 start index.js --name inasha-bot
pm2 save
```

---

## File / Code notes (based on your repo)
- `index.js` — main entry, sets up client, loads command files, registers slash commands, event listeners, presence, and periodic stats update.
- `commands/` — prefix command files loaded as `client.commands`.
- `slash-commands/` — slash command modules loaded into `client.slashCommands` and registered via REST.
- `./commands/serverstats.js` (or similar) — contains `updateStats(guild)` used to create/update stat channels.
- `package.json` lists `discord.js` `^14.15.3` and `node` engine `>=18`.

---

## Troubleshooting
- If slash commands don't appear: ensure the bot has `applications.commands` scope and the `clientId` is correct. Global command changes can take up to an hour to propagate.
- If stats channels fail to update: confirm the bot has `Manage Channels` permission and the target guild exists in cache.
- Check bot log output (console) for errors on startup; missing or invalid `config.json` / token will prevent login.

---

## Bot Information
- **Author:** Lucky  
- **Version:** 1.0.0
- **Node.js:** >= 18  
- **Discord.js:** ^14.15.3  
- **Prefix:** `i>`  
- **License:** LICENSED
