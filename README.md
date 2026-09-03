# Inasha Discord Bot

[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/MrLuckyGamer/inasha-discord-bot)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg?logo=node&logoColor=white)](https://nodejs.org/)
[![discord.js](https://img.shields.io/badge/discord.js-%5E14.15.3-7289da.svg)](https://discord.js.org/)
[![license](https://img.shields.io/badge/license-LICENSED-green.svg)](https://github.com/MrLuckyGamer/inasha-discord-bot/blob/main/LICENSE.md)

**Inasha** is an all-purpose Discord bot with moderation, fun, and utility commands. It enhances server engagement, provides entertainment, and helps keep communities safe. The bot supports both prefix commands (`i>`) and modern slash commands, includes server statistics tracking, and automatic responses.

---

## Features
- Utility commands (avatar, botinfo, help, invite, ping, serverinfo, serverstats, uptime, userinfo)  
- Moderation commands (addrole, ban, kick, lock, unlock, purge, removerole, warn)  
- Casino commands (balance, daily, roulette, slots)
- Fun commands (coinflip, family, fish, fishlb, freaky, gay, hug, kiss, roll, rtd, ship, slap)  
- Automatic server statistics (members/channels) with periodic updates  
- Toggleable auto-responses for messages containing "meow" and dog words ("woof", "bark", etc.), enabled by default and switchable per-server with `autoresponse`
- Counting game: turns a channel into a collaborative counting game, toggleable per-server with `counting`
- Slash command support + automatic global slash command registration/cleanup  
- Logs guild add/remove events to console  
- Configurable via environment variables (recommended) or `config.json`

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
- `i>userinfo` — Display detailed user information
- `i>autoresponse` — Enable/disable the cat/dog chat auto-replies (aliases: `ar`, `autoreply`)
- `i>counting` — Enable/disable the counting game in a channel (alias: `count`)

**Moderation**
- `i>addrole` — Add a role to a user
- `i>ban` — Ban a user  
- `i>kick` — Kick a user  
- `i>lock` / `i>unlock` — Lock/unlock channel  
- `i>purge` — Bulk delete messages
- `i>removerole` — Remove a role from a user
- `i>warn` — Warn a user

**Casino**
- `i>balance` — Check your casino balance and stats
- `i>roulette` — Play roulette (Red 1.5x, Black 2x, Green 15x)
- `i>slots` — Play the slot machine (2x or 9x jackpot)

**Fun**
- `i>cat` — Random cat image
- `i>coinflip` — Flip a coin
- `i>family` — Family tree
- `i>fish` — Go fishing
- `i>fishlb` — Fishing leaderboard
- `i>freaky` — Freaky meter
- `i>gay` — Gay meter
- `i>hug` — Hug someone
- `i>kiss` — Kiss someone
- `i>roll` — Roll a dice
- `i>rtd` — Roll the dice
- `i>ship` — Ship two users
- `i>slap` — Slap someone

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

**Option 1: Environment Variables (Recommended for Production)**

Set the following environment variables:
```bash
token=YOUR_BOT_TOKEN
prefix=i>
clientId=YOUR_CLIENT_ID
guildId=YOUR_GUILD_ID
NODE_ENV=production
PORT=3000
```

For Dokploy or similar deployment platforms, add these in the environment variables section.

**Option 2: config.json (Local Development)**

Create a `config.json` in the project root:
```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "i>",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID"
}
```

**Note:** The bot will use environment variables if available, making it easy to deploy without committing sensitive tokens.

### Run
```bash
npm start
```
Dev (auto-restart with nodemon):
```bash
npm run dev
```

---

## Deployment

### Dokploy / Cloud Deployment
1. Push your code to a Git repository
2. In Dokploy, create a new application and connect your repository
3. Add the following environment variables in Dokploy:
   ```
   token=YOUR_BOT_TOKEN
   prefix=i>
   clientId=YOUR_CLIENT_ID
   guildId=YOUR_GUILD_ID
   NODE_ENV=production
   PORT=3000
   ```
4. Deploy and the bot will automatically use the environment variables

### PM2 (Process Manager)
For long-running deployments using PM2:
```bash
npm install -g pm2
pm2 start index.js --name inasha-bot
pm2 save
```

### Docker
You can also containerise the bot using Docker with environment variables passed at runtime.

---

## Slash Commands / Command Registration
The bot includes code to register global slash commands via the Discord REST API (`discord.js` REST + `Routes.applicationCommands`). On startup the bot:
- collects slash command definitions from `/slash-commands/`,
- constructs `slashJSON`,
- fetches existing global commands and deletes any global commands that are not present in the current `slashJSON`,
- re-uploads the current `slashJSON` as global commands.

**Warning:** This code will delete old global slash commands for this application ID if they are not present in your `slash-commands` folder. When testing, consider using guild-scoped (per-server) commands to avoid propagation delays or accidental global removals.

---

## Auto-Responses

The bot responds automatically to messages containing:
- `meow` - cat reply 🐱
- `woof`, `bark`, `bork`, `ruff`, `arf` - dog reply 🐶

Both are **on by default** and can be toggled per-server with the `autoresponse` command
(requires **Manage Server** permission):

```
i>autoresponse            # show status of all auto-responses
i>autoresponse cat off    # disable cat replies in this server
i>autoresponse dog on     # re-enable dog replies in this server
```

`ar` and `autoreply` also work as aliases. To add a new auto-response type (e.g. a
`fox` reply), add an entry to `utils/autoresponses.js` - no other code changes needed.

## Counting Game

Turns a channel into a collaborative counting game: members count upward one message at a
time, and the bot reacts to every attempt.

- ✅ reaction + the count advances, when a message is the correct next number.
- ❌ reaction + a reply naming the expected number, when it's wrong - and the count resets
  back to **1**.
- Numbers can be typed as digits (`42`) or spelled out in English (`forty two`,
  `forty-two`, `one hundred and one`, `two thousand twenty four`, ...). Any other message in
  the channel (regular chat, emoji, etc.) is ignored.

Off by default; toggle per-server with the `counting` command (requires **Manage Server**
permission):

```
i>counting enable     # turn on counting in the current channel (starts at 1)
i>counting status      # show whether it's on, which channel, and the next number
i>counting disable     # turn it off
```

`count` also works as an alias. Only one counting channel is active per server at a time -
running `counting enable` in a different channel moves the game (and resets the count) there.

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

## File / Code notes (based on your repo)
- `index.js` — main entry, sets up client, loads command files (and their aliases), registers slash commands, event listeners, presence, the counting game, toggleable auto-responses, and periodic stats update. Configured to read from environment variables for production deployment.
- `commands/` — prefix command files loaded as `client.commands`.
- `slash-commands/` — slash command modules loaded into `client.slashCommands` and registered via REST.
- `./commands/serverstats.js` (or similar) — contains `updateStats(guild)` used to create/update stat channels.
- `utils/autoresponses.js` — registry of auto-response triggers/replies (cat, dog, ...).
- `utils/autoresponseStore.js` — per-server enable/disable persistence for auto-responses.
- `utils/countingStore.js` — per-server counting channel + count persistence.
- `utils/parseNumber.js` — parses digits and spelled-out numbers ("forty two") for the counting game.
- `package.json` lists `discord.js` `^14.15.3` and `node` engine `>=18`.

## Data Storage

Persistent data is stored as JSON files in `./data/` (created automatically on first run):
- `data/serverstats/` - stat channel IDs
- `data/autoresponses/` - per-server cat/dog auto-response toggles
- `data/counting/` - per-server counting channel + current count

---

## Troubleshooting
- **Environment variables not loading:** Ensure your deployment platform correctly sets the environment variables. Check logs for missing token/clientId errors.
- **Slash commands don't appear:** Ensure the bot has `applications.commands` scope and the `clientId` is correct. Global command changes can take up to an hour to propagate.
- **Stats channels fail to update:** Confirm the bot has `Manage Channels` permission and the target guild exists in cache.
- **Bot won't start:** Check console output for errors. Missing or invalid token/clientId will prevent login.
- **Config.json vs Environment Variables:** If both exist, environment variables take precedence. For production, use environment variables only.

---

## Bot Information
- **Author:** Lucky  
- **Version:** 1.0.0
- **Node.js:** >= 18  
- **Discord.js:** ^14.15.3  
- **Prefix:** `i>`  
- **License:** LICENSED